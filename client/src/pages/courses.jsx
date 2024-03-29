import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify-icon/react';
import { useSession, signOut } from 'next-auth/react';

export default function Courses() {
    // ---------------------STATE---------------------
    const [theme, setTheme] = useState('light');
    const { data: session, status } = useSession();
    const username = session?.user?.name;
    const router = useRouter();

    // POPUPS
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState({});
    const [isArchivePopupOpen, setIsArchivePopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    // Action states
    const [deletingCourse, setDeletingCourse] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [archivingCourse, setArchivingCourse] = useState(null);
    const [archivedCourses, setArchivedCourses] = useState([]);

    // Error message
    const [errorMessage, setErrorMessage] = useState('');

    // Other setters
    const [courseCode, setCourseCode] = useState('');
    const [isUnique, setIsUnique] = useState(true);
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({
        course_name: '',
        course_code: ''
    });

    // Function to toggle between light and dark themes
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        // Update theme class on the body
        document.body.classList.toggle('dark', newTheme === 'dark');
        document.body.classList.toggle('light', newTheme === 'light');
    };

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

    // Check if the course code is unique
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

    // Fetch the list of archived courses from the server
    useEffect(() => {
        const fetchArchivedCourses = async () => {
            try {
                const res = await fetch('/api/courses/archived');
                if (!res.ok) throw new Error('Failed to fetch archived courses');
                const data = await res.json();
                setArchivedCourses(data);
            } catch (error) {
                console.error('Error fetching archived courses:', error);
            }
        };
        fetchArchivedCourses();
    }, []);

    // Redirect to the corresponding lessons page
    const getLessons = (courseId, courseName) => {
        router.push(`${courseId}?courseName=${encodeURIComponent(courseName)}`);
    };

    // ---------------------AUTHENTICATION---------------------
    // Make sure that if the user is not authenticated, they cannot access any of the inner pages of the app.
    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push('/login');
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // Logout function
    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    //---------------------ADD functions---------------------

    const handleAddCourse = () => {
        setIsPopupOpen(true);
        setErrorMessage('');
    };

    // Event handler for adding a new course
    const handleAddNewCourse = async () => {
        // VALIDATION- Check if either field is empty and set an error message if so
        if (!newCourse.course_code.trim() || !newCourse.course_name.trim() || !newCourse.year) {
            setErrorMessage('Course code, course name, and year are required.');
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
                    course_name: newCourse.course_name,
                    year: newCourse.year
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // If the course was successfully added, reset the form and fetch the updated list of courses
                setNewCourse({ course_code: '', course_name: '', year: '' }); // Reset the form fields
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
            // Check for uniqueness and clear error message
            setCourseCode(value);
            setErrorMessage('');
        }
    };

    // Close add popup - reset everything
    const closePopupAndResetForm = () => {
        setIsPopupOpen(false);
        setNewCourse({ course_code: '', course_name: '', year: '' });
        setErrorMessage('');
    };

    //---------------------EDIT functions---------------------
    // Close edit popup - reset everything
    const closeEditPopupAndReset = () => {
        setIsEditPopupOpen(false);
        setEditingCourse(null);
        setErrorMessage('');
    };
    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setIsEditPopupOpen(true);
        setErrorMessage('');
    };
    // Update the state when the user types in the input fields
    let handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingCourse(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdateCourse = async () => {
        // Extracting course_code and course_name from editingCourse
        const { course_code, course_name, year } = editingCourse;

        // VALIDATION- Check if either field is empty and set an error message if so
        if (!course_code.trim() || !course_name.trim() || !year) {
            setErrorMessage('Course code, course name, and year are required.');
            return;
        }

        try {
            // get the id of the course to be updated
            let { id } = editingCourse;
            const response = await fetch(`/api/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_code, course_name, year }),
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

    //---------------------ARCHIVE functions---------------------

    // Fetch ONLY the courses that have been marked as "1" or archived
    const fetchArchivedCourses = async () => {
        try {
            const res = await fetch('/api/courses/archived');
            if (!res.ok) throw new Error('Failed to fetch archived courses');
            const data = await res.json();
            // Set archived courses with the current year
            setArchivedCourses(data.map(course => ({ ...course, archived_year: course.archived_year ? new Date(course.archived_year).getFullYear() : null })));
        } catch (error) {
            console.error('Error fetching archived courses:', error);
        }
    };

    // Function to handle opening the archive confirmation popup
    let handleArchiveConfirmation = (course) => {
        setArchivingCourse(course);
        setIsArchivePopupOpen(true);
    };

    // Confirm the archive action
    const handleConfirmArchive = async () => {
        try {
            const res = await fetch(`/api/archive/${archivingCourse.id}`, {
                method: 'PUT',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to archive course');
            }

            // Update the archived and archived_year fields
            const currentYear = new Date().getFullYear();
            const updatedArchivingCourse = `UPDATE tblCourses SET archived = 1, archived_year = ${currentYear} WHERE id = ${archivingCourse.id}`;

            // Close popup
            setIsArchivePopupOpen(false);

            // Update the course in the frontend without needing to refresh
            const updatedCourses = courses.map(course =>
                course.id === archivingCourse.id ? updatedArchivingCourse : course
            );
            setCourses(updatedCourses);

            // Fetch the updated list of courses
            fetchCourses();

            // Fetch only the archived courses
            fetchArchivedCourses();
        } catch (error) {
            console.error('Error archiving course:', error);
        }
    };

    // Function to handle cancelling the archive action
    const handleCancelArchive = () => {
        // Close the confirmation popup without archiving
        setIsArchivePopupOpen(false);
    };

    //---------------------DELETE functions---------------------
    // Delete popup
    const handleDeleteConfirmation = (course) => {
        setDeletingCourse(course);
        setIsDeletePopupOpen(true);
    };

    // Close delete popup and reset everything
    const closeDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setDeletingCourse(null);
    };

    // Handle the deletion of the archived courses
    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`/api/delete/${deletingCourse.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Update your course list here, either by filtering out the deleted course or refetching the courses
                setCourses(courses.filter(course => course.id !== deletingCourse.id));
                setArchivedCourses(archivedCourses.filter(course => course.id !== deletingCourse.id));
                closeDeletePopup();
            } else {
                console.error('Failed to delete course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    //---------------------RETRIEVE functions---------------------
    // Fetch the restored courses
    const handleRetrieveCourse = async (course) => {
        try {
            const res = await fetch(`/api/courses/restore/${course.id}`, {
                method: 'PUT',
            });
            if (!res.ok) {
                throw new Error('Failed to restore course');
            }
            // Remove the course from the archived list
            let updatedArchivedCourses = archivedCourses.filter(c => c.id !== course.id);
            setArchivedCourses(updatedArchivedCourses);
            // Add the course back to the active list
            setCourses(prevCourses => [course, ...prevCourses]);
            // Fetch the updated list of courses
            fetchCourses();
        } catch (error) {
            console.error('Error restoring course:', error);
        }
    };

    //---------------------COPY functions---------------------
    const handleCopyCourse = async (course) => {
        try {
            console.log('Copying course:', course);
            const response = await fetch(`/api/courses/copy/${course.id}`, {
                method: 'POST',
            });

            console.log('Response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('Course copied successfully with ID:', data.newCourseId);
                fetchCourses();
                fetchArchivedCourses();
            } else {
                console.error('Failed to copy course');
            }
        } catch (error) {
            console.error('Error copying course:', error);
        }
    };

    return (
        <div>
            <style jsx global>{`
                body {
                    background-color: ${theme === 'dark' ? '#222222' : '#ffffff'};
                    color: ${theme === 'dark' ? '#ffffff' : '#000000'};
                }
            `}</style>
            <div className={`container mx-auto px-4 pt-8`}>
                {/* Theme toggles */}
                <div className="absolute top-4 right-4">
                    <button onClick={toggleTheme} className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 mt-3" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#d1d5db', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                        {theme === 'light' ? 'Dark' : 'Light'} Theme
                    </button>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div title="Logout" className="ml-4" onClick={handleLogout}>
                        <Icon icon="fa-solid:sign-out-alt" className="h-8 w-8 text-gray-500 cursor-pointer" width="24" height="24" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">Welcome {username} ! </p>
                    </div>
                    <div className="flex items-center">
                        <div title="Add a new course" className="mr-10">
                            <Icon icon="bx:bxs-plus-circle" className="h-8 w-8 text-gray-500 cursor-pointer" width="24" height="24" onClick={handleAddCourse} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {courses.map((course, index) => (
                        <div key={index} className="relative bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    {/* Display course_code and year together */}
                                    <p className="text-lg font-semibold">
                                        <button
                                            onClick={() => getLessons(course.id, course.course_name)}
                                            className="text-lg font-semibold hover:underline focus:outline-none"
                                            style={{ all: 'unset', cursor: 'pointer' }}
                                        >
                                            <span className="text-black">{course.course_code} - {course.year}</span>
                                        </button>
                                    </p>
                                    <p className="text-gray-800">{course.course_name}</p>
                                </div>

                                {/* Edit and Archive icons */}
                                <div className="flex items-center">
                                    <div className="flex-grow" title='Edit Course' onClick={() => handleEditCourse(course)}>
                                        <span className="text-black"><Icon icon="ci:edit-pencil-line-01" width="24" height="24" className="cursor-pointer" /></span>
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
                {
                    isPopupOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-300 p-20 rounded-lg">
                                <h2 className="text-xl font-bold mb-4"><span className="text-black">Add New Course</span></h2>
                                <div className="mb-6">
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <input type="text" id="year" name="year" value={newCourse.year} onChange={handleInputChange} placeholder="Enter year" className="border-gray-300 border rounded-md p-2 block w-96 " maxLength={4} />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="course_code" className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                    <input type="text" id="course_code" name="course_code" value={newCourse.course_code} onChange={handleInputChange} placeholder="Enter course code" className="border-gray-300 border rounded-md p-2 block w-96" maxLength={200} />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="course_name" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                    <input type="text" id="course_name" name="course_name" value={newCourse.course_name} onChange={handleInputChange} placeholder="Enter course name" className="border-gray-300 border rounded-md p-2 block w-96" maxLength={200} />
                                </div>
                                <div className="flex justify-between">
                                    <button onClick={handleAddNewCourse} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Add Course</button>
                                    <button onClick={closePopupAndResetForm} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                                </div>
                                {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                            </div>
                        </div>
                    )
                }
                {
                    isEditPopupOpen && editingCourse && (
                        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-300 p-20 rounded-lg">
                                <h2 className="text-xl font-bold mb-4"><span className="text-black">Edit Course</span></h2>
                                <div className="mb-6">
                                    <label htmlFor="editYear" className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
                                    <span className="text-black"><input type="text" id="editYear" name="year" value={editingCourse.year || ''} onChange={handleEditInputChange} className="border-gray-300 border rounded-md p-2 block w-96" /></span>
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="editcourse_code" className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                    <span className="text-black"><input type="text" id="editcourse_code" name="course_code" value={editingCourse.course_code || ''} onChange={handleEditInputChange} className="border-gray-300 border rounded-md p-2 block w-96" /></span>
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="editcourse_name" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                    <span className="text-black"><input type="text" id="editcourse_name" name="course_name" value={editingCourse.course_name || ''} onChange={handleEditInputChange} className="border-gray-300 border rounded-md p-2 block w-96" /></span>
                                </div>
                                <div className="flex justify-between">
                                    <button onClick={handleUpdateCourse} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Update Course</button>
                                    <button onClick={closeEditPopupAndReset} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                                </div>
                                {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                            </div>
                        </div>
                    )
                }
                {
                    isArchivePopupOpen && archivingCourse && (
                        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-300 p-20 rounded-lg">
                                <h2 className="text-xl font-bold mb-4"><span className="text-black">Archive Course</span></h2>
                                <p className="text-black">Are you sure you want to archive {archivingCourse.course_code} - {archivingCourse.year}?</p>
                                <div className="flex justify-between mt-4">
                                    <button onClick={handleConfirmArchive} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Yes</button>
                                    <button onClick={handleCancelArchive} className="bg-gray-500 text-white px-4 py-2 rounded-md">No</button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    isDeletePopupOpen && deletingCourse && (
                        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-300 p-20 rounded-lg">
                                <h2 className="text-xl font-bold mb-4"><span className="text-black">Delete Course</span></h2>
                                <p className="text-black">Are you sure you want to delete {deletingCourse.course_code} - {deletingCourse.year}?</p>
                                <div className="flex justify-between mt-4">
                                    <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Yes</button>
                                    <button onClick={closeDeletePopup} className="bg-gray-500 text-white px-4 py-2 rounded-md">No</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
