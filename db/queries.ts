// File containing a whole bunch of queries

import { cache } from "react";
import db from "@/db/drizzle"
import { auth } from "@clerk/nextjs/server";
import { challenges, courses, units, userProgress } from "./schema";
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

// Using challenge progress to detect if a lesson is finished or not
// Get units method
export const getUnits = cache(async () => {
    const userProgress = await getUserProgress();

    if(!userProgress?.activeCourseId) {
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: true, // "Nesting" withs all the way to get challenge progress
                        },
                    },
                },
            },
        },
    });

    // This is to check through a . map if a lesson is completed... then it adds a completed status if it is
    // Iterating through a bunch of db tables essentially
    // Normalizing data 
    const normalizedData = data.map((unit) => {
        // Getting all lessons with a completed status
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            // getting all completed challenges
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                // Returns completed challenges without storing if a challenge is completed essentially
                return challenge.challengeProgress
                    && challenge.challengeProgress.length > 0
                    && challenge.challengeProgress.every((progress) => progress.completed);
            });

            // Returning all completed challenges
            return { ...lesson, completed: allCompletedChallenges }
        });
        
        // Returning lessons that are completed
        return { ...unit, lessons: lessonsWithCompletedStatus}
    }); 
    
    // returns all lessons with completion indication
    return normalizedData;
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