import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AccordionItem from '../../components/accordionItem';

export default function Lessons() {

    // ---------------------STATE---------------------
    const router = useRouter();
    // get the courseId from the query
    const { courseId, courseName } = router.query;
    const [lessons, setLessons] = useState([]);


    // fetch the lessons for the course
    useEffect(() => {
        if (!courseId) return;
        const fetchLessons = async () => {
            const response = await fetch(`/api/lessons/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                setLessons(data);
            } else {
                console.error('Failed to fetch lessons');
            }
        };
        fetchLessons();
    }, [courseId]);

    // toggle the accordion
    let toggleLessonOpen = (lessonId) => {
        let updatedLessons = lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, isOpen: !lesson.isOpen } : lesson
        );
        setLessons(updatedLessons);
    };

    return (
        <div className="container mx-auto px-4 pt-8">
            <h1>Lessons for Course {decodeURIComponent(courseName || '')}</h1>
            {lessons.map((lesson) => (
                <AccordionItem key={lesson.id} lesson={lesson} onToggle={toggleLessonOpen} />
            ))}
        </div>
    );
}
