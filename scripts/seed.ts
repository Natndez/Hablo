// Seed script here
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

// Connecting to database using neon
const sql = neon(process.env.DATABASE_URL!);

// To interact with drizzle ORM (see docs for further clarification)
const db = drizzle(sql, { schema });

// main seeding script function
const main = async () => {
    try {
        console.log("Seeding database...\n")

        // Clearing all old data
        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);
        

        // Seeding courses
        console.log("Seeding courses\n")
        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Spanish",
                imageSrc: "/temp/es.svg",
            },
            {
                id: 2,
                title: "Italian",
                imageSrc: "/temp/it.svg",
            },
            {
                id: 3,
                title: "Japanese",
                imageSrc: "/temp/jp.svg",
            },
            {
                id: 4,
                title: "French",
                imageSrc: "/temp/fr.svg",
            },
            {
                id: 5,
                title: "Croatian",
                imageSrc: "/temp/hr.svg",
            },
        ]);

        // Seeding Units
        console.log("Seeding Units\n")
        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1, // Spanish
                title: "Unit 1", 
                description: "Learn basic Spanish",
                order: 1, 
            },
        ]);

        // Seeding Lessons
        console.log("Seeding Lessons\n")
        await db.insert(schema.lessons).values([
            {
                id: 1,  // Lessons Id
                unitId: 1, // Unit 1 (Basics)
                order: 1,   // Order of the lessons
                title: "Nouns", // Lesson title
            },
        ]);

        // Seeding challenges
        console.log("Seeding challenges");
        await db.insert(schema.challenges).values([
            {
                id: 1,      // Challenge Id
                lessonId: 1, // Nouns
                type: 'SELECT', // Question type (they will choose for these)
                order: 1,       // Will be the first question
                question: 'Which one of these is "El hombre"?', // Questions will be revised later lol
            },
        ]);
        // Seeding challenge options
        console.log("Seeding challenge options\n");
        await db.insert(schema.challengeOptions).values([
            {
                id: 1, // Option id
                challengeId: 1, // Which challenge the option belongs to (in this case "which one of these is el hombre")
                imageSrc: "/temp/man.svg", // Image
                correct: true,  // correct or incorrect answer
                text: "The man", // option text
                audioSrc: "/es_man.mp3", // The audio file ref
            },
            {
                id: 2, // Option id
                challengeId: 1, // Which challenge the option belongs to (in this case "which one of these is el hombre")
                imageSrc: "/temp/woman.svg", // Image
                correct: false,  // correct or incorrect answer
                text: "The woman", // option text
                audioSrc: "/es_woman.mp3", // The audio file ref
            },
            {
                id: 3, // Option id
                challengeId: 1, // Which challenge the option belongs to (in this case "which one of these is El hombre")
                imageSrc: "/temp/robot.svg", // Image
                correct: false,  // correct or incorrect answer
                text: "The robot", // option text
                audioSrc: "/es_robot.mp3", // The audio file ref
            },
        ])

        console.log("Seeding finished");

    } catch (error){ // Catching any errors in the seeding
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

// Calling function
main();