
// this function creates an accordion item for each lesson
function AccordionItem({ lesson, onToggle }) {
    return (
        <div className="border-b border-gray-200">
            <button
                className="accordion-title py-2 px-4 w-full text-left text-gray-800 font-medium hover:bg-gray-100 focus:outline-none"
                onClick={() => onToggle(lesson.id)}
            >
                Unit {lesson.unit_number}: {lesson.material}
            </button>
            {lesson.isOpen && (
                <div className="accordion-content p-4 bg-gray-100 text-gray-600">
                    <p>Week: {lesson.week}</p>
                    <p>Learning Outcomes: {lesson.learning_outcomes}</p>
                    <p>Enabling Outcomes: {lesson.enabling_outcomes}</p>
                    <p>Assessment: {lesson.assessment}</p>
                    <p>Notes: {lesson.notes}</p>
                </div>
            )}
        </div>
    );
}
export default AccordionItem;