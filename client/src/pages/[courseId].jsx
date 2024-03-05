import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AccordionItem from '../components/accordionItem';
import { useSession, signOut } from 'next-auth/react';
import { Icon } from '@iconify-icon/react';

export default function Lessons() {
    const router = useRouter();
    const { courseId, courseName } = router.query;
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    // POPUPS
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Error message
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

    // ------------------ ADDING LESSONS--------------------


    const handleAddLesson = () => {
        setIsPopupOpen(true);
        setErrorMessage('');
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLesson((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    // ----------------FILE UPLOADS-------------------
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewLesson((prevState) => ({
                ...prevState,
                material: file,
            }));
        }
    };

    //  ----------------------- FETCHING FUNCTIONS ------------------
    useEffect(() => {
        if (!courseId) return;
        const fetchLessons = async () => {
            try {
                const response = await fetch(`/api/lessons/${courseId}`);
                if (response.ok) {
                    const data = await response.json();
                    setLessons(data);
                } else {
                    console.error('Failed to fetch lessons');
                }
            } catch (error) {
                console.error('Error fetching lessons:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, [courseId]);

    // toggle the accordion
    const toggleLessonOpen = (lessonId) => {
        const updatedLessons = lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, isOpen: !lesson.isOpen } : lesson
        );
        setLessons(updatedLessons);
    };

    useEffect(() => {
        // Ensure we only fetch data if the user is authenticated
        if (!session) {
            router.push('/login');
        }
    }, [session, router]);


    // ------------------ LOGOUT --------------------
    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' });
    };

    // close and reset all fields when cancel is clicked
    const closePopupAndResetForm = () => {
        setIsPopupOpen(false);
        setNewLesson({ unit_number: '', week: '', class_ID: '', learning_outcomes: '', enabling_outcomes: '', material: '', assessment: '', notes: '' });
        setErrorMessage('');
    };

    return (
        <div className="container mx-auto px-4 pt-8">
            <div className="flex justify-between items-center mb-6">
                <div title="Logout" className="ml-4" onClick={handleSignOut}>
                    <Icon icon="fa-solid:sign-out-alt" className="h-8 w-8 text-gray-500 cursor-pointer" width="24" height="24" />
                </div>
                <h1 className="text-3xl font-bold">Lessons for Course {decodeURIComponent(courseName || '')}</h1>
                <div>
                    <Icon icon="bx:bxs-plus-circle" className="h-8 w-8 text-gray-500 cursor-pointer" width="24" height="24" onClick={handleAddLesson} />
                </div>
            </div>
            {loading ? (
                <p className="text-gray-600">Loading lessons...</p>
            ) : (
                <div>
                    {lessons.length === 0 ? (
                        <p className="text-gray-600">No lessons found for this course.</p>
                    ) : (
                        <div className="space-y-4">
                            {lessons.map((lesson) => (
                                <div key={lesson.id} className="bg-gray-100 shadow-md rounded-md p-4 transition duration-300 ease-in-out transform hover:scale-105">
                                    <AccordionItem lesson={lesson} onToggle={toggleLessonOpen} />
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}
            {isPopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-300 p-20 rounded-lg overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-4">Add New Lesson</h2>
                        <div className="mb-6">
                            <label htmlFor="unit_number" className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                            <select id="unit_number" name="unit_number" value={newLesson.unit_number} onChange={handleInputChange} className="border-gray-300 border rounded-md p-2 block w-1/4">
                                {[...Array(10)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-1">Week</label>
                            <select id="week" name="week" value={newLesson.week} onChange={handleInputChange} className="border-gray-300 border rounded-md p-2 block w-1/4">
                                {[...Array(52)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="class_ID" className="block text-sm font-medium text-gray-700 mb-1">class ID</label>
                            <input type="text" id="class_ID" name="class_ID" value={newLesson.class_ID} onChange={handleInputChange} placeholder="Enter class ID" className="border-gray-300 border rounded-md p-2 block w-96" maxLength={200} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="learning_outcomes" className="block text-sm font-medium text-gray-700 mb-1">Learning Outcomes</label>
                            <input type="text" id="learning_outcomes" name="learning_outcomes" value={newLesson.learning_outcomes} onChange={handleInputChange} placeholder="Enter Learning Outcomes" className="border-gray-300 border rounded-md p-2 block w-96" maxLength={200} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="enabling_outcomes" className="block text-sm font-medium text-gray-700 mb-1">Enabling Outcomes</label>
                            <input type="text" id="enabling_outcomes" name="enabling_outcomes" value={newLesson.enabling_outcomes} onChange={handleInputChange} placeholder="Enter Enabling Outcomes" className="border-gray-300 border rounded-md p-2 block w-96" maxLength={200} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                            <input type="file" id="material" name="material" onChange={handleFileChange} className="border-gray-300 border rounded-md p-2 block w-full" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="assessment" className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
                            <input type="text" id="assessment" name="assessment" value={newLesson.assessment} onChange={handleInputChange} placeholder="Enter Assessment" className="border-gray-300 border rounded-md p-2 block w-96" maxLength={200} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <input type="text" id="notes" name="notes" value={newLesson.notes} onChange={handleInputChange} placeholder="Enter Notes" className="border-gray-300 border rounded-md p-2 block w-96" maxLength={200} />
                        </div>
                        <div className="flex justify-between">
                            <button onClick={handleAddLesson} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Add Lesson</button>
                            <button onClick={closePopupAndResetForm} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                    </div>
                </div>
            )
            }
        </div>
    );
}
