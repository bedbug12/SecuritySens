// app/api/user/scenario-score/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scenarioId, score, timeSpent } = await request.json();

    // Validation des données
    if (!scenarioId || typeof scenarioId !== 'string') {
      return NextResponse.json(
        { error: 'scenarioId is required and must be a string' },
        { status: 400 }
      );
    }

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json(
        { error: 'score must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    if (typeof timeSpent !== 'number' || timeSpent < 0) {
      return NextResponse.json(
        { error: 'timeSpent must be a positive number' },
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

    // Vérifier si le scénario a déjà été complété
    const existingScore = await prisma.scenarioScore.findUnique({
      where: {
        userId_scenarioId: {
          userId: session.user.id,
          scenarioId,
        },
      },
    });

    // Calculer la nouvelle vigilance (70% ancien + 30% nouveau)
    const newVigilanceScore = Math.min(100, Math.max(0,
      Math.round((progress.vigilanceScore * 0.7) + (score * 0.3))
    ));

    // Calculer le XP gagné
    const xpGained = Math.round(score / 10);
    const newXP = progress.xp + xpGained;
    const newLevel = Math.floor(newXP / 100) + 1;

    // Vérifier les badges
    const newBadges = [...progress.badges];
    const completedScenarios = existingScore 
      ? progress.completedScenarios 
      : [...new Set([...progress.completedScenarios, scenarioId])];

    // Badges basés sur les scénarios
    if (completedScenarios.length >= 3 && !newBadges.includes('learner')) {
      newBadges.push('learner');
    }
    if (completedScenarios.length >= 5 && !newBadges.includes('scenario-master')) {
      newBadges.push('scenario-master');
    }
    if (completedScenarios.length >= 10 && !newBadges.includes('scenario-expert')) {
      newBadges.push('scenario-expert');
    }

    // Badges basés sur la consistance
    const consecutiveCorrect = score >= 80 ? progress.consecutiveCorrect + 1 : 0;
    if (consecutiveCorrect >= 3 && !newBadges.includes('consistent')) {
      newBadges.push('consistent');
    }
    if (consecutiveCorrect >= 5 && !newBadges.includes('perfect-streak')) {
      newBadges.push('perfect-streak');
    }

    // Badges basés sur le score
    if (newVigilanceScore >= 80 && !newBadges.includes('vigilant')) {
      newBadges.push('vigilant');
    }
    if (newVigilanceScore >= 90 && !newBadges.includes('security-expert')) {
      newBadges.push('security-expert');
    }
    if (newVigilanceScore >= 95 && !newBadges.includes('cyber-master')) {
      newBadges.push('cyber-master');
    }
    if (score === 100 && !newBadges.includes('perfect-score')) {
      newBadges.push('perfect-score');
    }

    // Transaction atomique : mettre à jour le score ET la progression
    const [scenarioScore, updatedProgress] = await prisma.$transaction([
      // 1. Sauvegarder le score du scénario
      prisma.scenarioScore.upsert({
        where: {
          userId_scenarioId: {
            userId: session.user.id,
            scenarioId,
          },
        },
        create: {
          userId: session.user.id,
          progressId: progress.id,
          scenarioId,
          score,
          timeSpent: timeSpent || 0,
        },
        update: {
          score,
          timeSpent: timeSpent || 0,
          completedAt: new Date(),
        },
      }),

      // 2. Mettre à jour la progression
      prisma.progress.update({
        where: { userId: session.user.id },
        data: {
          vigilanceScore: newVigilanceScore,
          xp: newXP,
          level: newLevel,
          completedScenarios,
          badges: newBadges,
          consecutiveCorrect,
          lastPlayed: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      scenarioScore,
      progress: updatedProgress,
      xpGained,
      badgesUnlocked: newBadges.filter(badge => !progress.badges.includes(badge)),
    });
  } catch (error) {
    console.error('Error saving scenario score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}