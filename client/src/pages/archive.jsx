import { useRouter } from 'next/router';

export default function ArchivePage() {
    const router = useRouter();
    const { id, course_code, course_name } = router.query;

    return (
        <div className="container mx-auto px-4 pt-8">
            <h1 className="text-2xl font-bold mb-4">Archived Course Details</h1>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="mb-4">
                    <div className="mb-2">
                        <p className="text-lg font-semibold">Course Code</p>
                        <p className="text-gray-800">{course_code}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Course Name</p>
                        <p className="text-gray-800">{course_name}</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto" onClick={() => handleRestoreCourse(id)}>Restore</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto mt-2 md:mt-0" onClick={() => handleDeleteCourse(id)}>Delete</button>
                </div>
            </div>
        </div>
    );
}
