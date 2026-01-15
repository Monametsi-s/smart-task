'use server';

import { db } from '@/db';
import { boards, columns } from '@/db/schema';
import { eq, desc} from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createBoard(title: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const [newBoard] = await db.insert(boards).values({
        title,
        userId,
    }).returning();

    // Create default columns
    await db.insert(columns).values([
        {boardId: newBoard.id, title: 'To do', order: 0},
        {boardId: newBoard.id, title: 'In progress', order: 1},
        {boardId: newBoard.id, title: 'Done', order: 2},
    ]);

    revalidatePath('/dashboard');
    return newBoard;
}

export async function getBoards() {
    const { userId } = await auth();
    if (!userId) return [];

    return await db.query.boards.findMany({
        where: eq(boards.userId, userId),
        orderBy: [desc(boards.createdAt)],
    });
}

export async function deleteBoard(boardId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorised');

    await db.delete(boards).where(eq(boards.id, boardId));
    revalidatePath('/dashboard');
}

