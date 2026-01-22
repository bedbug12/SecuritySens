// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
      progress?: {
        id: string;
        level: number;
        xp: number;
        vigilanceScore: number;
        completedScenarios: string[];
        completedGames: string[];
        badges: string[];
        gamesPlayed: number;
        consecutiveCorrect: number;
        lastPlayed: Date | null;
      } | null;
    };
  }

  interface User {
    role: string;
    progress?: {
      id: string;
      level: number;
      xp: number;
      vigilanceScore: number;
      completedScenarios: string[];
      completedGames: string[];
      badges: string[];
      gamesPlayed: number;
      consecutiveCorrect: number;
      lastPlayed: Date | null;
    } | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
    progress?: {
      id: string;
      level: number;
      xp: number;
      vigilanceScore: number;
      completedScenarios: string[];
      completedGames: string[];
      badges: string[];
      gamesPlayed: number;
      consecutiveCorrect: number;
      lastPlayed: Date | null;
    } | null;
  }
}