import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [username, setUsername] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        courseName: '',
        courseCode: ''
    });

    const router = useRouter();

    useEffect(() => {
        // Get the username 
        let storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }


        fetchCourses();
    }, []);


    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                console.error('Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleLogout = () => {
        router.push('/login');
    };

    const handleAddCourse = () => {
        setIsPopupOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddNewCourse = async () => {
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourse)
            });

            if (response.ok) {
                // If the course was successfully added, fetch the updated list of courses
                await fetchCourses();
            } else {
                console.error('Failed to add course');
            }
        } catch (error) {
            console.error('Error adding course:', error);
        }

        // Reset input fields and close the popup
        setNewCourse({
            courseName: '',
            courseCode: ''
        });
        setIsPopupOpen(false);
    };

    return (
        <div className="container mx-auto px-4 pt-8">
            <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold">Welcome {username} ! </p>
                <div className="flex items-center">
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md ml-2">Logout</button>
                    <svg onClick={handleAddCourse} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 cursor-pointer ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {courses.map((course, index) => (
                    <div key={index} className="relative bg-gray-100 p-4 rounded-lg">
                        <p className="text-lg font-semibold">{course.course_code}</p>
                        <p className="text-gray-800">{course.course_name}</p>
                    </div>
                ))}
            </div>
            {isPopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-300 p-20 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                        <div className="mb-6">
                            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                            <input type="text" id="courseCode" name="courseCode" value={newCourse.courseCode} onChange={handleInputChange} placeholder="Enter course code" className="border-gray-300 border rounded-md p-2 block w-full" maxLength={50} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                            <input type="text" id="courseName" name="courseName" value={newCourse.courseName} onChange={handleInputChange} placeholder="Enter course name" className="border-gray-300 border rounded-md p-2 block w-full" maxLength={50} />
                        </div>
                        <div className="flex justify-between">
                            <button onClick={handleAddNewCourse} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Add Course</button>
                            <button onClick={() => setIsPopupOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
