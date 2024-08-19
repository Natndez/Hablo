"use client";

import { useState } from "react";
import { challengeOptions, challenges } from "@/db/schema";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";

// Types :)
type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: any; // TODO: replace
}

export const Quiz = ({ 
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
 }: Props) => {
    // States so hearts and percentage update live
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(initialPercentage);

    // Challenge state
    const [challenges] = useState(initialLessonChallenges);
    // Index of the question user is on
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed); 
        return uncompletedIndex === -1 ? 0 : uncompletedIndex; // -1 means none are completed, so index would be 0 as thats the first one
    });

    const challenge = challenges[activeIndex]; // current challenge

    // To return the right type of title based on question type
    const title = challenge.type === "ASSIST" 
    ? "Select the correct translation" 
    : challenge.question

    return (
        <>
            <Header 
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1 flex min-h-screen items-center justify-center">
                <div className="h-full"> {/* flex items-center justify-center */}
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12 justify-end">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div>
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};