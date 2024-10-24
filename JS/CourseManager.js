var texth4 = "16px"

class CourseManager {
    constructor() {
        this.courses = [];
        this.selectedCourse = null;
        this.idCounter = 0;
        this.highestGradeCourse = null;
        this.completedAssignmentCountOverall = 0;
        this.totalAssignmentCountOverall = 0;
        this.totalDecidedWeight = 0;
        this.totalWeight = 0; 
        this.totalUndecidedWeight = 0;
        this.editStatus = false;
        this.selectedAssignment = null;
        this.maxOverallGrade = 0;
        this.minOverallGrade = 0;
    }

    // ADDING COURSES AND ASSIGNMENTS -----------------------------------------------------------------------------------------
    addCourse(title) {
        const newCourse = new Course(this.idCounter, title, []);
        this.courses.push(newCourse);
        console.log(`Course ${title} added successfully`);
        this.idCounter += 1;

        // if there is no currently selected course, select the newly added course
        if (!this.selectedCourse) {
            this.selectedCourse = newCourse;
        }
        return newCourse;
    }

    removeCourse(id) {
        this.courses = this.courses.filter(course => course.id!== id);
    }

    addCourseFromPopup() {
        const courseNameInput = document.getElementById('course-name-input').value;
        if (!courseNameInput.trim()) {
            alert("Please enter a course name.");
            return;
        }
    
        const course = courseManager.addCourse(courseNameInput);
        
        // select the newly added course
        courseManager.selectCourse(course.id);

        // Ensure the newly added course is selected in all instances of the dropdown and refresh the display using the new course
        const courseDropdowns = document.querySelectorAll('#course-dropdown');
        courseDropdowns.forEach(dropdown => {
            dropdown.value = courseManager.selectedCourse;
        });

        courseManager.displayAssignments(courseManager.selectedCourse.id);
        courseManager.closeAddCoursePopup();
    }

    addAssignmentToCourse(courseId, assignmentDetails) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        console.log("Sending assignment details to course...");

        // if the assignment would cause the weight to exceed 100%, alert the user and return
        // if (course.totalWeight + assignmentDetails.weight > 100) {
        //     alert("The weight of the assignment would exceed 100%.");
        //     return;
        // }

