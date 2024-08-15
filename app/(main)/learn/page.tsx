import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";

import { Header } from "@/app/(main)/learn/header";
import { getUnits, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

const LearnPage = async () => {
    // using getUnits query from queries.ts
    const unitsData = getUnits();

    // User progress from queries as well
    const userProgressData = getUserProgress();

    // Populating data (units and user progress)
    const [
        userProgress,
        units,
    ] = await Promise.all([
        userProgressData,
        unitsData,
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
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
                        {/* Returning all lessons with completion indication */}
                        {/* TODO: Change to front end code not json */}
                        {JSON.stringify(unit)}
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;