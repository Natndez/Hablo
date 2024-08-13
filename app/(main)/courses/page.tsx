import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "@/app/(main)/courses/list";

const CoursesPage = async () => {
    // Getting data(promise) from database using our db function
    const coursesData = getCourses();
    const userProgressData = getUserProgress();

    // using promise to get data
    const [
        courses,
        userProgress,
    ] = await Promise.all([
        coursesData,
        userProgressData,
    ]);
    
    return (
        <div className="h-full max-w-[912px] px-3 mx-auto">
            <h1 className="text-2xl font-bold text-neutral-700">
                Languages
            </h1>
            <List 
                courses={courses}
                activeCourseId={userProgress?.activeCourseId} // Hardcoded for now
            /> 
        </div>
    );
};

export default CoursesPage;