        course.addAssignment(assignmentDetails);
    }

    removeAssignmentFromCourse(courseId, assignmentId) {
        // console log the parameters and function name:
        console.log(`Coursemanager - removeAssignmentFromCourse(courseId: ${courseId}, assignmentId: ${assignmentId})`);
        const course = this.courses.find(c => c.id === courseId);
        console.log("Found course to Delete Assignment from:");
        console.log(course);
        if (!course) {
            throw new Error("Course not found");
        }
        course.removeAssignment(assignmentId);
    }

    editAssignmentFromCourse (courseId, assignmentId) {{
        console.log(`Coursemanager - editAssignmentFromCourse(courseId: ${courseId}, assignmentId: ${assignmentId})`);
        const course = this.courses.find(c => c.id === courseId);
        console.log(course);
        if (!course) {
            throw new Error("Course not found");
        }
        console.log("Found course to Edit Assignment from:");
        console.log(course);
        // find the assignment to edit
        const assignmentDetails = courseManager.getAssignmentById(parseInt(courseId), parseInt(assignmentId));
        console.log(assignmentDetails);

        // set the popup menu to display the assignment details of the assignment being edited
        document.getElementById('assignment-edit-grade-input').value = assignmentDetails.grade;
        document.getElementById('assignment-edit-name-input').value = assignmentDetails.name;
        document.getElementById('assignment-edit-weight-input').value = assignmentDetails.weight;
        console.log("Assignment details set in popup menu");
        this.editStatus = true;
        console.log("Edit status set to true");
        console.log(assignmentId);
        this.selectedAssignment = assignmentId;
        //open the popup menu
        this.openEditAssignmentPopup();
    }}

    editAssignmentFromPopup() {
        const assignmentId = this.selectedAssignment;
        console.log(assignmentId);

        const assignmentName = document.getElementById('assignment-edit-name-input').value;
        const assignmentGrade = parseFloat(document.getElementById('assignment-edit-grade-input').value);
        const assignmentWeight = parseFloat(document.getElementById('assignment-edit-weight-input').value);
        console.log("POPUP CALLED");

        if (!assignmentName || isNaN(assignmentGrade) || isNaN(assignmentWeight)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        console.log("TESING COURSE ID -----------------------------");
        console.log(this.selectedCourse);

        //console log the type of the id
        console.log(typeof this.selectedCourse.id);

        if (!this.selectedCourse == null) {
            alert("Please select a course.");
            return;
        }
        // console log selected course and assignment id
        console.log(this.selectedCourse);
        console.log(assignmentId);

        const assignment = courseManager.getAssignmentById(this.selectedCourse.id, assignmentId);

        console.log("Assignment to edit:");
        console.log(assignment);

        // // if the assignment would cause the weight to exceed 100%, alert the user and return
        // if ((this.selectedCourse.totalWeight - assignment.weight) + assignmentWeight > 100) {
        //     alert("The weight of the assignment would exceed 100%.");
        //     return;
        // }

        assignment.name = assignmentName;
        assignment.grade = assignmentGrade;
        assignment.weight = assignmentWeight;
        console.log("Assignment edited:");
        console.log(assignment);
        this.closeEditAssignmentPopup();
        this.displayAssignments(this.selectedCourse.id);
    }


    // Helpper function to get the assignment by ID
    getAssignmentById(courseId, assignmentId) {
        //console log parameters
        console.log(`Coursemanager - getAssignmentById(courseId: ${courseId}, assignmentId: ${assignmentId})`);
        const course = this.courses.find(c => c.id === courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        return course.assignments.find(assignment => assignment.id === parseInt(assignmentId));
    }

    addAssignmentFromPopup() {
        const assignmentName = document.getElementById('assignment-name-input').value;
        const assignmentGrade = parseFloat(document.getElementById('assignment-grade-input').value);
        const assignmentWeight = parseFloat(document.getElementById('assignment-weight-input').value);
        console.log("POPUP CALLED");

        if (!assignmentName || isNaN(assignmentGrade) || isNaN(assignmentWeight)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        console.log("TESING COURSE ID -----------------------------");
        console.log(this.selectedCourse);

        //console log the type of the id
        console.log(typeof this.selectedCourse.id);

        if (!this.selectedCourse == null) {
            alert("Please select a course.");
            return;
        }

        const assignment = courseManager.addAssignmentToCourse(this.selectedCourse.id, {name: assignmentName, grade: assignmentGrade, weight: assignmentWeight});
        this.displayAssignments(this.selectedCourse.id);
        this.closeAddAssignmentPopup();
    }

    // CALCULATIONS / GETTERS ------------------------------------------------------------------------------------------------
    calculateOverallGrade() {
        console.log("Calculating overall grade...");
        let totalGrade = 0;
        let totalWeight = this.courses.length;
        let maxOverallGrade = 0;
        let minOverallGrade = 0;

        this.courses.forEach(course => {
            console.log("Recalculating course grade for course: " + course.title);
            console.log(course);
            course.recalculateCourseGrade();

            if (course.overallGrade !== null) {
                course.getCompletedAssignmentsCount();

                // Console log the name of the course and the number of completed assignments
                console.log(`Course: ${course.title} completed assignments: ${course.completedAssignments}`);

                totalGrade += course.overallGrade;
                // Log the values
                console.log(`Course: ${course.title} grade: ${course.overallGrade}%`);

                if (!this.highestGradeCourse || course.overallGrade > this.highestGradeCourse.overallGrade) {
                    this.highestGradeCourse = course;
                    console.log(`Highest grade course updated:`);
                    console.log(this.highestGradeCourse);
                }

                // Accumulate max and min grades
                maxOverallGrade += parseInt(course.maxGrade);
                minOverallGrade += parseInt(course.minGrade);
                
                // console log
                console.log(`int Max Overall Grade: ${maxOverallGrade}`);
                console.log(`int Min Overall Grade: ${minOverallGrade}`);
            }
        });

        // Calculate the total number of completed assignments and total number of assignments across all courses
        this.completedAssignmentCountOverall = 0;
        this.totalAssignmentCountOverall = 0;
        this.courses.forEach(course => {
            this.completedAssignmentCountOverall += course.completedAssignments;
            this.totalAssignmentCountOverall += course.assignments.length;
        });

        // Calculate decided and undecided weight
        this.calculateOverallWeights();

        // Update all progress bars
        this.updateOverallProgress();
        this.courses.forEach(course => {
            this.updateCourseProgress(course);
        });

        // Ensure max and min grades are within valid bounds
        maxOverallGrade = Math.min(maxOverallGrade / this.courses.length, 100);
        minOverallGrade = Math.max(minOverallGrade / this.courses.length, 0);

        // Console log the results
        console.log("Completed Assignments Overall:", parseInt(this.completedAssignmentCountOverall));
        console.log("Total Assignments Overall:", parseInt(this.totalAssignmentCountOverall));
        console.log(`Highest Course: ${this.highestGradeCourse ? this.highestGradeCourse.title : 'N/A'}, ${this.highestGradeCourse ? this.highestGradeCourse.overallGrade : 'N/A'}`);
        console.log(`Maximum Overall Grade: ${maxOverallGrade}`);
        console.log(`Minimum Overall Grade: ${minOverallGrade}`);

        this.maxOverallGrade = parseFloat(maxOverallGrade.toFixed(2));
        this.minOverallGrade = parseFloat(minOverallGrade.toFixed(2));

        return totalWeight > 0 ? totalGrade / totalWeight : 0;
    }

    generateUniqueId() {
        return Math.random().toString(36).substring(7);
    }

    getCourseById(id) {
        return this.courses.find(course => course.id === id);
    }

    selectCourse(id) {
        console.log(`Selecting course with ID: ${id}`);
        this.selectedCourse = this.courses.find(course => course.id === id);
        this.display();
        console.log(`Selected course: ${this.selectedCourse}`);
    }

    selectFirstCourse() {
        if (this.courses.length > 0) {
            this.selectedCourse = this.courses.find(course => course !== null);
            if (this.selectedCourse) {
                this.displayAssignments(this.selectedCourse.id);
                return this.selectedCourse.id;
            }
        }
        return null;
    }

    updateOverallProgress() {
        const progressBarFill = document.getElementById('progress-bar-fill');
        if (progressBarFill) {
            const completedAssignments = this.completedAssignmentCountOverall;
            const totalAssignments = this.totalAssignmentCountOverall;
            const percentage = totalAssignments > 0 ? ((completedAssignments / totalAssignments) * 100).toFixed(2) : 0;
            console.log(`Updating progress bar: ${completedAssignments} / ${totalAssignments} = ${percentage}%`);
            progressBarFill.style.setProperty('width', `${percentage}%`);

            progressBarFill.innerText = `${percentage}%`;

            if (percentage < 25) {
                progressBarFill.style.setProperty('background-color', 'red');
            } else if (percentage >= 25 && percentage <= 49) {
                progressBarFill.style.setProperty('background-color', 'orange');
            } else {
                progressBarFill.style.setProperty('background-color', 'green');
            }
        }
    }

    updateCourseProgress(course) {
        const progressBarFill = document.getElementById('progress-bar-fill'+course.id);
        if (progressBarFill) {

            const completedAssignments = course.completedAssignments;
            const totalAssignments = course.assignments.length;
            const percentage = totalAssignments > 0 ? ((completedAssignments / totalAssignments) * 100).toFixed(2) : 0;
            console.log(`Updating progress bar: ${completedAssignments} / ${totalAssignments} = ${percentage}%`);
            progressBarFill.style.setProperty('width', `${percentage}%`);

            progressBarFill.innerText = `${percentage}%`;

            // console log the text inside of the progressBarFill element
            console.log(progressBarFill.innerText);

            if (percentage < 25) {
                progressBarFill.style.setProperty('background-color', 'red');
            } else if (percentage >= 25 && percentage <= 49) {
                progressBarFill.style.setProperty('background-color', 'orange');
            } else {
                progressBarFill.style.setProperty('background-color', 'green');
            }
        }
    }

    updateCoursedecidedWeight(course) {
        const progressBarFill = document.getElementById('decided-weight-progress-bar-fill'+course.id);
        if (progressBarFill) {

            // determine percentage filled based on the decided weight of the course
            const percentage = ((course.decidedWeight / course.totalWeight) * 100).toFixed(2);
            progressBarFill.innerText = `${percentage}%`;

            // console log the text inside of the progressBarFill element
            console.log(progressBarFill.innerText);

            if (percentage < 25) {
                progressBarFill.style.setProperty('background-color', 'red');
            } else if (percentage >= 25 && percentage <= 49) {
                progressBarFill.style.setProperty('background-color', 'orange');
            } else {
                progressBarFill.style.setProperty('background-color', 'green');
            }
        }
    }

    calculateOverallWeights() {
        let totalDecidedWeight = 0;
        let totalUndecidedWeight = 0;
        this.courses.forEach(course => {
            course.courseWeightCalculations();
            totalDecidedWeight += course.decidedWeight;
            totalUndecidedWeight += course.undecidedWeight;
        });

        this.totalDecidedWeight = totalDecidedWeight;
        this.totalUndecidedWeight = totalUndecidedWeight;
        this.totalWeight = totalDecidedWeight + totalUndecidedWeight;

        return totalDecidedWeight > 0 ? totalUndecidedWeight / totalDecidedWeight : 0;
    }

    // DISPLAY COURSES AND ASSIGNMENTS ---------------------------------------------------------------------------------------
    // Displays the course which has been currently selected by the user, creates box for the assignments.
    display () {
        this.calculateOverallGrade();

        let coursesLoadedDiv = document.querySelector('.courses-loaded');
        coursesLoadedDiv.innerHTML = '';

        // create a container for all task menu elements
        let taskMenuContainer = document.createElement('div');
        taskMenuContainer.classList.add('task-menu-container');
        coursesLoadedDiv.appendChild(taskMenuContainer);

        // Add title
        let title = document.createElement('h2');
        title.innerText = 'Overall Course Stats';
        title.style.textAlign = 'center';
        title.style.marginTop = '10px';
        title.style.marginBottom = '75px';
        taskMenuContainer.appendChild(title);

        // menu info div container
        let menuInfoDiv = document.createElement('div');
        menuInfoDiv.classList.add('menu-info');
        menuInfoDiv.style.display = 'flex';
        taskMenuContainer.appendChild(menuInfoDiv);

        // menu info div internal container 1
        let menuInternalInfoDiv1 = document.createElement('div');
        menuInternalInfoDiv1.classList.add('menu-info-internal');
        menuInfoDiv.appendChild(menuInternalInfoDiv1);

        // // Add priority task label
        // let priorityTaskLabel = document.createElement('h3');
        // priorityTaskLabel.innerText = 'Grades:';
        // menuInternalInfoDiv1.appendChild(priorityTaskLabel);

        // Add highest priority task indicator
        let lowestTimeRemaining = document.createElement('h4');
        lowestTimeRemaining.innerText = 'Overall Grade: 0.00%';
        lowestTimeRemaining.id = 'overall-grade';
        lowestTimeRemaining.style.fontWeight = 'normal';
        lowestTimeRemaining.style.color = 'white';
        lowestTimeRemaining.style.fontSize = '18px';
        lowestTimeRemaining.style.textAlign = 'center'; // Center align the text
        menuInternalInfoDiv1.appendChild(lowestTimeRemaining);
        console.log(this.highestGradeCourse);

        // create a container for min and max grade
        let gradeContainer = document.createElement('div');
        gradeContainer.classList.add('grade-container');
        gradeContainer.style.display = 'flex'; // Add this line to set display to flex
        gradeContainer.style.justifyContent = 'space-evenly'; // Add this line to justify content in a row
        menuInternalInfoDiv1.appendChild(gradeContainer);
        
        // add text for min grade
        let minGrade = document.createElement('h4');
        minGrade.innerText = `Min: ${isNaN(this.minOverallGrade) ? '0.00' : this.minOverallGrade}%`;
        minGrade.style.fontWeight = 'normal';
        minGrade.style.color = 'white';
        minGrade.style.fontSize = texth4;
        gradeContainer.appendChild(minGrade);

        // add text for max grade
        let maxGrade = document.createElement('h4');
        maxGrade.innerText = `Max: ${isNaN(this.maxOverallGrade) ? '0.00' : this.maxOverallGrade}%`;
        maxGrade.style.fontWeight = 'normal';
        maxGrade.style.color = 'white';
        maxGrade.style.fontSize = texth4;
        gradeContainer.appendChild(maxGrade);

        // // Add time of that task
        // let timeOfTask = document.createElement('h4');
        // timeOfTask.innerText = this.highestGradeCourse ? `Highest Course: \n${this.highestGradeCourse.title} - ${this.highestGradeCourse.overallGrade.toFixed(2)}%` : 'Highest Course: N/A - 0%';
        // timeOfTask.id = 'highest-grade';
        // timeOfTask.style.fontWeight = 'normal';
        // timeOfTask.style.color = 'white';
        // timeOfTask.style.fontSize = '18px'; // Set font size to 21
        // menuInternalInfoDiv1.appendChild(timeOfTask); faggot

        // append new div to menuinternalinfo2 to hold decided and undecided weight
        let decidedUndecidedWeightDiv = document.createElement('div');
        decidedUndecidedWeightDiv.classList.add('menu-info-internal');
        menuInfoDiv.appendChild(decidedUndecidedWeightDiv);

        // // Grade Weighting
        // let weightLabel = document.createElement('h3');
        // weightLabel.innerText = 'Grade Weighting:';
        // decidedUndecidedWeightDiv.appendChild(weightLabel);

        // Display decided weight
        let decidedWeight = document.createElement('h4');
        let weightnumber = (this.totalDecidedWeight / this.totalWeight * 100).toFixed(2)
        decidedWeight.innerText = `Decided Weight: ${isNaN(weightnumber) ? '0%' : weightnumber + '%'} / 100%`;
        decidedWeight.style.fontWeight = 'normal';
        decidedWeight.style.color = 'white';
        decidedWeight.style.fontSize = '18px';
        decidedWeight.style.textAlign = 'center'; // Center align the text
        decidedUndecidedWeightDiv.appendChild(decidedWeight);

        // create a progress bar for decided weight and display fill based on decided weight
        let decidedWeightProgressBar = document.createElement('div');
        decidedWeightProgressBar.id = 'progress-bar';
        decidedUndecidedWeightDiv.appendChild(decidedWeightProgressBar);

        // create h4 element to display decided weight percentage
        let decidedWeightProgressBarFill = document.createElement('div');
        decidedWeightProgressBarFill.id = 'decided-weight-progress-bar-fill';
        decidedWeightProgressBarFill.classList.add('progress-bar-fill-style');
        decidedWeightProgressBar.appendChild(decidedWeightProgressBarFill);

        // Calculate the width of the progress bar fill based on the decided weight ratio
        let decidedWeightRatio = this.totalDecidedWeight / this.totalWeight;
        let progressBarFillWidth = decidedWeightRatio * 100;
        decidedWeightProgressBarFill.style.width = `${progressBarFillWidth}%`;

        // Add percentage text
        let progressBarFillText = document.createElement('span');
        progressBarFillText.innerText = `${progressBarFillWidth.toFixed(2)}%`;
        progressBarFillText.classList.add('progress-bar-fill-text');
        decidedWeightProgressBarFill.appendChild(progressBarFillText);

        // Check if progressBarFillWidth is NaN and display  if true
        if (isNaN(progressBarFillWidth)) {
            progressBarFillText.innerText = '0%';
        }

        // menu info div internal container 2
        let menuInternalInfoDiv2 = document.createElement('div');
        menuInternalInfoDiv2.classList.add('menu-info-internal');
        menuInfoDiv.appendChild(menuInternalInfoDiv2);

        // // Add completion stats label
        // let completionStatsLabel = document.createElement('h3');
        // completionStatsLabel.innerText = 'Completion:';
        // menuInternalInfoDiv2.appendChild(completionStatsLabel);

        // Add completed task count
        let completedTaskCount = document.createElement('h4');
        completedTaskCount.id = 'complete-Assignments-count';
        console.log(this.completedAssignmentCountOverall);
        completedTaskCount.innerText = `Assignments Completed: ${this.completedAssignmentCountOverall} / ${this.totalAssignmentCountOverall}`;
        completedTaskCount.style.color = 'white';
        completedTaskCount.style.fontWeight = 'normal';
        completedTaskCount.style.fontSize = '18px'; // Set font size to 21
        completedTaskCount.style.textAlign = 'center'; // Center align the text
        menuInternalInfoDiv2.appendChild(completedTaskCount);

        // Create progress bar
        let progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        menuInternalInfoDiv2.appendChild(progressBar);

        // Create progress bar fill
        let progressBarFill = document.createElement('div');
        progressBarFill.id = 'progress-bar-fill';
        progressBarFill.classList.add('progress-bar-fill-style');
        progressBar.appendChild(progressBarFill);

        this.updateOverallProgress();

        // create meta task div to hold task operations and task title
        let metaTaskDiv = document.createElement('div');
        metaTaskDiv.classList.add('meta-task');
        taskMenuContainer.appendChild(metaTaskDiv);

        // container for operations title and the task-menu buttons, operations should be above the buttons
        let operationsContainer = document.createElement('div');
        operationsContainer.classList.add('operations-container');
        taskMenuContainer.appendChild(operationsContainer);

        // // Add operations title
        // let operationsTitle = document.createElement('h3');
        // operationsTitle.innerText = '- Operations -';
        // operationsTitle.style.fontSize = '27px'; // Set font size to 20
        // operationsContainer.appendChild(operationsTitle);

        // Container for meta task operations while holds another container of class "nav-menu-buttons" for add course and select course
        let metaTaskContainer = document.createElement('div');
        metaTaskContainer.classList.add('course-menu-buttons');
        operationsContainer.appendChild(metaTaskContainer);

        // nav-menu-buttons container for add task, filter, and sort buttons
        let navMenuButtons = document.createElement('div');
        navMenuButtons.classList.add('nav-menu-buttons');
        metaTaskContainer.appendChild(navMenuButtons);

        // Select course dropdown
        let selectCourseDropdown = document.createElement('select');
        selectCourseDropdown.id = 'select-course-dropdown';
        selectCourseDropdown.classList.add('course-dropdown');
        navMenuButtons.appendChild(selectCourseDropdown);

        // Add default option
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.innerText = 'Select Course';
        selectCourseDropdown.appendChild(defaultOption);

        // Add options for each course
        for (let i = 0; i < this.courses.length; i++) {
            let courseOption = document.createElement('option');
            console.log(this.courses[i].id);
            console.log(this.courses[i].title);

            courseOption.value = this.courses[i].id;
            courseOption.innerText = this.courses[i].title;
            selectCourseDropdown.appendChild(courseOption);
        }

        // Add event listener to select course dropdown
        selectCourseDropdown.addEventListener('change', () => {
            console.log(`Course selected: ${selectCourseDropdown.value}`);
            this.selectCourse(parseInt(selectCourseDropdown.value));
            this.displayAssignments(parseInt(selectCourseDropdown.value));
        });

        // Set selected value to the currently selected course
        selectCourseDropdown.value = this.selectedCourse ? this.selectedCourse.id : '';
        
        // Add course button
        let addTaskButton = document.createElement('button');
        addTaskButton.innerText = 'Add Course';
        addTaskButton.classList.add('CourseAdd-btn');
        addTaskButton.style.marginLeft = '25px';
        navMenuButtons.appendChild(addTaskButton);
        addTaskButton.onclick = () => this.openAddCoursePopup();
        
        // nav-menu-buttons container for add task, filter, and sort buttons
        let navMenuButtons2 = document.createElement('div');
        navMenuButtons2.classList.add('nav-menu-buttons');
        metaTaskContainer.appendChild(navMenuButtons2);

        // Add assignment button
        let addAssignmentButton = document.createElement('button');
        addAssignmentButton.innerText = 'Add Assignment';
        addAssignmentButton.classList.add('AssignmentAdd-btn');
        addAssignmentButton.style.marginRight = '25px';
        addAssignmentButton.onclick = () => this.openAddAssignmentPopup(this.selectedCourse.id);
        navMenuButtons2.appendChild(addAssignmentButton);

        // Delete course button
        let deleteCourseButton = document.createElement('button');
        deleteCourseButton.innerText = 'Delete Course';
        deleteCourseButton.classList.add('CourseDelete-btn');
        navMenuButtons2.appendChild(deleteCourseButton);
        deleteCourseButton.onclick = () => {
            this.removeCourse(this.selectedCourse.id);
            this.selectedCourse = null;
            // select the first course in the list if there is one
            this.display();

            if (this.courses.length > 0) {
                this.selectCourse(this.courses[0].id);
                this.displayAssignments(this.selectedCourse.id);
            }
        };

        // create taskContainerTop for the to do label
        let taskContainerTop = document.createElement('div');
        taskContainerTop.classList.add('task-container-top');
        taskMenuContainer.appendChild(taskContainerTop);

        // Create a container for all course info
        let taskContainer = document.createElement('div');
        taskContainer.innerText = 'Empty \n\n Select or Add a Course';
        taskContainer.classList.add('task-container');
        taskContainer.style.textAlign = 'center'; // Add text alignment style
        taskContainerTop.appendChild(taskContainer);

        coursesLoadedDiv.style.height = '';
    }

    // Displays the assignments within the course given as a parameter
    displayAssignments(courseId) {
        
        const container = document.getElementById('course-assignments-container');
        if (container) {
            const currentHeight = container.offsetHeight;
            if (currentHeight !== null) {
                container.style.minHeight = `${currentHeight}px`;
                container.style.minHeight = `${currentHeight}px`;
            }
        }
        console.log(`Starting displayAssignments for course ID: ${courseId}`);
    
        // Find the course object by ID
        const course = courseManager.getCourseById(courseId);
        if (!course) {
            console.error("Course not found");
            return;
        }
    
        console.log(`Course found, proceeding to construct selector`);

        const gradesSection = document.querySelector('.task-container');
    
        // Clear existing assignments
        gradesSection.innerHTML = '';
    
        // Create the course name element
        const courseNameElement = document.createElement('h3');
        courseNameElement.textContent = course.title;
        courseNameElement.style.fontSize = '27px';
        courseNameElement.style.marginBottom = '35px';
        courseNameElement.style.textAlign = 'center'; // Add text alignment
        gradesSection.appendChild(courseNameElement);
    
        // menu info div container-=-------------------------------------------------------------------------------------------------------------
        let menuInfoDiv = document.createElement('div');
        menuInfoDiv.classList.add('course-menu-info');
        menuInfoDiv.style.display = 'flex'; // Format children as a row
        gradesSection.appendChild(menuInfoDiv);
    
        // menu info div internal container 1
        let menuInternalInfoDiv1 = document.createElement('div');
        menuInternalInfoDiv1.classList.add('menu-info-internal');
        menuInfoDiv.appendChild(menuInternalInfoDiv1);
    
        // // Add priority task label
        // let CourseInfoBox = document.createElement('h3');
        // CourseInfoBox.innerText = 'Grades:';
        // menuInternalInfoDiv1.appendChild(CourseInfoBox);
    
        // Course grade element
        let courseGradeElement = document.createElement('h4');
        courseGradeElement.id = 'course-grade' + course.id;
        courseGradeElement.textContent = "0.00%";
        courseGradeElement.style.fontWeight = 'normal';
        courseGradeElement.style.color = 'black'; // Change text color to light blue
        courseGradeElement.style.fontSize = '18px'; // Set font size to 20
        courseGradeElement.style.textAlign = 'center'; // Center align the text
        menuInternalInfoDiv1.appendChild(courseGradeElement);

    
        // Add time of that task
        // let CourseInfoTwo = document.createElement('h3');
        // CourseInfoTwo.innerText = 'Course Info #2 ';
        // CourseInfoTwo.id = 'Course Info #2'; // Add an id to the element
        // console.log(this.highestGradeCourse);
        // CourseInfoTwo.innerText = course.highestGradeAssignment? `Best Assignment - \n${course.highestGradeAssignment.name} - ${course.highestGradeAssignment.grade}%` : 'Best Assignment - \nN/A';
        // CourseInfoTwo.style.fontWeight = 'normal';
        // CourseInfoTwo.style.color = 'white';
        // CourseInfoTwo.style.fontSize = '18px'; // Set font size to 21
        // menuInternalInfoDiv1.appendChild(CourseInfoTwo);

        this.updateCoursedecidedWeight(course);

        // create a container for min and max grade
        let gradeContainer = document.createElement('div');
        gradeContainer.classList.add('grade-container');
        gradeContainer.style.display = 'flex'; // Add this line to set display to flex
        gradeContainer.style.justifyContent = 'space-evenly'; // Add this line to justify content in a row
        menuInternalInfoDiv1.appendChild(gradeContainer);
        
        // console log the max and min for the course: "Course: Max: Min:"
        console.log(`Course: ${course.title} Max: ${course.maxGrade} Min: ${course.minGrade} displaying ... stupid fucking code`);

        // add text for min grade
        let minGrade = document.createElement('h4');
        minGrade.innerText = `Min: ${isNaN(course.minGrade) ? '0' : course.minGrade}%`;
        minGrade.style.fontWeight = 'normal';
        minGrade.style.color = 'white';
        minGrade.style.fontSize = '18px';
        gradeContainer.appendChild(minGrade);

        // add text for max grade
        let maxGrade = document.createElement('h4');
        maxGrade.innerText = `Max: ${isNaN(course.maxGrade) ? '0' : course.maxGrade}%`;
        maxGrade.style.fontWeight = 'normal';
        maxGrade.style.color = 'white';
        maxGrade.style.fontSize = '18px';
        gradeContainer.appendChild(maxGrade);

        // append new div to menuinternalinfo2 to hold decided and undecided weight
        let decidedUndecidedWeightDiv = document.createElement('div');
        decidedUndecidedWeightDiv.classList.add('menu-info-internal');
        menuInfoDiv.appendChild(decidedUndecidedWeightDiv);

        // // Grade Weighting
        // let weightLabel = document.createElement('h3');
        // weightLabel.innerText = 'Grade Weighting:';
        // decidedUndecidedWeightDiv.appendChild(weightLabel);

        // Display decided weight
        let decidedWeight = document.createElement('h3');
        decidedWeight.innerText = `Decided Weight: ${isNaN(course.decidedWeight) ? '0%' : `${(course.decidedWeight).toFixed(2)}%`} / ${isNaN(course.decidedWeight + course.undecidedWeight) ? '0%' : `${(course.decidedWeight + course.undecidedWeight).toFixed(2)}%`}`;
        decidedWeight.style.fontWeight = 'normal';
        decidedWeight.style.color = 'white';
        decidedWeight.style.fontSize = '18px';
        decidedWeight.style.textAlign = 'center'; // Center align the text
        decidedUndecidedWeightDiv.appendChild(decidedWeight);

        // create a progress bar for decided weight and display fill based on decided weight
        let decidedWeightProgressBar = document.createElement('div');
        decidedWeightProgressBar.id = 'progress-bar';
        decidedUndecidedWeightDiv.appendChild(decidedWeightProgressBar);

        // create h4 element to display decided weight percentage
        let decidedWeightProgressBarFill = document.createElement('div');
        decidedWeightProgressBarFill.id = 'decided-weight-progress-bar-fill'+course.id;
        decidedWeightProgressBarFill.classList.add('progress-bar-fill-style');
        decidedWeightProgressBar.appendChild(decidedWeightProgressBarFill);

        // Calculate the width of the progress bar fill based on the decided weight ratio
        let decidedWeightRatio = course.decidedWeight / (course.decidedWeight + course.undecidedWeight);
        let progressBarFillWidth = decidedWeightRatio * 100;
        decidedWeightProgressBarFill.style.width = `${progressBarFillWidth}%`;

        // Add percentage text
        let progressBarFillText = document.createElement('span');
        progressBarFillText.innerText = `${progressBarFillWidth.toFixed(2)}%`;
        progressBarFillText.classList.add('progress-bar-fill-text');
        decidedWeightProgressBarFill.appendChild(progressBarFillText);

        // Check if progressBarFillWidth is NaN and display  if true
        if (isNaN(progressBarFillWidth)) {
            progressBarFillText.innerText = '0%';
        }

        // menu info div internal container 2
        let menuInternalInfoDiv2 = document.createElement('div');
        menuInternalInfoDiv2.classList.add('menu-info-internal');
        menuInfoDiv.appendChild(menuInternalInfoDiv2);

        // // Add completion stats label
        // let CourseInfoBoxTwo = document.createElement('h3');
        // CourseInfoBoxTwo.innerText = 'Completion:';
        // menuInternalInfoDiv2.appendChild(CourseInfoBoxTwo);

        // Add completed task count
        let CourseInfoThree = document.createElement('h3');
        CourseInfoThree.innerText = `Assignments Completed: ${course.completedAssignments} / ${course.assignments.length}`;
        CourseInfoThree.style.color = 'white';
        CourseInfoThree.style.fontSize = '18px'; // Set font size to 21
        CourseInfoThree.style.fontWeight = 'normal';
        CourseInfoThree.style.textAlign = 'center'; // Center align the text
        menuInternalInfoDiv2.appendChild(CourseInfoThree);

        // Create progress bar
        let progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        menuInternalInfoDiv2.appendChild(progressBar);

        // Create progress bar fill
        let progressBarFill = document.createElement('div');
        progressBarFill.id = 'progress-bar-fill'+course.id;
        progressBarFill.classList.add('progress-bar-fill-style');
        progressBar.appendChild(progressBarFill);

        // Add progress text
        let progressText = document.createElement('div');
        progressText.textContent = `${isNaN(course.completedAssignments) ? '0' : (course.completedAssignments / course.assignments.length) * 100}%`;
        progressBarFill.appendChild(progressText);

        console.log("MEWOMP"+progressText.textContent);

        // create meta task div to hold task operations and task title
        let metaTaskDiv = document.createElement('div');
        metaTaskDiv.classList.add('meta-task');
        gradesSection.appendChild(metaTaskDiv);
    
        // Create the legend div
        const legendDiv = document.createElement('div');
        legendDiv.className = 'legend';
    
        ['Name', 'Grade', 'Weighted Grade', '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Done\xa0\xa0||\xa0\xa0\xa0Edit\xa0\xa0\xa0||\xa0Delete'].forEach(text => {
            const legendItem = document.createElement('div');
            const legendItemText = document.createElement('h3');
            legendItemText.style.fontSize = '19px';
            legendItemText.textContent = text;
            legendItemText.style.fontWeight = 'bold';
            legendItem.appendChild(legendItemText);
            legendDiv.appendChild(legendItem);
        });

        // create a container for all course assignments and legend
        let courseAssignmentsContainer = document.createElement('div');
        courseAssignmentsContainer.classList.add('course-assignments-container');
        gradesSection.appendChild(courseAssignmentsContainer);

        courseAssignmentsContainer.appendChild(legendDiv);
    
        console.log(`Existing assignments cleared, generating new assignment HTML`);

        console.log(`Course found, proceeding to construct selector`);
    
        // Generate HTML for each assignment
        course.assignments.forEach(assignment => {
            const assignmentElement = document.createElement('div');
            assignmentElement.className = 'assignment assignment-details-container';

            assignmentElement.dataset.assignmentId = assignment.id;

            // console log the assignemnt details
            console.log(assignment);
    
            // Create the h3 element for the assignment name
            const nameH4 = document.createElement('h4');
            nameH4.textContent = assignment.name;
            nameH4.style.fontSize = '17.5px';
            const nameElement = document.createElement('div');
            nameElement.appendChild(nameH4);
    
            // Create the h3 element for the assignment grade
            const gradeElement = document.createElement('h4');
            gradeElement.textContent = `${assignment.grade}%`;
            gradeElement.style.fontSize = '17px';
            const gradeElementWrapper = document.createElement('div');
            gradeElement.style.color = 'rgb(230, 230, 230)';
            gradeElementWrapper.appendChild(gradeElement);
            
            // Create the h3 element for the assignment weighted grade
            const weightedGradeElement = document.createElement('h4');
            const assignmentWeightedScore = (assignment.grade * (assignment.weight / 100)).toFixed(2);
            const weightedGradeString = (`${assignmentWeightedScore} / ${assignment.weight}%`);
            weightedGradeElement.textContent = weightedGradeString;
            weightedGradeElement.style.fontSize = '17px';
            const assignmentWeightedScoreWrapper = document.createElement('div');
            weightedGradeElement.style.color = 'rgb(230, 230, 230)';
            assignmentWeightedScoreWrapper.appendChild(weightedGradeElement);
    
            // Checkbox for marking assignment as complete or incomplete
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = assignment.completed;
            checkbox.addEventListener('change', () => {
                assignment.completed = checkbox.checked;
                updateOverallGradeDisplay();
            });
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '\u{1F5D1}';
            deleteButton.classList.add('secondary');
            deleteButton.classList.add('assignment-operators');
            deleteButton.classList.add("ass-delete-button");
            deleteButton.title = "Delete Assignment";
            
            console.log(assignment);
            console.log(deleteButton.dataset);
            deleteButton.addEventListener('click', () => {
                console.log(`TESTING START----------------------------------------------------------------------`);
                console.log(`Attempting to delete assignment: ${assignment.name} from ${this.selectedCourse.title}`);
                removeAssignmentFromCourse(courseId, assignmentElement.dataset.assignmentId);
                console.log('TESTING END-------------------------------------------------------------------------');
                // this.display();
                this.displayAssignments(this.selectedCourse.id)
            });
    
            const completionButton = document.createElement('button');
            completionButton.classList.add('secondary');
            completionButton.classList.add('assignment-operators');
            completionButton.textContent = '✔';
            completionButton.title = 'Toggle Assignment Completion';
    
            // Depending on the current state of the assignment, apply the complete and incomplete classes
            if (assignment.completed) {
                completionButton.classList.remove('incomplete');
                completionButton.classList.add('complete');
                completionButton.textContent = '✔';
            } else {
                completionButton.classList.add('incomplete');
                completionButton.classList.remove('complete');
                completionButton.textContent = '✘';
            }
    
            completionButton.addEventListener('click', () => {
                toggleComplete(assignment, completionButton);
                this.display();
                this.displayAssignments(this.selectedCourse.id);
            });
    
            const editButton = document.createElement('button');
            editButton.textContent = '\u{2710}';
            editButton.classList.add('secondary');
            editButton.classList.add('assignment-operators');
            editButton.classList.add("ass-edit-button");
            editButton.title = "Edit Assignment"; // Add title
            editButton.onclick = () => this.editAssignmentFromCourse(courseId, assignmentElement.dataset.assignmentId); // Assuming this function handles deletion

            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'checkbox-wrapper';
            const deleteButtonWrapper = document.createElement('div');
            deleteButtonWrapper.className = 'delete-button-wrapper';
            
            checkboxWrapper.appendChild(checkbox);
    
            // Append each detail directly to assignmentElement
            assignmentElement.appendChild(nameElement);
            assignmentElement.appendChild(gradeElementWrapper);
            assignmentElement.appendChild(assignmentWeightedScoreWrapper);
            // assignmentElement.appendChild(checkboxWrapper);
            assignmentElement.appendChild(deleteButtonWrapper);
            deleteButtonWrapper.appendChild(completionButton);
            deleteButtonWrapper.appendChild(editButton);
            deleteButtonWrapper.appendChild(deleteButton);
    
            // Append the assignment element to the grades section
            courseAssignmentsContainer.appendChild(assignmentElement);
        });
        updateOverallGradeDisplay();
        console.log(`New assignments generated and appended to grades section`);
        if (container) {
            container.style.minHeight = '';
        }
    }

    // POPUP MENUS  -----------------------------------------------------------------------------------------------------------
    openAddAssignmentPopup() {
        document.getElementById('assignment-popup').style.display = 'block';
        showOverlay();
    }

    closeAddAssignmentPopup() {
        document.getElementById('assignment-popup').style.display = 'none';
        hideOverlay();
    }

    openAddCoursePopup() {
        document.getElementById('popup-menu').style.display = 'block';
        showOverlay();
    }
    
    closeAddCoursePopup() {
        document.getElementById('popup-menu').style.display = 'none';
        hideOverlay();
    }

    openEditAssignmentPopup() {
        document.getElementById('assignment-edit-popup').style.display = 'block';
        showOverlay();
    }

    closeEditAssignmentPopup() {
        document.getElementById('assignment-edit-popup').style.display = 'none';
        hideOverlay();
    }
}
