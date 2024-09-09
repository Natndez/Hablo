"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server actions regarding the user progress
export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized");
    }

    const course = await getCourseById(courseId);

    if(!course) {
        throw new Error("Course not found");
    }
    
    // Test (comment out)
    // throw new Error("Test");

    // TODO: Enable when units and lessons are implemented
    // if(!course.units.length || !course.units[0].lessons.length) {
    //     throw new Error("Course is empty");
    // }

    const existingUserProgress = await getUserProgress();

    // User has already been active in some course in this case
    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId, // Sets current course to active course
            userName: user.firstName || "User",
            userImgSrc: user.imageUrl || "/temp/mascot.svg",
        });

         // To revalidate caches that store this same data
        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImgSrc: user.imageUrl || "/temp/mascot.svg",
    });

    // To revalidate caches that store same data
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
};

// Server action to reduce heart count
export const reduceHearts = async (challengeId: number) => {
    // users id
    const { userId } = await auth();

    if (!userId){
        throw new Error("Unauthorized")
    };

    const currentUserProgress = await getUserProgress();
    // TODO: get user subscription

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    });

    if(!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonId;

    // Using this to check for exisitng challenge progress instead of our front-end method
    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        ),
    });

    // If it is practice it means we have an existing challenge progress
    const isPractice = !!existingChallengeProgress;

    // Not gonna take hearts away from users when they're practicing. That would be annoying... break method
    if(isPractice) {
        return { error: "Practice" }
    }

    if(!currentUserProgress) {
        throw new Error("User progress not found") // Critical error thus the diffent type of error compared to above
    }

    // TODO: Handle subscription

    if(currentUserProgress.hearts === 0) {
        return { error: "hearts" }; // No hearts so no point in reducing
    }

    // Updating hearts (either subtract 1 from current amount or 0, hence max)
    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
}