import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify-icon/react';
import { useSession, signOut } from 'next-auth/react';


export default function Courses() {

    const { data: session, status } = useSession();
    const username = session?.user?.name
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [isUnique, setIsUnique] = useState(true);
    const [courses, setCourses] = useState([]);
    // const [username, setUsername] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        course_name: '',
        course_code: ''
    });
    const [isArchivePopupOpen, setIsArchivePopupOpen] = useState(false);
    const [archivingCourse, setArchivingCourse] = useState(null);
    const [archivedCourses, setArchivedCourses] = useState([]);



    const router = useRouter();

    //---------------------FETCH functions---------------------
    // Fetch the list of courses from the server
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

    useEffect(() => {
        // Ensure we only fetch courses if the user is authenticated
        if (session) {
            fetchCourses();
        }
    }, [session]);

    // check if the course code is unique
    useEffect(() => {
        const timer = setTimeout(() => {
            if (courseCode.trim() !== '') {
                fetch(`/api/courses?course_code=${encodeURIComponent(courseCode)}`)
                    .then(res => res.json())
                    .then(data => setIsUnique(data.isUnique))
                    .catch(err => console.error(err));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [courseCode]);

    // ---------------------AUTHENTICATION---------------------
    // make sure that if the user is not autheticated, they cannot access any of the inner pages of the app.
    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push('/login');
        }
    }, [session, status, router]);

    // Function to fetch archived courses from localStorage on component mount
    useEffect(() => {
        const archivedCoursesFromStorage = localStorage.getItem('archivedCourses');
        if (archivedCoursesFromStorage) {
            setArchivedCourses(JSON.parse(archivedCoursesFromStorage));
        }
    }, []);


    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // logout function
    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };
    //---------------------ADD funcitons---------------------

    const handleAddCourse = () => {
        setIsPopupOpen(true);
        setErrorMessage('');
    };

    // event handler for adding a new course
    const handleAddNewCourse = async () => {
        // VALIDATION- Check if either field is empty and set an error message if so
        if (!newCourse.course_code.trim() || !newCourse.course_name.trim()) {
            setErrorMessage('Both course code and course name are required.');
            return;
        }
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_code: newCourse.course_code,
                    course_name: newCourse.course_name
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // If the course was successfully added, reset the form and fetch the updated list of courses
                setNewCourse({ course_code: '', course_name: '' }); // Reset the form fields
                setIsPopupOpen(false);
                setErrorMessage('');
                fetchCourses();
            } else {
                // If there's a problem with adding the course, show the error message
                setErrorMessage(data.message || 'Failed to add the course.');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            setErrorMessage('An error occurred while adding the course.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'course_code') {
            // check for uniqueness and clear error message
            setCourseCode(value);
            setErrorMessage('');
        }
    };


    // Close add popup - reset everything
    const closePopupAndResetForm = () => {
        setIsPopupOpen(false);
        setNewCourse({ course_code: '', course_name: '' });
        setErrorMessage('');
    };


    //---------------------EDIT funcitons---------------------
    // Close edit popup - reset everything
    const closeEditPopupAndReset = () => {
        setIsEditPopupOpen(false);
        setEditingCourse(null);
        setErrorMessage('');
    };
    // 
    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setIsEditPopupOpen(true);
        setErrorMessage('');
    };

    // Function to update archived courses in state and localStorage
    const updateArchivedCourses = (updatedArchivedCourses) => {
        setArchivedCourses(updatedArchivedCourses);
        localStorage.setItem('archivedCourses', JSON.stringify(updatedArchivedCourses));
    };

    // Function to handle opening the archive confirmation popup
    const handleArchiveConfirmation = (course) => {
        setArchivingCourse(course);
        setIsArchivePopupOpen(true);
    };

    const handleConfirmArchive = async () => {
        try {
            const response = await fetch(`/api/archive/${archivingCourse.id}`, {
                method: 'PUT',
            });
            if (response.ok) {
                // If archiving is successful, update UI
                setIsArchivePopupOpen(false);

                // Remove the archived course from the main list
                const updatedCourses = courses.filter(course => course.id !== archivingCourse.id);
                setCourses(updatedCourses);

                // Add the archived course to the archived courses list
                updateArchivedCourses([...archivedCourses, archivingCourse]);
            } else {
                console.error('Failed to archive course');
            }
        } catch (error) {
            console.error('Error archiving course:', error);
        }
    };


    // Function to handle cancelling the archive action
    const handleCancelArchive = () => {
        // Close the confirmation popup without archiving
        setIsArchivePopupOpen(false);
    };

    const handleDeleteArchivedCourse = async (courseId) => {
        try {
            const response = await fetch(`/api/delete/${courseId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // If deletion is successful, remove the course from the archived list
                const updatedArchivedCourses = archivedCourses.filter(course => course.id !== courseId);
                setArchivedCourses(updatedArchivedCourses);
            } else {
                console.error('Failed to delete archived course');
            }
        } catch (error) {
            console.error('Error deleting archived course:', error);
        }
    };

    const handleRetrieveCourse = async (course) => {
        try {
            const response = await fetch(`/api/retrieve-course/${course.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course),
            });
            if (response.ok) {
                // If retrieval is successful, remove the course from the archived list
                const updatedArchivedCourses = archivedCourses.filter(c => c.id !== course.id);
                setArchivedCourses(updatedArchivedCourses);

                // Add the retrieved course back to the main course list
                setCourses(prevCourses => [...prevCourses, course]);
            } else {
                console.error('Failed to retrieve course');
            }
        } catch (error) {
            console.error('Error retrieving course:', error);
        }
    };



    const handleUpdateCourse = async () => {
        // Extracting course_code and course_name from editingCourse
        const { course_code, course_name } = editingCourse;

        // VALIDATION- Check if either field is empty and set an error message if so
        if (!course_code.trim() || !course_name.trim()) {
            setErrorMessage('Both course code and course name are required.');
            return;
        }

        try {
            // get the id of the course to be updated
            let { id } = editingCourse;
            const response = await fetch(`/api/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_code, course_name }),
            });

            if (response.ok) {
                // If the course was successfully updated, reset the form and fetch the updated list of courses
                setIsEditPopupOpen(false);
                setErrorMessage('');
                fetchCourses();
                setEditingCourse(null);
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Failed to update course.');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            setErrorMessage('An error occurred while updating the course.');
        }
    };

    // Update the state when the user types in the input fields
    let handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingCourse(prevState => ({
            ...prevState,
            // Convert the input name to the format expected by the state
            [name === 'course_code' ? 'course_code' : name === 'course_name' ? 'course_name' : name]: value,
        }));
    };

    return (
        <div className="container mx-auto px-4 pt-8">
            <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold">Welcome {username} ! </p>
                <div className="flex items-center">
                    <div title="Add a new course" className="ml-4">
                        <Icon icon="bx:bxs-plus-circle" className="h-8 w-8 text-gray-500 cursor-pointer" width="24" height="24" onClick={handleAddCourse} />
                    </div>
                    <div title="Logout" className="ml-4" onClick={handleLogout}>
                        <Icon icon="fa-solid:sign-out-alt" className="h-8 w-8 text-gray-500 cursor-pointer" width="24" height="24" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {courses.map((course, index) => (
                    <div key={index} className="relative bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-lg font-semibold">{course.course_code}</p>
                                <p className="text-gray-800">{course.course_name}</p>
                            </div>
                            {/* Edit and Archive icons */}
                            <div className="flex items-center">
                                <div className="flex-grow" title='Edit Course' onClick={() => handleEditCourse(course)}>
                                    <Icon icon="ci:edit-pencil-line-01" width="24" height="24" className=" cursor-pointer" />
                                </div>
                                <div className="w-px h-6 bg-gray-400 mx-2"></div>
                                <div className="flex-grow" title='Archive Page' onClick={() => handleArchiveConfirmation(course)}>
                                    <Icon icon="fluent:archive-arrow-back-16-regular" width="24" height="24" className="text-red-500 cursor-pointer" />
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isPopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-300 p-20 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                        <div className="mb-6">
                            <label htmlFor="course_code" className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                            <input type="text" id="course_code" name="course_code" value={newCourse.course_code} onChange={handleInputChange} placeholder="Enter course code" className="border-gray-300 border rounded-md p-2 block w-full" maxLength={200} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="course_name" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                            <input type="text" id="course_name" name="course_name" value={newCourse.course_name} onChange={handleInputChange} placeholder="Enter course name" className="border-gray-300 border rounded-md p-2 block w-full" maxLength={200} />
                        </div>
                        <div className="flex justify-between">
                            <button onClick={handleAddNewCourse} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Add Course</button>
                            <button onClick={closePopupAndResetForm} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                    </div>
                </div>
            )}
            {isEditPopupOpen && editingCourse && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-300 p-20 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Edit Course</h2>
                        <div className="mb-6">
                            <label htmlFor="editcourse_code" className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                            <input type="text" id="editcourse_code" name="course_code" value={editingCourse.course_code || ''} onChange={handleEditInputChange} className="border-gray-300 border rounded-md p-2 block w-full" maxLength={200} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="editcourse_name" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                            <input type="text" id="editcourse_name" name="course_name" value={editingCourse.course_name || ''} onChange={handleEditInputChange} className="border-gray-300 border rounded-md p-2 block w-full" maxLength={200} />
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => handleUpdateCourse(editingCourse.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Update Course</button>
                            <button onClick={closeEditPopupAndReset} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                    </div>
                </div>
            )}
            {isArchivePopupOpen && archivingCourse && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-300 p-20 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Archive Course</h2>
                        <p>Are you sure you want to archive the course {archivingCourse.course_name} ({archivingCourse.course_code})?</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={handleConfirmArchive} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Archive</button>
                            <button onClick={handleCancelArchive} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Display archived courses */}
            {archivedCourses.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Archived Courses</h2>
                    {archivedCourses.map((course, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-lg">
                            <div>
                                <p className="text-lg font-semibold">{course.course_code}</p>
                                <p className="text-gray-800">{course.course_name}</p>
                            </div>
                            <div className="mt-2 flex justify-end">
                                {/* Add buttons to delete and retrieve archived courses */}
                                <button
                                    onClick={() => handleDeleteArchivedCourse(course.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleRetrieveCourse(course)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                >
                                    Retrieve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}