import { getCourses } from "@/db/queries";
import { List } from "@/app/(main)/courses/list";

const CoursesPage = async () => {
    // Getting data from database using our db function
    const courses = await getCourses();
    
    return (
        <div className="h-full max-w-[912px] px-3 mx-auto">
            <h1 className="text-2xl font-bold text-neutral-700">
                Languages
            </h1>
            <List 
                courses={courses}
                activeCourseId={1} // Hardcoded for now
            /> 
        </div>
    );
};

export default CoursesPage;