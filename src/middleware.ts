// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Routes publiques
    const publicPaths = [
      "/auth/signin",
      "/auth/signup",
      "/auth/error",
      "/auth/verify",
      "/auth/reset-password",
      "/api/auth",
      "/api/auth/callback",
      "/demo", // La démo reste accessible
      "/landingpage",
      "/scenarios",
    ];

    // Si l'utilisateur est connecté et tente d'accéder à la page de connexion
    if (token && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
    if (!token && !publicPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/landingpage", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // La logique d'autorisation est gérée dans la fonction middleware
        return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
);

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match toutes les routes excepté :
     * 1. /api/auth (routes d'authentification)
     * 2. Les fichiers statiques (images, etc.)
     * 3. Les routes publiques
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};