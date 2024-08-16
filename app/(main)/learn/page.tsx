import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";

import { Header } from "@/app/(main)/learn/header";
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";

const LearnPage = async () => {
    // using getUnits query from queries.ts
    const unitsData = getUnits();

    // User progress from queries as well
    const userProgressData = getUserProgress();

    // Course progress data
    const courseProgressData = getCourseProgress();

    // Lesson percent data
    const lessonPercentageData = getLessonPercentage();

    // Populating data (units and user progress)
    const [
        userProgress,
        units,
        courseProgress,
        lessonPercentage,
    ] = await Promise.all([
        userProgressData,
        unitsData,
        courseProgressData,
        lessonPercentageData,
    ]);


    // Go back to courses for the following
    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }
    if (!courseProgress) {
        redirect("/courses")
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false} // Change when subscription is implemented
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse.title} />
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit 
                            id={unit.id}
                            order={unit.order}
                            description={unit.description}
                            title={unit.title}
                            lessons={unit.lessons}
                            activeLesson={courseProgress.activeLesson}
                            // 5:03 ^^ in case of error
                            activeLessonPercentage={lessonPercentage}
                        />
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;