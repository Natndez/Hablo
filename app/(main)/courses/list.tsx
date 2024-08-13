"use client";

import { courses, userProgress } from "@/db/schema";
import { Card } from "@/app/(main)/courses/card";

// Props for list component
type Props = {
    courses: typeof courses.$inferSelect[];
    activeCourseId?: typeof userProgress.$inferSelect.activeCourseId; // getting the exact type
};

export const List = ({ courses, activeCourseId }: Props) => {
    return (
        <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {courses.map((course) => (
                <Card 
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    imgSrc={course.imageSrc}
                    onClick={() => {}}
                    disabled={false}
                    active={course.id === activeCourseId}
                />
            ))}
        </div>
    );
    
}

