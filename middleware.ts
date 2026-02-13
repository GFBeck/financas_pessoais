import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se autenticação está habilitada
  const authMode = process.env.AUTH_MODE || 'public';
  
  // Se autenticação desabilitada, permitir acesso
  if (authMode === 'disabled') {
    return NextResponse.next();
  }
  
  // Permitir acesso à página de login e registro
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }
  
  // Verificar se usuário está autenticado
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Se não autenticado, redirecionar para login
  if (!token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/transactions/:path*', '/api/categories/:path*'],
};
