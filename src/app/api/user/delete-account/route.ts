// app/api/user/delete-account/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        progress: true,
        scenarioScores: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log avant suppression (optionnel - pour audit)
    console.log(`Suppression du compte: ${user.email} (${user.id})`);

    // Transaction pour supprimer toutes les données associées
    // Pour Prisma v5+, utiliser Prisma.TransactionClient
    await prisma.$transaction(async (tx) => {
      // Supprimer les scores de scénarios
      await tx.scenarioScore.deleteMany({
        where: { userId: session.user.id },
      });

      // Supprimer la progression
      await tx.progress.deleteMany({
        where: { userId: session.user.id },
      });

      // Supprimer les sessions
      await tx.session.deleteMany({
        where: { userId: session.user.id },
      });

      // Supprimer les comptes OAuth
      await tx.account.deleteMany({
        where: { userId: session.user.id },
      });

      // Supprimer l'utilisateur
      await tx.user.delete({
        where: { id: session.user.id },
      });
    }, {
      // Options de transaction (optionnel)
      maxWait: 5000,
      timeout: 10000,
    });

    // Journalisation de la suppression
    console.log(`Compte ${user.email} supprimé avec succès`);

    return NextResponse.json({
      success: true,
      message: 'Compte supprimé avec succès',
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    
    // Ne pas exposer les détails d'erreur en production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error instanceof Error ? error.message : 'Unknown error'
      : 'Internal server error';

    return NextResponse.json(
      { 
        error: 'Failed to delete account',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// Méthode DELETE alternative
export async function DELETE() {
  return POST();
}