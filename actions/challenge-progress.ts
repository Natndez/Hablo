"use server";

import db from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Logic for keeping a users progress for a challenge
export const upsertChallengeProgress = async (challengeId: number) => {
    const { userId } = await auth();

    // Need an id to track progress
    if(!userId) {
        throw new Error("Unauthorized");
    }

    // most updated progress
    const currentUserProgress = await getUserProgress();
    // TODO: handle subscription query later

    // If there is no user progress there is nothing to upsert
    if(!currentUserProgress) {
        throw new Error("User progress unknown")
    }
    // Getting our challenge
    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    });
    if (!challenge) throw new Error("Challenge couldn't be found");

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
       where: and(
        eq(challengeProgress.userId, userId),
        eq(challengeProgress.challengeId, challengeId),
       ), 
    });

    // To check if user is practicing 
    const isPractice = !!existingChallengeProgress;

    // If no hearts left, and not practicing
    if(currentUserProgress.hearts === 0 && !isPractice) {
        return { error: "hearts" }; // TODO: Not if a user has a subscription
    }

    // Must chain db updates with .where
    if (isPractice) {
        await db.update(challengeProgress).set({
            completed: true,
        }).where(
            eq(challengeProgress.id, existingChallengeProgress.id)
        );

        await db.update(userProgress).set({
            hearts: Math.min(currentUserProgress.hearts + 1, 5), // Max is 5
            points: currentUserProgress.points + 10, // 10 points added everytime
        }).where(eq(userProgress.userId, userId));

        // Revalidating all paths that use hearts/points
        revalidatePath("/learn");
        revalidatePath("/lesson");
        revalidatePath("/quests");
        revalidatePath("/leaderboard");
        revalidatePath(`/lesson/${lessonId}`);
        return; // to break method
    }

    // Inserting challengeProgress values into db
    await db.insert(challengeProgress).values({
        challengeId,
        userId,
        completed: true,
    });
}