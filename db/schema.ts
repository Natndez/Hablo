// DB schema

import { relations } from "drizzle-orm";
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core"

// Courses Table
export const courses = pgTable("courses", {
    id: serial("id").primaryKey(), // Serial auto increments (could use uuid as well)
    title: text("title").notNull(), // notNull() means its required
    imageSrc: text("image_src").notNull(),
});

// Relation between courses (many to many)
export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
}));

// User progress table 
export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImgSrc: text("user_image_src").notNull().default("/temp/mascot.svg"),
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("hearts").notNull().default(0),
});

// Relation between user progress (one to many)
export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    })
}))