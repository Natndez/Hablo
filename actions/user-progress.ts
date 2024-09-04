"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
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
    }
}