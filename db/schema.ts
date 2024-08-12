// DB schema

import { pgTable, serial, text } from "drizzle-orm/pg-core"

// Courses Table
export const courses = pgTable("courses", {
    id: serial("id").primaryKey(), // Serial auto increments (could use uuid as well)
    title: text("title").notNull(), // notNull() means its required
    imageSrc: text("image_src").notNull(),
});