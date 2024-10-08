// Objects for all menu features
var courseManager = new CourseManager();
var taskManager = new TaskManager();
var calendarManager = new CalendarManager();
var saveManager = new SaveManager();

// create testing info for the course and task managers -----------------------------------------------------------------------------------------------
// addCourse(title), addAssignmentToCourse(courseId, assignmentDetails), assignment constructor "constructor(name, grade, weight)"

function createDemoInfo() {
    courseManager.addCourse('CP317 - Software Engineering');
    courseManager.addCourse('CP312 - Algorithms');
    courseManager.addCourse('PP247 - Business Ethics');

    courseManager.selectCourse(0);

    console.log("sht");
    console.log(courseManager.courses);

    // laurier example courses for demo information
    // Adding Software Engineering assignments
    courseManager.addAssignmentToCourse(0, new Assignment('Assignment 1', 90, 8.33, true));
    courseManager.addAssignmentToCourse(0, new Assignment('Assignment 2', 0, 8.33, false));
    courseManager.addAssignmentToCourse(0, new Assignment('Assignment 3', 0, 8.33, false));
    courseManager.addAssignmentToCourse(0, new Assignment('Exam 1', 81, 20, true));
    courseManager.addAssignmentToCourse(0, new Assignment('Exam 2', 0, 20, false));
    courseManager.addAssignmentToCourse(0, new Assignment('Group Project', 0, 35, false));

    // Adding Algorithms assignments
    courseManager.addAssignmentToCourse(1, new Assignment('Quiz 1', 53.33, 5, true));
    courseManager.addAssignmentToCourse(1, new Assignment('Quiz 2', 90, 5, true));
    courseManager.addAssignmentToCourse(1, new Assignment('Quiz 3', 0, 5, false));
    courseManager.addAssignmentToCourse(1, new Assignment('Quiz 4', 0, 5, false));
    courseManager.addAssignmentToCourse(1, new Assignment('Assignment 1', 44, 5, true));
    courseManager.addAssignmentToCourse(1, new Assignment('Assignment 2', 78, 5, false));
    courseManager.addAssignmentToCourse(1, new Assignment('Assignment 3', 0, 5, false));
    courseManager.addAssignmentToCourse(1, new Assignment('Assignment 4', 0, 5, false));
    courseManager.addAssignmentToCourse(1, new Assignment('Midterm', 74, 20, false));
    courseManager.addAssignmentToCourse(1, new Assignment('Final', 0, 40, false));

    // Adding Business Ethics assignments
    courseManager.addAssignmentToCourse(2, new Assignment('Discussion posts', 0, 15, false));
    courseManager.addAssignmentToCourse(2, new Assignment('Assignment 1', 70, 25, true));
    courseManager.addAssignmentToCourse(2, new Assignment('Assignment 2', 0, 25, false));
    courseManager.addAssignmentToCourse(2, new Assignment('Assignment 3', 0, 0, false));
    courseManager.addAssignmentToCourse(2, new Assignment('Midterm', 78.33, 15, true));
    courseManager.addAssignmentToCourse(2, new Assignment('Final', 0, 20, false));

    // create demo input for task manager, AddTask (taskname, taskGrade, taskWeight, taskCourse, taskDueDate)
    // Academic tasks
    taskManager.AddTask('Write save and load feature for the course manager', 100, 20, 'Math', '2024-09-15');
}

// createDemoInfo();

// Object Starting positions -----------------------------------------------------------------------------------------------
taskManager.display();
taskManager.updateTimeRemaining();
taskManager.startLoop();
courseManager.display();
// courseManager.displayAssignments(0);

// EVENT LISTENERS ----------------------------------------------------------------------------------------------------------
// Add Task Button
const taskButton = document.getElementById('tasks-btn');
taskButton.addEventListener('click', () => {
    clearHighlight();
    taskButton.classList.add('highlight');
    taskManager.display();
});

// Add grades button, displays courses when clicked
const gradesButton = document.getElementById('grades-btn');
gradesButton.classList.add('highlight');
gradesButton.addEventListener('click', () => {
    clearHighlight();
    gradesButton.classList.add('highlight');
    courseManager.display();
    console.log("displaying Assignments in Course: " + courseManager.selectedCourse.id);
    courseManager.displayAssignments(courseManager.selectedCourse.id)
});

// Add calendar button, displays courses when clicked
const calendarButton = document.getElementById('calendar-btn');
calendarButton.addEventListener('click', () => {
    clearHighlight();
    calendarButton.classList.add('highlight');
    calendarManager.display();
});

// Add Course Button
document.getElementById('add-course-popup-btn').addEventListener('click', courseManager.addCourseFromPopup);

// Close Course Popup
document.getElementById('close').addEventListener('click', courseManager.closeAddCoursePopup);

// Close Edit assignment Popup
document.getElementById('close-edit-popup').addEventListener('click', courseManager.closeEditAssignmentPopup);

// Close Assignment Popup
document.getElementsByClassName('close-popup')[0].addEventListener('click', courseManager.closeAddAssignmentPopup);

