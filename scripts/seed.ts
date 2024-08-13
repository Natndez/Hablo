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
        console.log("Seeding database")

        // Clearing all old data
        await db.delete(schema.courses);
        await db.delete(schema.userProgress);

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

        console.log("Seeding finished");

    } catch (error){ // Catching any errors in the seeding
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

// Calling function
main();