import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const next = searchParams.get('next') || '/';

  // 1. Handle OAuth errors properly without showing "Missing auth code"
  if (error || errorDescription) {
    const errorText = errorDescription || error || 'Authentication failed.';
    console.error('[SUPABASE_OAUTH_REDIRECT_ERROR]', {
      error,
      errorDescription,
    });
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('error', errorText);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Read the `code` query parameter and exchange using server-side client
  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('[SUPABASE_OAUTH_EXCHANGE_ERROR]', {
        message: exchangeError.message,
        code: (exchangeError as any).code || exchangeError.name,
        status: (exchangeError as any).status || (exchangeError as any).statusCode,
      });
      const loginUrl = new URL('/login', origin);
      loginUrl.searchParams.set('error', exchangeError.message || 'Failed to exchange authorization code.');
      return NextResponse.redirect(loginUrl);
    }

    if (sessionData?.user) {
      const user = sessionData.user;
      const userEmail = user.email || '';
      const userName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        userEmail.split('@')[0] ||
        'User';

      // Retrieve role from profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      let role = 'CUSTOMER';
      if (existingProfile?.role) {
        role = existingProfile.role;
      } else {
        // Upsert profile for new Google user if missing
        await supabase.from('profiles').upsert(
          [
            {
              id: user.id,
              email: userEmail,
              full_name: userName,
              role: 'CUSTOMER',
            },
          ],
          { onConflict: 'id' }
        );
      }

      // Redirect to / (or /admin/dashboard if ADMIN) after successful login
      const targetPath = role === 'ADMIN' ? '/admin/dashboard' : next;
      const response = NextResponse.redirect(new URL(targetPath, origin));

      // Save role cookie for middleware protection
      response.cookies.set('area51_user_role', role, {
        path: '/',
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
      });

      return response;
    }
  }

  // If no code and no OAuth error parameter provided
  const loginUrl = new URL('/login', origin);
  loginUrl.searchParams.set('error', 'No authentication code provided.');
  return NextResponse.redirect(loginUrl);
}
