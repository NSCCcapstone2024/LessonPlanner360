import { useRouter } from 'next/router';

export default function ArchivePage() {
    const router = useRouter();
    const { id, course_code, course_name } = router.query;

    return (
        <div className="container mx-auto px-4 pt-8">
            <h1 className="text-2xl font-bold mb-4">Archived Course Details</h1>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="mb-4">
                    <p className="text-lg font-semibold">Course Code: {course_code}</p>
                    <p className="text-gray-800">Course Name: {course_name}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleRestoreCourse(id)}>Restore</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeleteCourse(id)}>Delete</button>
                </div>
            </div>
        </div>
    );
}
