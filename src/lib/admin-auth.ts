import { NextRequest } from 'next/server';

export function checkAdminAuth(request: NextRequest): boolean {
  // Check authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.includes('Bearer admin-superuser-id')) {
    return true;
  }

  // Check custom admin role header or cookie
  const roleHeader = request.headers.get('x-user-role');
  if (roleHeader === 'ADMIN') {
    return true;
  }

  const roleCookie = request.cookies.get('area51_user_role')?.value;
  if (roleCookie === 'ADMIN') {
    return true;
  }

  return false;
}
