document.addEventListener("DOMContentLoaded", function() {
    let courses = [];
    let assignmentCounter = 0; // Global counter for assignment IDs

    function addCourse() {
        const coursesSection = document.querySelector('.course-section');

        const courseId = "course" + (courses.length + 1);
        const newCourseDiv = document.createElement('div');
        newCourseDiv.className = 'course';
        newCourseDiv.id = courseId;

        const courseTitleInput = prompt("Enter course name:");
        if (courseTitleInput) {
            const courseNameElement = document.createElement('h3');
            courseNameElement.textContent = courseTitleInput;
            newCourseDiv.appendChild(courseNameElement);

            // Create element for course grade
            const courseGradeElement = document.createElement('p');
            courseGradeElement.className = 'course-grade';
            courseGradeElement.textContent = "Course Grade: N/A"; // Initial placeholder
            newCourseDiv.appendChild(courseGradeElement);

            const gradesSection = document.createElement('div');
            gradesSection.className = 'grades-section';
            newCourseDiv.appendChild(gradesSection);

            // Add legend explaining the content of the assignment section
            const legendDiv = document.createElement('div');
            legendDiv.className = 'legend';

            const legendName = document.createElement('div');
            legendName.textContent = 'Name';
            legendDiv.appendChild(legendName);

            const legendGrade = document.createElement('div');
            legendGrade.textContent = 'Grade';
            legendDiv.appendChild(legendGrade);

            const legendWeightedGrade = document.createElement('div');
            legendWeightedGrade.textContent = 'Weighted Grade';
            legendDiv.appendChild(legendWeightedGrade);

            // Add "Completion" label to the legend in the 4th position from the left
            const legendCompletion = document.createElement('div');
            legendCompletion.textContent = 'Completion';
            legendDiv.insertBefore(legendCompletion, legendDiv.children[3]); // Insert at index 3

            const legendDelete = document.createElement('div');
            legendDelete.textContent = 'Operations';
            legendDiv.appendChild(legendDelete);

            gradesSection.appendChild(legendDiv);

            // Add button to add assignment
            const addAssignmentButton = document.createElement('button');
            addAssignmentButton.textContent = "Add Assignment";
            addAssignmentButton.onclick = () => addAssignment(courseId);
            newCourseDiv.appendChild(addAssignmentButton);

            courses.push({ id: courseId, title: courseTitleInput, assignments: [], totalWeight: 0 });
            newCourseDiv.style.cssText = 'text-align: left'; // Ensure course content is left-aligned
            coursesSection.appendChild(newCourseDiv);

            // Update the course dropdown menu
            populateCourseDropdown();

            // Select and display the newly added course
            const dropdown = document.getElementById('course-dropdown');
            dropdown.value = courseId;
            showSelectedCourse(courseId);
        }
    }

    function addAssignment(courseId) {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
    
        const assignmentId = "assignment" + (++assignmentCounter); // Generate unique assignment ID
        const newAssignmentDiv = document.createElement('div');
        newAssignmentDiv.className = 'assignment';
        newAssignmentDiv.id = assignmentId; // Assign unique ID to the assignment's HTML element
    
        const nameWrapper = createWrapperDiv();
        const gradeWrapper = createWrapperDiv();
        const weightedGradeWrapper = createWrapperDiv();
        const completionWrapper = createWrapperDiv();
        const operationsWrapper = createWrapperDiv();
    
        const assignmentNameInput = prompt("Enter assignment name:");
        if (assignmentNameInput) {
            const assignmentNameElement = document.createElement('h4');
            assignmentNameElement.textContent = assignmentNameInput;
            nameWrapper.appendChild(assignmentNameElement);
    
            const assignmentGradeInput = prompt("Enter assignment grade (leave blank if none):");
            const assignmentWeightInput = prompt("Enter assignment weight (as a percentage):");
            const assignmentWeightedScore = assignmentGradeInput && assignmentWeightInput ? (assignmentWeightInput * (assignmentGradeInput / 100)) : 0;
    
            if (assignmentGradeInput && assignmentWeightInput) {
                const assignmentGradeElement = document.createElement('p');
                assignmentGradeElement.textContent = `${assignmentGradeInput}%`;
                gradeWrapper.appendChild(assignmentGradeElement);
    
                const assignmentWeightedScoreElement = document.createElement('p');
                assignmentWeightedScoreElement.textContent = `Grade: ${assignmentWeightedScore.toFixed(2)} / ${assignmentWeightInput}%`;
                weightedGradeWrapper.appendChild(assignmentWeightedScoreElement);
    
                                // Create checkbox for marking completion status
                const completionCheckbox = document.createElement('input');
                completionCheckbox.type = 'checkbox';
                completionCheckbox.id = assignmentId + '-completed';
                completionCheckbox.addEventListener('change', function() {
                    const isChecked = this.checked;
                    const assignment = course.assignments.find(a => a.id === assignmentId);
                    if (assignment) {
                        assignment.completed = isChecked;
                        calculateAndDisplayOverallGrade(); // Update overall grade when completion status changes
                        calculateAndDisplayCourseGrade(course); // Update course grade when completion status changes
                    }
                });

                completionWrapper.appendChild(completionCheckbox);
    
                course.assignments.push({
                    id: assignmentId,
                    name: assignmentNameInput,
                    grade: parseFloat(assignmentGradeInput),
                    weight: parseFloat(assignmentWeightInput),
                    completed: false // Initialize as not completed
                });
                course.totalWeight += parseFloat(assignmentWeightInput);
            } else {
                const assignmentGradeElement = document.createElement('p');
                assignmentGradeElement.textContent = `Grade: N/A`;
                gradeWrapper.appendChild(assignmentGradeElement);
    
                const assignmentWeightElement = document.createElement('p');
                assignmentWeightElement.textContent = `Weight: ${assignmentWeightInput}%`;
                weightedGradeWrapper.appendChild(assignmentWeightElement);
    
                course.assignments.push({
                    id: assignmentId,
                    name: assignmentNameInput,
                    grade: null,
                    weight: parseFloat(assignmentWeightInput),
                    completed: false // Initialize as not completed
                });
                course.totalWeight += parseFloat(assignmentWeightInput);
            }
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteAssignment(assignmentId, courseId); // Pass both assignmentId and courseId
            const trashIcon = document.createElement('i');
            trashIcon.classList.add('fa', 'fa-trash');
            deleteButton.appendChild(trashIcon);
            operationsWrapper.appendChild(deleteButton);
    
            newAssignmentDiv.appendChild(nameWrapper);
            newAssignmentDiv.appendChild(gradeWrapper);
            newAssignmentDiv.appendChild(weightedGradeWrapper);
            newAssignmentDiv.appendChild(completionWrapper);
            newAssignmentDiv.appendChild(operationsWrapper);
    
            const gradesSection = document.getElementById(courseId).querySelector('.grades-section');
            if (gradesSection) {
                gradesSection.appendChild(newAssignmentDiv);
            }
        }
        calculateAndDisplayOverallGrade();
    }

    function createWrapperDiv(flex = 1) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.flex = flex; // Set the flex property
        wrapperDiv.style.textAlign = 'left'; // Align content to the left
        return wrapperDiv;
    }

    function populateCourseDropdown() {
        const dropdown = document.getElementById('course-dropdown');
        dropdown.innerHTML = ''; // Clear previous options

        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.title;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', function() {
            const selectedCourseId = this.value;
            showSelectedCourse(selectedCourseId);
        });
    }

    function showSelectedCourse(courseId) {
        const allCourses = document.querySelectorAll('.course');
        allCourses.forEach(course => {
            course.style.display = 'none';
        });

        const selectedCourse = document.getElementById(courseId);
        if (selectedCourse) {
            selectedCourse.style.display = 'block';
        }
    }

    function deleteAssignment(assignmentId, courseId) {
        const courseIndex = courses.findIndex(c => c.id === courseId);
        if (courseIndex === -1) return;
    
        const course = courses[courseIndex];
        const assignmentIndex = course.assignments.findIndex(a => a.id === assignmentId);
        if (assignmentIndex === -1) return;
    
        const deletedAssignment = course.assignments.splice(assignmentIndex, 1)[0];
        course.totalWeight -= deletedAssignment.weight;
    
        const assignmentDiv = document.getElementById(assignmentId);
        if (assignmentDiv) {
            assignmentDiv.remove(); // Remove assignment element from the DOM
        }
    
        calculateAndDisplayOverallGrade();
    }
    
    function calculateAndDisplayCourseGrade(course) {
        let totalCourseScore = 0;
        let totalCourseWeight = 0;
    
        course.assignments.forEach(assignment => {
            if (assignment.completed && assignment.grade !== null) {
                totalCourseScore += parseFloat(assignment.grade) * (assignment.weight / 100);
                totalCourseWeight += assignment.weight;
            }
        });
    
        const courseGrade = totalCourseWeight > 0 ? (totalCourseScore / totalCourseWeight) * 100 : 0;
        course.grade = courseGrade;
    
        const courseElement = document.getElementById(course.id);
        const courseGradeElement = courseElement.querySelector('.course-grade');
        if (courseGradeElement) {
            courseGradeElement.textContent = `Course Grade: ${course.grade.toFixed(2)}%`;
        }
    }

    function calculateAndDisplayOverallGrade() {
        let totalOverallScore = 0;
        let totalOverallWeight = 0;
        let totalCompletedCourses = 0; // Counter for completed courses
    
        courses.forEach(course => {
            let totalCourseScore = 0;
            let totalCourseWeight = 0;
            let hasCompletedAssignment = false; // Flag to check if the course has a completed assignment
    
            course.assignments.forEach(assignment => {
                if (assignment.completed && assignment.grade !== null) { // Check if assignment is completed and has a grade
                    totalCourseScore += parseFloat(assignment.grade) * (assignment.weight / 100);
                    totalCourseWeight += assignment.weight;
                    hasCompletedAssignment = true; // Set flag to true if at least one assignment is completed
                }
            });
    
            // Only calculate the course grade if at least one assignment is completed
            if (hasCompletedAssignment) {
                const courseGrade = totalCourseWeight > 0 ? (totalCourseScore / totalCourseWeight) * 100 : 0;
                course.grade = courseGrade;
                totalOverallScore += courseGrade; // Accumulate course grades
                totalCompletedCourses++; // Increment the counter for completed courses
            }
        });
    
        // Calculate overall grade only if there are completed courses
        const overallGrade = totalCompletedCourses > 0 ? totalOverallScore / totalCompletedCourses : 0;
        document.getElementById('overall-grade').textContent = `Grade: ${overallGrade.toFixed(2)}%`;
    
        courses.forEach(course => {
            const courseElement = document.getElementById(course.id);
            const courseGradeElement = courseElement.querySelector('.course-grade');
            if (courseGradeElement) {
                courseGradeElement.textContent = `Course Grade: ${course.grade.toFixed(2)}%`;
            }
        });
    }

    // Function to add event listener to HTML button for adding courses
    const addCourseButton = document.getElementById('add-course-btn');
    if (addCourseButton) {
        addCourseButton.addEventListener('click', addCourse);
    } else {
        console.error("Add course button not found.");
    }

    // Ensure "Courses" title is always at the top
    const coursesTitle = document.querySelector('.course-section h3');
    if (coursesTitle) {
        const courseSection = document.querySelector('.course-section');
        courseSection.insertBefore(coursesTitle, courseSection.firstChild);
    } else {
        console.error("Courses title element not found.");
    }

    // Call the function to populate the course dropdown menu
    populateCourseDropdown();
});
