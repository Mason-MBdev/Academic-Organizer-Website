document.addEventListener("DOMContentLoaded", function() {
    let courses = [];
    let assignmentCounter = 0;

    const openPopupBtn = document.getElementById('open-popup-btn');
    const popupMenu = document.getElementById('popup-menu');
    const closePopupBtn = popupMenu.querySelector('.close');

    openPopupBtn.addEventListener('click', function() {
        popupMenu.style.display = 'block';
    });

    closePopupBtn.addEventListener('click', function() {
        popupMenu.style.display = 'none';
    });

    const addCoursePopupBtn = document.getElementById('add-course-popup-btn');
    addCoursePopupBtn.addEventListener('click', function() {
        const courseTitleInput = document.getElementById('course-name-input').value;
        if (courseTitleInput) {
            addCourseFromPopup(courseTitleInput);
            popupMenu.style.display = 'none';
        } else {
            alert("Please enter a course name.");
        }
    });

    function addCourseFromPopup(courseTitleInput) {
        const coursesSection = document.querySelector('.course-section');

        const courseId = "course" + (courses.length + 1);
        const newCourseDiv = document.createElement('div');
        newCourseDiv.className = 'course';
        newCourseDiv.id = courseId;

        const courseNameElement = document.createElement('h3');
        courseNameElement.textContent = courseTitleInput;
        newCourseDiv.appendChild(courseNameElement);

        const courseGradeElement = document.createElement('p');
        courseGradeElement.className = 'course-grade';
        courseGradeElement.textContent = "Course Grade: N/A";
        newCourseDiv.appendChild(courseGradeElement);

        const gradesSection = document.createElement('div');
        gradesSection.className = 'grades-section';
        newCourseDiv.appendChild(gradesSection);

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

        const legendCompletion = document.createElement('div');
        legendCompletion.textContent = 'Completion';
        legendDiv.insertBefore(legendCompletion, legendDiv.children[3]);

        const legendDelete = document.createElement('div');
        legendDelete.textContent = 'Operations';
        legendDiv.appendChild(legendDelete);

        gradesSection.appendChild(legendDiv);

        const addAssignmentButton = document.createElement('button');
        addAssignmentButton.textContent = "Add Assignment";
        addAssignmentButton.onclick = () => openAssignmentPopup(courseId);
        newCourseDiv.appendChild(addAssignmentButton);

        // Get the existing delete button
        const deleteCourseButton = document.getElementById('delete-course-btn');

        // Add event listener to the existing delete button
        deleteCourseButton.addEventListener('click', () => {
            const courseId = getCourseId();
            deleteCourse(courseId);
        });

        courses.push({ id: courseId, title: courseTitleInput, assignments: [], totalWeight: 0 });
        newCourseDiv.style.cssText = 'text-align: left';
        coursesSection.appendChild(newCourseDiv);

        populateCourseDropdown();

        const dropdown = document.getElementById('course-dropdown');
        dropdown.value = courseId;
        showSelectedCourse(courseId);
    }

    function openAssignmentPopup(courseId) {
        const assignmentPopup = document.getElementById('assignment-popup');
        assignmentPopup.style.display = 'block';

        const addAssignmentPopupBtn = document.getElementById('add-assignment-popup-btn');
        addAssignmentPopupBtn.onclick = function() {
            const course = courses.find(c => c.id === courseId);
            if (!course) return;

            const assignmentNameInput = document.getElementById('assignment-name-input').value;
            const assignmentGradeInput = document.getElementById('assignment-grade-input').value;
            const assignmentWeightInput = document.getElementById('assignment-weight-input').value;

            if (assignmentNameInput && assignmentGradeInput && assignmentWeightInput) {
                const assignmentId = "assignment" + (++assignmentCounter);
                const newAssignmentDiv = document.createElement('div');
                newAssignmentDiv.className = 'assignment';
                newAssignmentDiv.id = assignmentId;

                const nameWrapper = createWrapperDiv();
                const gradeWrapper = createWrapperDiv();
                const weightedGradeWrapper = createWrapperDiv();
                const completionWrapper = createWrapperDiv();
                const operationsWrapper = createWrapperDiv();

                const assignmentNameElement = document.createElement('h4');
                assignmentNameElement.textContent = assignmentNameInput;
                nameWrapper.appendChild(assignmentNameElement);

                const assignmentGradeElement = document.createElement('p');
                assignmentGradeElement.textContent = `${assignmentGradeInput}%`;
                gradeWrapper.appendChild(assignmentGradeElement);

                const assignmentWeightedScore = assignmentGradeInput * (assignmentWeightInput / 100);
                const assignmentWeightedScoreElement = document.createElement('p');
                assignmentWeightedScoreElement.textContent = `${assignmentWeightedScore.toFixed(2)} / ${assignmentWeightInput}%`;
                weightedGradeWrapper.appendChild(assignmentWeightedScoreElement);

                const completionCheckbox = document.createElement('input');
                completionCheckbox.type = 'checkbox';
                completionCheckbox.id = assignmentId + '-completed';
                completionCheckbox.addEventListener('change', function() {
                    const isChecked = this.checked;
                    const assignment = course.assignments.find(a => a.id === assignmentId);
                    if (assignment) {
                        assignment.completed = isChecked;
                        calculateAndDisplayOverallGrade();
                        calculateAndDisplayCourseGrade(course);
                    }
                });
                completionWrapper.appendChild(completionCheckbox);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => deleteAssignment(assignmentId, courseId);
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

                course.assignments.push({
                    id: assignmentId,
                    name: assignmentNameInput,
                    grade: parseFloat(assignmentGradeInput),
                    weight: parseFloat(assignmentWeightInput),
                    completed: false
                });
                course.totalWeight += parseFloat(assignmentWeightInput);

                calculateAndDisplayOverallGrade();
                assignmentPopup.style.display = 'none';
            } else {
                alert("Please fill in all fields.");
            }
        };
    }

    function createWrapperDiv(flex = 1) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.flex = flex;
        wrapperDiv.style.textAlign = 'left';
        return wrapperDiv;
    }

    function populateCourseDropdown() {
        const dropdown = document.getElementById('course-dropdown');
        dropdown.innerHTML = '';

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
            assignmentDiv.remove();
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
        let totalCompletedCourses = 0;
    
        courses.forEach(course => {
            let totalCourseScore = 0;
            let totalCourseWeight = 0;
            let hasCompletedAssignment = false;
    
            course.assignments.forEach(assignment => {
                if (assignment.completed && assignment.grade !== null) {
                    totalCourseScore += parseFloat(assignment.grade) * (assignment.weight / 100);
                    totalCourseWeight += assignment.weight;
                    hasCompletedAssignment = true;
                }
            });
    
            if (hasCompletedAssignment) {
                const courseGrade = totalCourseWeight > 0 ? (totalCourseScore / totalCourseWeight) * 100 : 0;
                course.grade = courseGrade;
                totalOverallScore += courseGrade;
                totalCompletedCourses++;
            }
        });
    
        const overallGrade = totalCompletedCourses > 0 ? totalOverallScore / totalCompletedCourses : 0;
        document.getElementById('overall-grade').textContent = `Overall Grade: ${overallGrade.toFixed(2)}%`;
    
        courses.forEach(course => {
            const courseElement = document.getElementById(course.id);
            const courseGradeElement = courseElement.querySelector('.course-grade');
            if (courseGradeElement) {
                courseGradeElement.textContent = `Course Grade: ${course.grade.toFixed(2)}%`;
            }
        });
    }

    function deleteCourse(courseId) {
        const courseIndex = courses.findIndex(c => c.id === courseId);
        if (courseIndex === -1) return;
    
        courses.splice(courseIndex, 1);
    
        const courseDiv = document.getElementById(courseId);
        if (courseDiv) {
            courseDiv.remove();
        }
    
        populateCourseDropdown();
        calculateAndDisplayOverallGrade();
    }

    const addCourseButton = document.getElementById('add-course-btn');
    if (addCourseButton) {
        addCourseButton.addEventListener('click', addCourse);
    } else {
        console.error("Add course button not found.");
    }

    const coursesTitle = document.querySelector('.course-section h3');
    if (coursesTitle) {
        const courseSection = document.querySelector('.course-section');
        courseSection.insertBefore(coursesTitle, courseSection.firstChild);
    } else {
        console.error("Courses title element not found.");
    }

    // Close assignment popup when close button is clicked
    const closeAssignmentPopupBtn = document.querySelector('#assignment-popup .close-popup');
    if (closeAssignmentPopupBtn) {
        closeAssignmentPopupBtn.addEventListener('click', function() {
            document.getElementById('assignment-popup').style.display = 'none';
        });
    } else {
        console.error("Close assignment popup button not found.");
    }

    populateCourseDropdown();
});

function getCourseId() {
    const dropdown = document.getElementById('course-dropdown');
    return dropdown.value;
}
