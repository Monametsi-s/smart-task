'use server';

import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createTask(columnId: string, content:string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await db.insert(tasks).values({
        columnId,
        content,
        order: 0,
    });

    revalidatePath('board/[id]');
}