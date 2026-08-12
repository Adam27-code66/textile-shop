import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const currentOrigin = isLocalEnv
    ? origin
    : (forwardedHost ? `https://${forwardedHost}` : origin);

  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const mode = searchParams.get('mode') || 'login';
  const next = searchParams.get('next') || '/';

  // 1. Handle OAuth errors properly without showing "Missing auth code"
  if (error || errorDescription) {
    const errorText = errorDescription || error || 'Authentication failed.';
    console.error('[SUPABASE_OAUTH_REDIRECT_ERROR]', {
      error,
      errorDescription,
    });
    const loginUrl = new URL('/login', currentOrigin);
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
      const loginUrl = new URL('/login', currentOrigin);
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

      const isAdminEmail = userEmail.trim().toLowerCase() === 'adamsamr1127@gmail.com';

      // Check if user is already registered in profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // STRICT REGISTRATION GUARD:
      // If an unregistered customer attempts to Sign In directly without registering first
      if (!isAdminEmail && !existingProfile && mode === 'login') {
        await supabase.auth.signOut();
        const registerUrl = new URL('/register', currentOrigin);
        registerUrl.searchParams.set('error', 'Account not found. You must Register (Sign Up) first before signing in!');
        return NextResponse.redirect(registerUrl);
      }

      let role = isAdminEmail ? 'ADMIN' : (existingProfile?.role || 'CUSTOMER');

      // Upsert profile for registered customer or admin
      await supabase.from('profiles').upsert(
        [
          {
            id: user.id,
            email: userEmail,
            full_name: userName,
            role,
          },
        ],
        { onConflict: 'id' }
      );

      // Redirect to / (or /admin/dashboard if ADMIN) after successful login/registration
      const targetPath = role === 'ADMIN' ? '/admin/dashboard' : next;
      const response = NextResponse.redirect(new URL(targetPath, currentOrigin));

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
  const loginUrl = new URL('/login', currentOrigin);
  loginUrl.searchParams.set('error', 'No authentication code provided.');
  return NextResponse.redirect(loginUrl);
}
