// File containing a whole bunch of queries

import { cache } from "react";
import db from "@/db/drizzle"
import { auth } from "@clerk/nextjs/server";
import { courses, userProgress } from "./schema";
import { eq } from "drizzle-orm";

// Query to get user progress
export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    // Actual query
    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true,
        },
    });

    return data;
});


// Query to get course
// Using cache so we dont have to query db everytime
export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();

    return data;
});

// Query to get the course by the id number
export const getCourseById = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        // TODO: Populate units and lessons
    });

    return data;
})