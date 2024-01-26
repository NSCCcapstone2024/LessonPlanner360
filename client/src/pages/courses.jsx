import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function Courses() {
    let [courses, setCourses] = useState([]);

    // fetch courses from API
    useEffect(() => {
        async function fetchCourses() {
            const response = await fetch('/api/courses');
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                console.error('Failed to fetch courses');
            }
        }

        fetchCourses();
    }, []);

    return (
        <div>
            <p>This is the courses page!</p>
            {/* display courses */}
            <ul>
                {courses.map(course => (
                    <li key={course.course_code}>{course.course_code} - {course.course_name}</li>
                ))}
            </ul>
        </div>
    );
}
