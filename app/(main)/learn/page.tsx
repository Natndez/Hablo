import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";

import { Header } from "@/app/(main)/learn/header";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

const LearnPage = async () => {
    const userProgressData = getUserProgress();

    const [
        userProgress
    ] = await Promise.all([
        userProgressData
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses")
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse={{ title: "Spanish", imageSrc: "/temp/es.svg" }}
                    hearts={5}
                    points={100}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title="Spanish" />
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;