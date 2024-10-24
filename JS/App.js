// Objects for all menu features
window.courseManager = new CourseManager();
window.taskManager = new TaskManager();
window.calendarManager = new CalendarManager();
window.saveManager = new SaveManager();

// create testing info for the course and task managers -----------------------------------------------------------------------------------------------

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
    console.log(taskManager);
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
