import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Página de login customizada
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname === '/';
      
      // Se estiver tentando acessar o dashboard/home
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redireciona para login
      }
      
      // Se já estiver logado e tentar acessar login, manda pro dashboard
      if (isLoggedIn && nextUrl.pathname.startsWith('/login')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      return true;
    },
  },
  providers: [], // Será preenchido no auth.ts
} satisfies NextAuthConfig;