const courseManager = new CourseManager();

function populateCourseDropdown() {
    const courseDropdown = document.getElementById('course-dropdown');
    courseDropdown.innerHTML = '<option value="" disabled selected>Select a course</option>'; // Default option

    courseManager.courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.text = course.title;
        courseDropdown.add(option);
    });
}

function updateAssignmentsDisplay(courseId) {
    console.log(`Starting updateAssignmentsDisplay for course ID: ${courseId}`);

    // Find the course object by ID
    const course = courseManager.getCourseById(courseId);
    if (!course) {
        console.error("Course not found");
        return;
    }

    console.log(`Course found, proceeding to construct selector`);

    // Construct a selector for the grades section using the data-id attribute
    const gradesSectionSelector = `.course[data-id="${courseId}"] >.grades-section`;
    console.log(`Constructed selector: ${gradesSectionSelector}`);

    // Attempt to find the grades section using the constructed selector
    const gradesSection = document.querySelector(gradesSectionSelector);
    if (!gradesSection) {
        console.error(`Grades section not found for course ID: ${courseId}`);
        return;
    }

    console.log(`Grades section found, clearing existing assignments`);

    // Clear existing assignments
    gradesSection.innerHTML = '';

    // Create the legend div
    const legendDiv = document.createElement('div');
    legendDiv.className = 'legend';

    // Populate the legend div with names, grades, weighted grades, completion, and operations
    ['Name', 'Grade', 'Weighted Grade', 'Completion', 'Operations'].forEach(text => {
        const legendItem = document.createElement('div');
        legendItem.textContent = text;
        legendItem.style.fontWeight = 'bold';
        legendDiv.appendChild(legendItem);
    });

    gradesSection.appendChild(legendDiv);

    console.log(`Existing assignments cleared, generating new assignment HTML`);

    // Generate HTML for each assignment
    course.assignments.forEach(assignment => {
        const assignmentElement = document.createElement('div');
        assignmentElement.className = 'assignment assignment-details-container';

        // Create the h4 element for the assignment name
        const nameH4 = document.createElement('h4');
        nameH4.textContent = assignment.name; // Set the text content of the h4
        const nameElement = document.createElement('div');
        
        // Append the h4 to the div
        nameElement.appendChild(nameH4);

        const gradeElement = document.createElement('div');
        gradeElement.textContent = `${assignment.grade}%`;

        const assignmentWeightedScore = (assignment.grade * (assignment.weight / 100)).toFixed(2);
        const weightedGradeElement = document.createElement('div');
        weightedGradeElement.textContent = `${assignmentWeightedScore} / ${assignment.weight}%`;

        // Checkbox for marking assignment as complete or incomplete
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = assignment.completed; // Initialize with the current state
        checkbox.addEventListener('change', () => {
            assignment.completed = checkbox.checked;
            updateOverallGradeDisplay();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => removeAssignmentFromCourse(courseId, assignment.id); // Assuming this function handles deletion

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.className = 'checkbox-wrapper';
        const deleteButtonWrapper = document.createElement('div');
        deleteButtonWrapper.className = 'delete-button-wrapper';
        
        checkboxWrapper.appendChild(checkbox);
        deleteButtonWrapper.appendChild(deleteButton);

        // Append each detail directly to assignmentElement
        assignmentElement.appendChild(nameElement);
        assignmentElement.appendChild(gradeElement);
        assignmentElement.appendChild(weightedGradeElement);
        assignmentElement.appendChild(checkboxWrapper);
        assignmentElement.appendChild(deleteButtonWrapper);

        // Append the assignment element to the grades section
        gradesSection.appendChild(assignmentElement);
    });
    updateOverallGradeDisplay();
    console.log(`New assignments generated and appended to grades section`);
}

function displayCourses() {
    const coursesLoadedDiv = document.querySelector('.courses-loaded');

    // Check if the div exists before attempting to clear its content
    if (!coursesLoadedDiv) {
        console.warn('Could not find .courses-loaded');
        return; // Exit the function if the div is not found
    }

    // Clear existing content
    coursesLoadedDiv.innerHTML = '';

    // Generate HTML for each course and append to the "courses-loaded" div
    courseManager.courses.forEach(course => {
        const courseSection = document.createElement('div');
        courseSection.className = 'course';
        courseSection.dataset.id = course.id; // Setting the data-id attribute

        // Create the course name element
        const courseNameElement = document.createElement('h3');
        courseNameElement.textContent = course.title;
        courseSection.appendChild(courseNameElement);

        // Create the course grade element
        const courseGradeElement = document.createElement('p');
        courseGradeElement.id = 'course-grade'+course.id;
        courseGradeElement.textContent = "Course Grade: 0.00%";
        courseSection.appendChild(courseGradeElement);

        // Create the grades section
        const gradesSection = document.createElement('div');
        gradesSection.className = 'grades-section';
        courseSection.appendChild(gradesSection);

        // Create the legend div
        const legendDiv = document.createElement('div');
        legendDiv.className = 'legend';

        // Populate the legend div with names, grades, weighted grades, completion, and operations
        ['Name', 'Grade', 'Weighted Grade', 'Completion', 'Operations'].forEach(text => {
            const legendItem = document.createElement('div');
            legendItem.textContent = text;
            legendDiv.appendChild(legendItem);
        });

        gradesSection.appendChild(legendDiv);

        // Create the add assignment button
        const addAssignmentButton = document.createElement('button');
        addAssignmentButton.textContent = "Add Assignment";
        addAssignmentButton.onclick = () => openAddAssignmentPopup(course.id);
        
        // Create the delete course button
        const deleteCourseButton = document.createElement('button');
        deleteCourseButton.textContent = "Delete Course";
        deleteCourseButton.id = 'delete-course-btn';
        deleteCourseButton.className = 'delete-btn';

        // Attach the event listener to the delete button
        deleteCourseButton.addEventListener('click', () => {
            console.log('Delete button clicked');
            deleteCourse(course.id);
            deleteCourseButton.disabled = true;
            setTimeout(() => {
                deleteCourseButton.disabled = false;
            }, 1000);
        });

        // create a div for the delete course and assignment button
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'button-div';
        buttonDiv.appendChild(addAssignmentButton);
        buttonDiv.appendChild(deleteCourseButton);
        courseSection.appendChild(buttonDiv);

        // Append the course section to the "courses-loaded" div
        coursesLoadedDiv.appendChild(courseSection);

        // Toggle visibility based on selection
        if (course.id === document.getElementById('course-dropdown').value) {
            courseSection.classList.remove('hidden');
            updateAssignmentsDisplay(course.id);
        } else {
            courseSection.classList.add('hidden');
        }
    });
}

function openAddCoursePopup() {
    document.getElementById('popup-menu').style.display = 'block';
    showOverlay();
}

function closeAddCoursePopup() {
    document.getElementById('popup-menu').style.display = 'none';
    hideOverlay();
}

function addCourseFromPopup() {
    const courseNameInput = document.getElementById('course-name-input').value;
    if (!courseNameInput.trim()) {
        alert("Please enter a course name.");
        return;
    }

    const course = courseManager.addCourse(courseNameInput);
    closeAddCoursePopup();
    populateCourseDropdown();

    // Ensure the newly added course is selected in the dropdown and refresh the display
    document.getElementById('course-dropdown').value = course.id;
    displayCourses();
}

function openAddAssignmentPopup() {
    document.getElementById('assignment-popup').style.display = 'block';
    showOverlay();
}

function closeAddAssignmentPopup() {
    document.getElementById('assignment-popup').style.display = 'none';
    hideOverlay();
}

function addAssignmentFromPopup() {
    const assignmentName = document.getElementById('assignment-name-input').value;
    const assignmentGrade = parseFloat(document.getElementById('assignment-grade-input').value);
    const assignmentWeight = parseInt(document.getElementById('assignment-weight-input').value);

    if (!assignmentName || isNaN(assignmentGrade) || isNaN(assignmentWeight)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const selectedCourseId = document.getElementById('course-dropdown').value;
    if (!selectedCourseId) {
        alert("Please select a course.");
        return;
    }

    const assignment = courseManager.addAssignmentToCourse(selectedCourseId, {id: Math.random().toString(36).substring(7), name: assignmentName, grade: assignmentGrade, weight: assignmentWeight});
    updateAssignmentsDisplay(selectedCourseId);
    closeAddAssignmentPopup();
}

function removeAssignmentFromCourse(courseId, assignmentId) {
    const course = courseManager.getCourseById(courseId);
    if (course && course.assignments) {
        course.assignments = course.assignments.filter(assignment => assignment.id !== assignmentId);
        console.log(`Assignment with ID ${assignmentId} removed from course with ID ${courseId}`);
        updateAssignmentsDisplay(courseId);
    }
}

function updateOverallGradeDisplay() {
    const selectedCourseId = document.getElementById('course-dropdown').value;
    const course = courseManager.getCourseById(selectedCourseId);
    
    if (course) {
        course.recalculateCourseGrade();
        const courseGradeElement = document.getElementById('course-grade'+course.id);
        courseGradeElement.textContent = `Course Grade: ${course.courseGrade.toFixed(2)}%`;
        console.log(`Course grade recalculated and displayed: ${course.courseGrade.toFixed(2)}%`);
    }

    const overallGrade = courseManager.calculateOverallGrade();
    document.getElementById('overall-grade').textContent = `Overall Grade: ${overallGrade.toFixed(2)}%`;
    console.log(`Overall grade recalculated and displayed: ${overallGrade.toFixed(2)}%`);
}


function deleteCourse(courseId) {
    courseManager.removeCourse(courseId);
    if (courseManager.courses.length > 0) {
        document.getElementById('course-dropdown').value = courseManager.courses[0].id;
    }
    populateCourseDropdown();
    displayCourses();
    updateOverallGradeDisplay();
}

function showOverlay() {
    var overlay = document.querySelector('.overlay');
    overlay.style.display = 'block';
}

function hideOverlay() {
    var overlay = document.querySelector('.overlay');
    overlay.style.display = 'none';
}

function saveData() {
    // Save the courseManager object to a file
    saveToFile(courseManager);
}

document.addEventListener('DOMContentLoaded', (event) => {
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const savedCourseManager = JSON.parse(event.target.result);

                // print all of the information from the file
                console.log(savedCourseManager);
                
                if (!savedCourseManager || !Array.isArray(savedCourseManager.courses)) {
                    throw new Error("Invalid data format.");
                }
                
                savedCourseManager.courses.forEach(course => {
                    const newCourse = courseManager.addCourseLoad(course.title, course.id, course.assignments);
                    console.log(`Course loaded: ${newCourse.id}` + ` ${newCourse.title}` + ` ${newCourse.assignments}`);
                    populateCourseDropdown();
                });

                // select the last course in the dropdown
                document.getElementById('course-dropdown').value = courseManager.courses[courseManager.courses.length - 1].id;
                displayCourses();
                updateOverallGradeDisplay();

            } catch (error) {
                console.error("Error while processing file:", error);
            }
        };

        reader.onerror = (event) => {
            console.error("File read error:", event.target.error);
        };

        reader.readAsText(file);
    });

    document.getElementById('course-dropdown').addEventListener('change', () => {
        const selectedCourseId = document.getElementById('course-dropdown').value;
        if (selectedCourseId) {
            updateAssignmentsDisplay(selectedCourseId);
            displayCourses(); // Re-display courses to show/hide the selected one
        }
    });

    // save button
    document.getElementById('save-btn').addEventListener('click', saveData);

    // Open Course Popup Button
    document.getElementById('open-popup-btn').addEventListener('click', openAddCoursePopup);

    // Close Course Popup
    document.querySelector('.close').addEventListener('click', closeAddCoursePopup);

    // Add Course Popup - Button
    document.getElementById('add-course-popup-btn').addEventListener('click', addCourseFromPopup);

    // Close Assignment Popup
    document.querySelector('.close-popup').addEventListener('click', closeAddAssignmentPopup);

    // Add Assignment Popup - Button
    document.getElementById('add-assignment-popup-btn').addEventListener('click', addAssignmentFromPopup);

    // Initialize the dropdown with existing courses
    populateCourseDropdown();
    displayCourses();
});
