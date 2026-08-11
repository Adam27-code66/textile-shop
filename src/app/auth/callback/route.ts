import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=Missing+auth+code', origin));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Exchange the code for a session
  const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError || !sessionData?.user) {
    console.error('OAuth callback session error:', sessionError?.message);
    return NextResponse.redirect(new URL('/login?error=Authentication+failed', origin));
  }

  const user = sessionData.user;
  const userEmail = user.email || '';
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0];

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  let role = 'CUSTOMER';

  if (existingProfile) {
    role = existingProfile.role || 'CUSTOMER';
  } else {
    // Create a new profile for first-time Google sign-in users
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        email: userEmail,
        full_name: userName,
        role: 'CUSTOMER'
      }]);

    if (insertError) {
      console.warn('Profile insert notice:', insertError.message);
      // Profile may already exist due to race condition — try fetching again
      const { data: retryProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (retryProfile) {
        role = retryProfile.role || 'CUSTOMER';
      }
    }
  }

  // Build redirect response with role cookie
  const redirectUrl = role === 'ADMIN' ? '/admin/dashboard' : next;
  const response = NextResponse.redirect(new URL(redirectUrl, origin));

  // Set role cookie for middleware route protection
  response.cookies.set('area51_user_role', role, {
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    httpOnly: false, // needs to be readable by client JS
    sameSite: 'lax',
  });

  return response;
}
