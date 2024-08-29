"use client";

import { useState, useTransition } from "react";
import { challengeOptions, challenges } from "@/db/schema";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";

// Types :)
type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: any; // TODO: replace when subscriptions are implemented
}

export const Quiz = ({ 
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
 }: Props) => {
    
    const [pending, startTransition] = useTransition(); 

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

    // tracks whenever we've selected a challenge option (answer)
    const [selectedOption, setSelectedOption] = useState<number>(); // Number cause index is a number
    
    // TODO: Adjust challenge status here for debugging
    // To track challenge status
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const challenge = challenges[activeIndex]; // current challenge
    const options = challenge?.challengeOptions ?? []; // current challenges options

    // Method to get the next challenge index
    const onNext = () => {
        setActiveIndex((current) => current + 1)
    }

    // To select the question based on id
    const onSelect = (id: number) => {
        if (status !== "none" ) return; // Status should always be none by default

        // Set an option as selected based on its id
        setSelectedOption(id);
    }

    // To advance to the next challenge
    const onContinue = () => {
        // Must have an option selected to continue
        if(!selectedOption) return;

        // So that a user can retry a question
        if (status === "wrong") {
            setStatus("none"); // back to default
            setSelectedOption(undefined) // Nothing is selected anymore
        }
        // So that a user can move on to the next question
        if (status === "correct") {
            onNext() // To update the index
            setStatus("none"); // back to default
            setSelectedOption(undefined) // Nothing is selected anymore
        }
        
        // Getting the correct option
        const correctOption = options.find((option) => option.correct);

        // Just in case (gotta have a right answer)
        if (!correctOption) {
            return; // Nothing to return if there is not a correct option
        }
 
        if(correctOption && correctOption.id === selectedOption) {
            
            startTransition(() => {
                upsertChallengeProgress(challenge.id) // From server actions
                    .then((response) => {
                        if(response?.error === "hearts") { // See challenge-progress.ts
                            console.log("Missing hearts");
                            return;
                        }
                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length); // Updating percentage 

                        // If initial percentage is 0, that means we're in practice
                        if (initialPercentage === 100) {
                            // get new hearts on the front end in practice
                            setHearts((prev) => Math.min(prev + 1, 5));
                        }
                    })
                    .catch(() => toast.error("Something went wrong. Try again, please."))
            });


        } else {
            console.error("Wrong, loser!");
        }
    };
    
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
                            {challenge.type === "SELECT" && (
                                <QuestionBubble question={challenge.question}/>
                            )}
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question}/>
                            )}
                            <Challenge 
                                options = {options}
                                onSelect = {onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={false}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Custom footer component to submit choice */}
            <Footer 
                disabled={!selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
};