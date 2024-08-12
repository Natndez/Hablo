import { cache } from "react";
import db from "@/db/drizzle"

// Using cache so we dont have to query db everytime
export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();

    return data;
});