import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET || "chave_padrao_segura";
const SECRET_KEY = new TextEncoder().encode(secret);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('user_session')?.value;

  // Se tentar acessar /livros
  if (request.nextUrl.pathname.startsWith('/livros')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Valida se o token é autêntico e não expirou
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (e) {
      // Token inválido ou expirado
      console.error("Token inválido:", e);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/livros/:path*'],
};