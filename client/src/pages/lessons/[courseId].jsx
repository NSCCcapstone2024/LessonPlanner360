import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AccordionItem from '../../components/accordionItem';

export default function Lessons() {
    const router = useRouter();
    const { courseId, courseName } = router.query;
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="container mx-auto px-4 pt-8">
            <h1 className="text-3xl font-bold mb-6">Lessons for Course {decodeURIComponent(courseName || '')}</h1>
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
