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

    const toggleLessonOpen = (lessonId) => {
        const updatedLessons = lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, isOpen: !lesson.isOpen } : lesson
        );
        setLessons(updatedLessons);
    };

    useEffect(() => {
        // Ensure we only fetch data if the user is authenticated
        if (!session) {
            router.push('/login'); // Redirect to login page if not authenticated
        }
    }, [session, router]);

    // Handle logout
    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' }); // Sign out and redirect to login page
    };

    const handleAddLesson = () => {
        // Add navigation logic to the add lesson page
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
        </div>
    );
}