document.getElementById('add-assignment-popup-btn').addEventListener('click', () => {
    courseManager.addAssignmentFromPopup();
});

document.getElementById('edit-assignment-popup-btn').addEventListener('click', () => {
    const assignmentContainer = document.querySelector('.assignment.assignment-details-container');
    const assignmentId = assignmentContainer.dataset.assignmentId;
    console.log("Buttonclick: " + assignmentId);
    courseManager.editAssignmentFromPopup(assignmentId);
});

// Add Task Popup - Button
document.getElementById('add-task-popup-btn').addEventListener('click', () => {
    taskManager.addTaskFromPopup();
});

// Close task Popup
document.getElementById('close-task-popup').addEventListener('click', taskManager.hideTaskPopup);

// Save and Load Buttons
document.getElementById('save-btn').addEventListener('click', () => {   
    saveManager.saveToFile(courseManager, taskManager, calendarManager);
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    console.log("File input changed");
    const file = event.target.files[0];
    if (file) {
        saveManager.loadFromFile(courseManager, taskManager, calendarManager, file);
    }
});

// sign up buttons
document.getElementById('userPopupButton').addEventListener('click', () => {
    displaySignup();
});

document.getElementById('userPopupCloseButton').addEventListener('click', () => {
    closeSignup();
});



// login buttons
document.getElementById('userLoginPopupButton').addEventListener('click', () => {
    displayLogin();
});

document.getElementById('userLoginPopupCloseButton').addEventListener('click', () => {
    closeLogin();
});

// account buttons
document.getElementById('accountPopupButton').addEventListener('click', () => {
    displayAccount();
});

document.getElementById('accountPopupCloseButton').addEventListener('click', () => {
    closeAccount();
});

function displaySignup() {
    document.getElementById('signup-popup').style.display = 'block';
    closeAccount();
}

function closeSignup() {
    document.getElementById('signup-popup').style.display = 'none';
    displayAccount();
}

function displayLogin() {
    document.getElementById('login-popup').style.display = 'block';
    closeAccount();
}

function closeLogin() {
    document.getElementById('login-popup').style.display = 'none';
    displayAccount();
}

function displayAccount() {
    document.getElementById('account-popup').style.display = 'block';
}

function closeAccount() {
    document.getElementById('account-popup').style.display = 'none';
}

function clearHighlight () {
    //get calendar, grades and tasks button and remove the highlight class.
    const calendarButton = document.getElementById('calendar-btn');
    const gradesButton = document.getElementById('grades-btn');
    const taskButton = document.getElementById('tasks-btn');

    calendarButton.classList.remove('highlight');
    gradesButton.classList.remove('highlight');
    taskButton.classList.remove('highlight');
}

function showOverlay() {
    var overlay = document.querySelector('.overlay');
    overlay.style.display = 'block';
}

function hideOverlay() {
    var overlay = document.querySelector('.overlay');
    overlay.style.display = 'none';
}
function updateOverallGradeDisplay() {
    console.log(courseManager.selectedCourse);
    console.log("Selected course ID: " + courseManager.selectedCourse.id);
    const selectedCourseId = courseManager.selectedCourse.id;
    const course = courseManager.getCourseById(selectedCourseId);
    
    if (course) {
        course.recalculateCourseGrade();
        const courseGradeElement = document.getElementById('course-grade'+course.id);
        courseGradeElement.textContent = `Grade: ${course.overallGrade.toFixed(2)}%`;
        // make the ext white
        courseGradeElement.style.color = 'white';
        console.log(`Course grade recalculated and displayed: ${course.overallGrade.toFixed(2)}%`);
    }

    const overallGrade = courseManager.calculateOverallGrade();
    console.log(`Overall grade recalculated: ${overallGrade.toFixed(2)}%`);

    const overallGradeElements = document.querySelectorAll('#overall-grade');
    overallGradeElements.forEach(element => {
        element.textContent = `Overall Grade: ${overallGrade.toFixed(2)}%`;
    });
    console.log(`Overall grade recalculated and displayed: ${overallGrade.toFixed(2)}%`);
}

function toggleComplete (assignment, completionButton) {
    // toggles the completion based on the current state of assignment.completed
    assignment.completed = !assignment.completed;
    // toggles the style based on the current state of assignment.completed between .completed and .incomplete
    if (assignment.completed) {
        completionButton.classList.remove('incomplete');
        completionButton.classList.add('complete');
        completionButton.textContent = "Done ✔";
        completionButton.style.color = 'white';
    } else {
        completionButton.classList.remove('complete');
        completionButton.classList.add('incomplete');
        completionButton.textContent = "To Do ✘";
        completionButton.style.color = 'black';
    }
}

function removeAssignmentFromCourse(courseId, assignmentId) {
    const course = courseManager.getCourseById(courseId);
    if (course && course.assignments) {
        console.log(`Removing assignment with ID ${assignmentId} from course with ID ${courseId} 111111111111111111111`);
        courseManager.removeAssignmentFromCourse(courseId, assignmentId);
        console.log(`Assignment with ID ${assignmentId} removed from course with ID ${courseId}`);
        courseManager.displayAssignments(courseId);
    }
}

