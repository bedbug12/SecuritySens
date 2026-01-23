import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 🔹 Récupérer la progression de l'utilisateur
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const progress = await prisma.progress.findUnique({
    where: { userId: session.user.id },
    include: {
      scenarioScores: {
        orderBy: { completedAt: 'desc' },
        take: 10,
      },
    },
  });

  // Si pas de progression, créer une progression par défaut
  if (!progress) {
    const defaultProgress = await prisma.progress.create({
      data: {
        userId: session.user.id,
        level: 1,
        xp: 0,
        vigilanceScore: 50,
        completedScenarios: [],
        completedGames: [],
        badges: ['starter'],
        gamesPlayed: 0,
        consecutiveCorrect: 0,
        lastPlayed: null,
      },
    });
    
    return NextResponse.json(defaultProgress);
  }

  return NextResponse.json(progress);
}

// 🔹 Mettre à jour la progression pour les jeux (sauvegarde automatique)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      gameId,
      score,
      questionsAnswered,
      correctAnswers,
      hintsUsed,
      timeSpent,
    } = await request.json();

    // Validation
    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'Invalid score' },
        { status: 400 }
      );
    }

    // Récupérer la progression existante
    const progress = await prisma.progress.findUnique({
      where: { userId: session.user.id },
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      );
    }

    // Calculer le XP pour le jeu
    const gameXPGain = Math.round(score / 20);
    const newXP = progress.xp + gameXPGain;
    const newLevel = Math.floor(newXP / 100) + 1;

    // Mettre à jour les jeux complétés
    const completedGames = gameId && !progress.completedGames.includes(gameId)
      ? [...progress.completedGames, gameId]
      : progress.completedGames;

    // Transaction atomique
    const [updatedProgress] = await prisma.$transaction([
      // 1. Mettre à jour la progression
      prisma.progress.update({
        where: { userId: session.user.id },
        data: {
          xp: newXP,
          level: newLevel,
          gamesPlayed: progress.gamesPlayed + 1,
          completedGames,
          lastPlayed: new Date(),
        },
      }),

      // 2. Sauvegarder le score du jeu (si table existait)
      // Note: Ajouter GameScore model si nécessaire
      // prisma.gameScore.upsert({...})
    ]);

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      xpGained: gameXPGain,
    });
  } catch (error) {
    console.error('❌ Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}