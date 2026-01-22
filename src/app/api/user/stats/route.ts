// app/api/user/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [progress, scenarioScores, scenarioCount] = await Promise.all([
      prisma.progress.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.scenarioScore.findMany({
        where: { userId: session.user.id },
        orderBy: { completedAt: 'desc' },
        take: 10,
      }),
      prisma.scenarioScore.count({
        where: { userId: session.user.id },
      }),
    ]);

    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    const stats = {
      level: progress.level,
      xp: progress.xp,
      vigilanceScore: progress.vigilanceScore,
      totalScenariosCompleted: scenarioCount,
      totalGamesPlayed: progress.gamesPlayed,
      badgesCount: progress.badges.length,
      recentScores: scenarioScores,
      averageScore: scenarioCount > 0 
        ? Math.round(scenarioScores.reduce((acc, curr) => acc + curr.score, 0) / scenarioCount)
        : 0,
      completionRate: Math.round((scenarioCount / 15) * 100), // 15 = total scénarios
      streak: progress.consecutiveCorrect,
      lastPlayed: progress.lastPlayed,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}