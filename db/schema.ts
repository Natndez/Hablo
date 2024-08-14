// Entire DB schema

import { relations } from "drizzle-orm";
import { pgTable, serial, text, integer, pgEnum, boolean } from "drizzle-orm/pg-core"

// Courses Table
export const courses = pgTable("courses", {
    id: serial("id").primaryKey(), // Serial auto increments (could use uuid as well)
    title: text("title").notNull(), // notNull() means its required
    imageSrc: text("image_src").notNull(),
});

// Relation between courses (many to many)
export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

// Units Tables (Courses are made up of units) 
export const units = pgTable("units", {
    id: serial("id").primaryKey(), // unit id number (serial so it auto increments)
    title: text("title").notNull(), // e.g. unit 1...
    description: text("description").notNull(), // Learn how to speak basic italian...
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(), // Id of the course the unit belongs to
    order: integer("order").notNull(), // Will be used in the logic of ordering the units page
});

// Defining the relationships involved with the units table
export const unitsRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons), // as units have many lessons inside
}));

// Lessons table
export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(), // lesson id number (lessons belong to units)
    title: text("title").notNull(), // Title of the lesson
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(), // the unit that the lesson belongs to
    order: integer("order").notNull(), // Similar to the units, lessons are given in a particular order, needs to be tracked.
})

// Relationships for lessons
export const lessonsRelations = relations(lessons, ({ many, one }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id], 
    }),
    challenges: many(challenges), // lessons contain many challenges 
}));

// For classifying challenges
export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]); // add new challenges here

// Challenges table
export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(), // challenge id number (challenges belong to lessons)
    lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    type: challengesEnum("type").notNull(), // type of challenge
    question: text("question").notNull(), // the question / challenge being asked
    order: integer("order").notNull(), // to store challenges in a particular order if desired
});

// Relationships for challenges
export const challengesRelations = relations(challenges, ({ many, one }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengeOptions: many(challengeOptions),
}));

// Challenge Options table
export const challengeOptions = pgTable("challengeOptions", {
    id: serial("id").primaryKey(), // challenge id number (challenges belong to lessons)
    challengeId: integer("lesson_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    text: text("text").notNull(), // the question / challenge being asked
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"), // not required
    audioSrc: text("audio_src"), // for sound effects etc.
});

// Relationships for challenges options
export const challengeOptionsRelations = relations(challengeOptions, ({ many, one }) => ({
    challenge: one(challenges, {
        fields: [challengeOptions.challengeId],
        references: [challenges.id],
    }),
}));


// User progress table 
export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImgSrc: text("user_image_src").notNull().default("/temp/mascot.svg"),
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});

// Relation between user progress (one to many)
export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    })
}));