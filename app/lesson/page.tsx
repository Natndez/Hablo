import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "./quiz";

const LessonPage = async () => {
    // Data needed from db
    const lessonData = getLesson();
    const userProgressData = getUserProgress();

    // Using promise to get lesson and userProgress
    const [
        lesson,
        userProgress,
    ] = await Promise.all([
        lessonData,
        userProgressData,
    ]);

    // Without the following, can't be on this page
    if (!lesson || !userProgress) {
        redirect("/learn");
    }

    // Lesson's initial percentage when beginning session
    const initialPercent = lesson.challenges
        .filter((challenge) => challenge.completed)
        .length / lesson.challenges.length * 100;

    return (
        <div>
            <Quiz 
                initialLessonId={lesson.id}
                initialLessonChallenges={lesson.challenges}
                initialHearts={userProgress.hearts}
                initialPercentage={initialPercent}
                userSubscription={null} // Add soon
            />
        </div>
    );
};

export default LessonPage;