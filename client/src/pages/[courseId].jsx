import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AccordionItem from '../components/accordionItem';
import { useSession, signOut } from 'next-auth/react';
import { Icon } from '@iconify-icon/react';

export default function Lessons() {
    const router = useRouter();
    const { courseId, courseName } = router.query;
    const [lessons, setLessons] = useState({});
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const [uploadedFilePath, setUploadedFilePath] = useState('');
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [deletingLesson, setDeletingLesson] = useState(null);


    // POPUPS
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isUnitOpen, setIsUnitOpen] = useState({});

    // User message
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    // New lesson states
    const [newLesson, setNewLesson] = useState({
        unit_number: '',
        week: '',
        class_ID: '',
        learning_outcomes: '',
        enabling_outcomes: '',
        material: '',
        assessment: '',
        notes: '',
    });



    // ----------------FILE UPLOADS-------------------

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ file: base64String, filename: file.name }),
                });

                if (!response.ok) {
                    throw new Error('Failed to upload file');
                }

                // Process success response
                console.log('File uploaded successfully');
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };
        reader.readAsDataURL(file);
    };



    //  ----------------------- FETCHING FUNCTIONS ------------------

    useEffect(() => {
        const fetchLessons = async () => {
            if (!session || !courseId) return;
            try {
                const response = await fetch(`/api/lessons/${courseId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Assuming data is an array and converting it to the expected structure
                    const lessonsByUnit = data.reduce((acc, lesson) => {
                        (acc[lesson.unit_number] = acc[lesson.unit_number] || []).push(lesson);
                        return acc;
                    }, {});
                    setLessons(lessonsByUnit);
                } else {
                    console.error('Failed to fetch lessons');
                }
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        };

        fetchLessons();
    }, [session, courseId]);


    // toggle the visibility of each unit
    const toggleUnitVisibility = (unit) => {
        setIsUnitOpen(prevState => ({
            ...prevState,
            [unit]: !prevState[unit],
        }));
    };

    // dynamically change background colour of each unit
    const getBackgroundColor = (unitNumber) => {
        const colors = ["bg-slate-300", "bg-red-300", "bg-blue-300", "bg-blue-400"];
        return colors[unitNumber % colors.length];
    };


    // ------------------ LOGOUT --------------------
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

    // close and reset all fields when cancel is clicked
    const closePopupAndResetForm = () => {
        setIsPopupOpen(false);
        setNewLesson({ unit_number: '', week: '', class_ID: '', learning_outcomes: '', enabling_outcomes: '', material: '', assessment: '', notes: '' });
        setErrorMessage('');
    };

    // ------------------ DELETING LESSONS --------------------

    // open the popup when the delete icon is clicked
    const handleDeleteConfirmation = (lesson) => {
        setDeletingLesson(lesson);
        setIsDeletePopupOpen(true);
    };

    // handle the delete lesson function
    const handleConfirmDelete = async () => {
        if (!deletingLesson) return;

        try {
            const response = await fetch(`/api/lessons/delete/${deletingLesson.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setLessons(prevLessons => {
                    const updatedLessons = { ...prevLessons };
                    updatedLessons[deletingLesson.unit_number] = updatedLessons[deletingLesson.unit_number].filter(lesson => lesson.id !== deletingLesson.id);
                    return updatedLessons;
                });
                setIsDeletePopupOpen(false);
                // show a success message to the user
                setSuccessMessage('Lesson deleted successfully');
                setTimeout(() => {

                    setSuccessMessage('');
                }, 3000);
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Failed to delete lesson');
            }
        } catch (error) {
            setErrorMessage('Error deleting lesson');
        }
    };





    // ------------------ ADDING LESSONS --------------------

    // open the popup when the add lesson icon is clicked
    const handleAddLesson = () => {
        setIsPopupOpen(true);
        setErrorMessage('');
    };

    // handle input changes for the new lesson form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLesson((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddNewLesson = async () => {
        if (!newLesson.unit_number || !newLesson.week || !newLesson.class_ID) {
            setErrorMessage('All fields are required.');
            return;
        }

        // Constructing the lessonData with the uploaded file path
        const lessonData = {
            ...newLesson,
            material: uploadedFilePath,
        };

        try {
            const response = await fetch(`/api/lessons/add/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lessonData),
            });

            if (!response.ok) throw new Error('Failed to add lesson');
            // Reset the form and refetch lessons
            setNewLesson({
                unit_number: '',
                week: '',
                class_ID: '',
                learning_outcomes: '',
                enabling_outcomes: '',
                material: '',
                assessment: '',
                notes: '',
            });
            setIsPopupOpen(false);
            setErrorMessage('');
            fetchLessons();
        } catch (error) {
            console.error('Error adding lesson:', error);
            setErrorMessage(error.message || 'An error occurred while adding the lesson.');
        }



    };


    return (
        <div className="container mx-auto px-4 pt-8">
            {successMessage && <div className="text-center text-green-500 mb-4">{successMessage}</div>}
            <div className="flex justify-between items-center mb-6">
                <div title="Logout" className="ml-4" onClick={handleLogout}>
                    <Icon icon="fa-solid:sign-out-alt" className="h-8 w-8 text-gray-500 cursor-pointer" width="24" height="24" />
                </div>
                <h1 className="text-3xl font-bold">Lessons for Course {decodeURIComponent(courseName || '')}</h1>
                <div>
                    <Icon icon="bx:bxs-plus-circle" className="h-8 w-8 text-gray-500 cursor-pointer" width="24" height="24" onClick={handleAddLesson} />
                </div>
            </div>
            {Object.keys(lessons).map((unit, index) => (
                <div key={unit} className="mb-4">
                    <button onClick={() => toggleUnitVisibility(unit)} className="text-lg font-bold">
                        Unit {unit}
                    </button>
                    {isUnitOpen[unit] && (
                        <div className="mt-2">
                            {lessons[unit].map((lesson) => (
                                <div key={lesson.id} className={`${getBackgroundColor(index)} p-2 rounded-lg mb-2 text-black relative`}>
                                    <div className="flex justify-end space-x-2 absolute top-0 right-0 p-2">
                                        <div title='Edit Lesson' onClick={() => handleEditLesson(lesson)} className="cursor-pointer">
                                            <Icon icon="ci:edit-pencil-line-01" width="24" height="24" />
                                        </div>
                                        <div title='Delete Lesson' onClick={() => handleDeleteConfirmation(lesson)} className="cursor-pointer">
                                            <Icon icon="solar:trash-bin-trash-linear" width="24" height="24" className="text-red-500" />
                                        </div>
                                    </div>
                                    <p><strong>Class ID:</strong> {lesson.class_ID}</p>
                                    <p><strong>Learning Outcomes:</strong> {lesson.learning_outcomes}</p>
                                    <p><strong>Enabling Outcomes:</strong> {lesson.enabling_outcomes}</p>
                                    <p><strong>Material:</strong> <a href={lesson.material} target="_blank" rel="noreferrer">Download</a></p>
                                    <p><strong>Assessment:</strong> {lesson.assessment}</p>
                                    <p><strong>Notes:</strong> {lesson.notes}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {isPopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-300 p-20 rounded-lg overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-4">Add New Lesson</h2>
                        <div className="mb-6">
                            <label htmlFor="unit_number" className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                            <select id="unit_number" name="unit_number" value={newLesson.unit_number} onChange={handleInputChange} className="border-gray-300 border rounded-md p-2 block w-1/4">
                                <option value="" disabled>Select</option>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-1">Week</label>
                            <select id="week" name="week" value={newLesson.week} onChange={handleInputChange} className="border-gray-300 border rounded-md p-2 block w-1/4">
                                <option value="" disabled>Select</option>
                                {[...Array(52)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="class_ID" className="block text-sm font-medium text-gray-700 mb-1">class ID</label>
                            <input type="text" id="class_ID" name="class_ID" value={newLesson.class_ID} onChange={handleInputChange} placeholder="Enter class ID" className="border-gray-300 border rounded-md p-2 block w-96" maxLength={5} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="learning_outcomes" className="block text-sm font-medium text-gray-700 mb-1">Learning Outcomes</label>
                            <input type="text" id="learning_outcomes" name="learning_outcomes" value={newLesson.learning_outcomes} onChange={handleInputChange} placeholder="Enter Learning Outcomes" className="border-gray-300 border rounded-md p-2 block w-96" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="enabling_outcomes" className="block text-sm font-medium text-gray-700 mb-1">Enabling Outcomes</label>
                            <input type="text" id="enabling_outcomes" name="enabling_outcomes" value={newLesson.enabling_outcomes} onChange={handleInputChange} placeholder="Enter Enabling Outcomes" className="border-gray-300 border rounded-md p-2 block w-96" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                            <input type="file" id="material" name="material" onChange={handleFileChange} className="border-gray-300 border rounded-md p-2 block w-full" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="assessment" className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
                            <input type="text" id="assessment" name="assessment" value={newLesson.assessment} onChange={handleInputChange} placeholder="Enter Assessment" className="border-gray-300 border rounded-md p-2 block w-96" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea id="notes" name="notes" value={newLesson.notes} onChange={handleInputChange} placeholder="Enter Notes" className="border-gray-300 border rounded-md p-2 block w-96 h-32 resize-vertical" />
                        </div>
                        <div className="flex justify-between">
                            <button onClick={handleAddNewLesson} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Add Lesson</button>
                            <button onClick={closePopupAndResetForm} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                    </div>
                </div>
            )

            }
            {isDeletePopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-20 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Delete Lesson</h2>
                        <p className='text-lg'>Are you sure you want to delete this lesson: {deletingLesson?.class_ID}?</p>
                        <p className='text-lg text-red-800 font-black mb-8'>Note: This action cannot be undone!</p>
                        {errorMessage && <div className="text-center text-md text-red-500 mb-4">{errorMessage}</div>}
                        <div className="flex justify-between">
                            <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Yes, Delete</button>
                            <button onClick={() => setIsDeletePopupOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
}
