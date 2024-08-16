// File containing a whole bunch of queries

import { cache } from "react";
import db from "@/db/drizzle"
import { auth } from "@clerk/nextjs/server";
import { challengeProgress, challenges, courses, lessons, units, userProgress } from "./schema";
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

// COULD BE FASTER
// Using challenge progress to detect if a lesson is finished or not
// Get units method
export const getUnits = cache(async () => {
    // User id from clerk
    const { userId } = await auth()
    // Our user progress data
    const userProgress = await getUserProgress();

    if(!userId || !userProgress?.activeCourseId) {
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            }, // "Nesting" withs to get challenge progress
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
});

// To Find out where the user is in a particular course
export const getCourseProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeCourseId) {
        return null;
    }

    // Which units are in a course?
    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },
    });

    // The next lesson for the user to do
    const firstUncompletedLesson = unitsInActiveCourse
        .flatMap((unit) => unit.lessons)
        .find((lesson) => {
            // TODO: Check last clause in case of issue
            return lesson.challenges.some((challenge) => {
                return !challenge.challengeProgress 
                || challenge.challengeProgress.length === 0 
                || challenge.challengeProgress.some((progress) => progress.completed === false);
            });
        });
    
    // What our query returns
    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    };
});

// Get Lesson method (similarish to getCourseProgress)
export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();
    const courseProgress = await getCourseProgress();

    if(!userId) {
        return null; // No point in doing the rest without userId
    }

    // Getting the current lesson id
    const lessonId = id || courseProgress?.activeLessonId;

    if(!lessonId) {
        return null; // Nothing can be returned without an id
    };

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId),
                    },
                },
            },
        },
    });

    if (!data || !data.challenges) {
        return null; // Nothing to display without data or challenges
    };

    // Normalizing challenges to show completed status (similar to getUnits)
    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);

        return { ...challenge, completed };
    });
    return { ...data, challenges: normalizedChallenges };
});

// Percent completion of a lesson
export const getLessonPercentage = cache(async () => {
    const courseProgress = await getCourseProgress();

    if(!courseProgress?.activeLessonId) {
        return 0;
    };

    // Using getLesson function with our id
    const lesson = await getLesson(courseProgress.activeLessonId);
    
    // If no lesson, no percent to return
    if (!lesson) {
        return 0;
    };

    // Returns array of completed challenges
    const completedChallenges = lesson.challenges
        .filter((challenge) => challenge.completed);
    
    // Percentage calculation
    const percentage = Math.round( (completedChallenges.length / lesson.challenges.length) * 100, );

    // Returns newly calculated lesson completion percentage
    return percentage;
});