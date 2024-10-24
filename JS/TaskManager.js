//  Taskmanager holds all the tasks and provides methods to add, delete, edit and get tasks.
class TaskManager {
    constructor() {
        this.tasks = [];
        this.editing = false;
        this.editTask = null;
        this.completedTaskCount = 0;
        this.incompleteTaskCount = 0;
        this.soonestTask = null;
        this.filter = null;
        this.sort = null;
        this.filterArray = [];
        this.sortArray = [];
        this.tasksDueThisWeek = null;
        this.tasksDueThisMonth = null;
    }

    // TASK OPERATIONS ------------------------------------------------------------------------------------
    AddTask (taskname, taskGrade, taskWeight, taskCourse, taskDueDate) {
        // if the task already exists, throw an error
        if (this.tasks.find(task => task.taskName === taskname)) {
            alert("Cannot have two of the same name tasks. Please choose a different name.");
        }

        const newTask = new Task(taskname, taskGrade, taskWeight, taskCourse, taskDueDate);
        this.tasks.push(newTask);
        console.log(`Task ${newTask.taskName} added successfully`);
        this.incompleteTaskCount++;
        return newTask;
    }

    DeleteTask(taskname) {
        const task = this.tasks.find(t => t.taskName === taskname);
        if (!task) {
            throw new Error("Task not found");
        }
        //if the task is the soonest task, set it to null
        if (this.soonestTask === task) {
            this.soonestTask = null;
        }

        this.tasks = this.tasks.filter(task => task.taskName!== taskname);
        console.log(`Task ${taskname} deleted successfully`);
        this.incompleteTaskCount--; 
        this.updateTimeRemaining();
    }

    EditTask(taskname) {
        const task = this.tasks.find(t => t.taskName === taskname);
        if (!task) {
            throw new Error("Task not found");
        }
        this.editing = true;
        this.editTask = task;
        this.displayTaskPopup(task);
    }  
    
    // Function to set the filter for the tasks according to the user choice of course, completion, or none.
    createFilter(array, filterChoice) {
        if (filterChoice === true || filterChoice === false) {
            // Filter by completion
            document.getElementById('TaskFilter-btn').classList.add('complete');
            return array.filter(task => task.taskCompleted === filterChoice);
        } 
        else if (filterChoice === '') {
            // Filter by none, returns array of tasks with no filter
            document.getElementById('TaskFilter-btn').classList.remove('complete');
            return array.tasks;
        } 
        else {
            // Filter by course
            document.getElementById('TaskFilter-btn').classList.add('complete');
            return array.filter(task => task.taskCourse === filterChoice);
        }
    }

    // Function to set the sort for the tasks according to the user choice of time or none.
    createSort(array, sortChoice) {
        if (sortChoice === 'time') {
            // return a copy of this.tasks that is sorted by time remaining
            document.getElementById('TaskSort-btn').classList.add('complete');
            return array.sort((a, b) => a.taskDueDate - b.taskDueDate);
        }
        if (sortChoice === 'none') {
            // No sort
            document.getElementById('TaskSort-btn').classList.remove('complete');

            return array.tasks;
        }
    }

    addTaskFromPopup() {
        const taskName = document.getElementById('task-name-input').value;
        // const taskGrade = parseFloat(document.getElementById('task-grade-input').value);
        // const taskWeight = parseInt(document.getElementById('task-weight-input').value);
        const taskGrade= 0;
        const taskWeight= 0;
        const taskCourse = document.getElementById('task-course-input').value;
        const taskDate = new Date(document.getElementById('task-date-input').value);
    
        // if (!taskName || isNaN(taskGrade) || isNaN(taskWeight) || isNaN(taskCourse) || isNaN(taskDate)) {
        //     alert("Please fill in all task fields correctly.");
        //     return;
        // }

        // log if it is editing or adding a task
        console.log(this.editing ? "Editing task..." : "Adding task...");
        console.log(`Task Course: ${taskCourse}`);

        if (this.editing == true) {
            if (this.editTask == null) {
                throw new Error("Task not found");
            } else {
                // edit the task
                this.editTask.editTask(taskName, taskGrade, taskWeight, taskCourse, taskDate);
                console.log(`Task ${this.editTask.taskName} edited successfully`);
                
                // get the corresponding task div and set the attributes
                document.getElementById(`task-id-${this.editTask.taskName}`);
                this.editTask = null;
            }
        } else {
            taskManager.AddTask(taskName, taskGrade, taskWeight, taskCourse, taskDate);
        }

        this.editing = false;

        taskManager.display();
        taskManager.hideTaskPopup();
        this.updateTimeRemaining();
    }

    // get time remaining for a task
    getTimeRemaining(task) {
        const dueDate = new Date(task.taskDueDate);
        const currentDate = new Date();
        const timeRemaining = dueDate - currentDate;

        // format time remaining as days : hours : minutes
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        // Decide what to return based on time remaining
        if (timeRemaining < 0) {
            return "Overdue";
        } else if (days > 0) {
            return days + "d " + hours + "h " + minutes + "m";
        } else if (hours > 0) {
            return hours + "h " + minutes + "m";
        } else {
            return minutes + "m";
        }
    }

    getTimeRemainingInt(task) {
        const dueDate = new Date(task.taskDueDate);
        const currentDate = new Date();
        const timeRemaining = dueDate - currentDate;

        return timeRemaining;
    }

    // function goes through all tasks and finds the one with the soonest due date
    soonestTaskCheck () {
        let lowestTimeRemaining = 9007199254740991;
        this.tasks.forEach(task => {
            if (task) {
                if (!task.taskDueDate) {
                    return;
                }
                if (this.getTimeRemaining(task) === "Overdue") {
                    return;
                }
                const timeRemaining = this.getTimeRemaining(task);
                if (timeRemaining < lowestTimeRemaining) {
                    this.soonestTask = task;
                }
            }
        });
    }

    // iterate through tasks and update count for complete and incomplete
    updateTaskCount() {
        this.completedTaskCount = 0;
        this.incompleteTaskCount = 0;

        console.log("tasks length: " + this.tasks.length);
        console.log(this.tasks);

        if (this.tasks) {
            return;
        }

        this.tasks.forEach(task => {
            if (task.taskCompleted) {
                this.completedTaskCount++;
            } else {
                this.incompleteTaskCount++;
            }
        });
    }

    // function called to update the time remaining for all tasks every minute
    updateTimeRemaining() {
        console.log("Updating time remaining...1");
        this.tasks.forEach(task => {
            if (task) {
                if (!task.taskDueDate) {
                    return;
                }
                if (this.getTimeRemaining(task) === "Overdue") {
                    return;
                }

                if (this.soonestTask == null) {
                    this.soonestTask = task;
                }
                
                var lowestTimeRemaining = this.getTimeRemainingInt(this.soonestTask);

                const timeRemaining = this.getTimeRemaining(task);

                // get the task due date element and update the text
                console.log(`Task ${task.taskName} time remaining: ${timeRemaining}`);
                document.getElementById('task-due-date' + task.taskName).innerText = `${timeRemaining}`;

                // keep track of what the shortest time remaining is and display it to the user
                console.log(`Task ${task.taskName} time remaining: ${this.getTimeRemainingInt(task)}`);
                console.log(`Lowest time remaining: ${lowestTimeRemaining}`);
                console.log(this.getTimeRemainingInt(task) < lowestTimeRemaining);
                if (this.getTimeRemainingInt(task) < this.getTimeRemainingInt(this.soonestTask)) {
                    this.soonestTask = task;
                }
                console.log(`Soonest task: ${this.soonestTask}`);
            }
        });
        console.log("Time remaining updated successfully");

        if (this.soonestTask) {
            document.getElementById('lowest-time-remaining').innerText = `${this.soonestTask.taskName}`;
            document.getElementById('time-of-task').innerText = `${this.getTimeRemaining(this.soonestTask)}`;
            console.log(`Soonest task: ${this.soonestTask.taskName}`);
        }     
    }

    startLoop() {
        console.log("Starting loop...");
        // call this function every minute
        setTimeout(() => {
            console.log("Updating time remaining...2");
            this.updateTimeRemaining();
            this.startLoop();
        }, 60000);
    }

    // TASK GETTERS ------------------------------------------------------------------------------------
    getTaskByName(taskname) {
        return this.tasks.find(task => task.taskName === taskname);
    }

    getTaskByCourse(course) {
        return this.tasks.filter(task => task.course.includes(course));
    }

    getTaskByDueDate(dueDate) {
        return this.tasks.filter(task => task.dueDate === dueDate);
    }

    getAllTasks() {
        return this.tasks;
    }

    // DISPLAY FUNCTIONS ------------------------------------------------------------------------------------
    // Display the task addition popup to user when a new task is being added or when a task is being edited
    displayTaskPopup(task) {
        document.getElementById('task-popup').style.display = 'block';
        
        // If taskName is provided, then the user is editing a task
        if (task) {
            document.getElementById('task-name-input').value = task.taskName;
            // document.getElementById('task-grade-input').value = task.taskGrade;
            // document.getElementById('task-weight-input').value = task.taskWeight;
            if (task.taskCourse){
                document.getElementById('task-course-input').value = task.taskCourse;
            }
            if (task.taskDueDate){
                document.getElementById('task-date-input').value = task.taskDueDate;
            }
        } else {
            // Clear input fields
            document.getElementById('task-name-input').value = '';
            // document.getElementById('task-grade-input').value = '';
            // document.getElementById('task-weight-input').value = '';
            document.getElementById('task-course-input').value = '';
            document.getElementById('task-date-input').value = '';
        }
        showOverlay();
    }

    // Hide the task addition popup when the user is done adding or editing a task
    hideTaskPopup() {
        console.log("Hiding task popup...");
        document.getElementById('task-popup').style.display = 'none';
        console.log("Hiding overlay...");
        hideOverlay();
    }

    // Display all tasks in the task manager to user
    display() {
        this.updateTaskCount();
        console.log(this.tasks);
        // Clear existing content
        let coursesLoadedDiv = document.querySelector('.courses-loaded');
        coursesLoadedDiv.innerHTML = '';

        // create a container for all task menu elements
        let taskMenuContainer = document.createElement('div');
        taskMenuContainer.classList.add('task-menu-container');
        coursesLoadedDiv.appendChild(taskMenuContainer);

        // Add title
        let title = document.createElement('h2');
        title.innerText = 'Task Stats';
        title.style.marginTop = '22px'; // Add top margin
        title.style.marginBottom = '75px'; // Add bottom margin
        title.style.textAlign = 'center'; // Add text alignment style
        taskMenuContainer.appendChild(title);

        // menu info div container
        let menuInfoDiv = document.createElement('div');
        menuInfoDiv.classList.add('menu-info');
        menuInfoDiv.style.display = 'flex'; // Format children as a row
        taskMenuContainer.appendChild(menuInfoDiv);

        // menu info div internal container 1
        let menuInternalInfoDiv1 = document.createElement('div');
        menuInternalInfoDiv1.classList.add('menu-info-internal');
        menuInfoDiv.appendChild(menuInternalInfoDiv1);

        // Add priority task label
        let priorityTaskLabel = document.createElement('h3');
        priorityTaskLabel.innerText = 'Priority Task:';
        menuInternalInfoDiv1.appendChild(priorityTaskLabel);

        // Add highest priority task indicator
        let lowestTimeRemaining = document.createElement('h4');
        lowestTimeRemaining.innerText = 'N/A';
        lowestTimeRemaining.id = 'lowest-time-remaining'; // Add an id to the element
        // make it normal, not bold
        lowestTimeRemaining.style.fontWeight = 'normal';
        // Set text color to white
        lowestTimeRemaining.style.color = 'white';
        menuInternalInfoDiv1.appendChild(lowestTimeRemaining);

        // Add time of that task
        let timeOfTask = document.createElement('h4');
        timeOfTask.innerText = 'Due in: N/A';
        timeOfTask.id = 'time-of-task'; // Add an id to the element
        // make it normal, not bold
        timeOfTask.style.fontWeight = 'normal';
        // Set text color to white
        timeOfTask.style.color = 'white';
        menuInternalInfoDiv1.appendChild(timeOfTask);

        // if there is a highest priority task, display it and its time remaining
        if (this.soonestTask) {
            document.getElementById('lowest-time-remaining').innerText = `${this.soonestTask.taskName}`;
            console.log(`AHHHHHHHHHHHHHHH: ${this.getTimeRemaining(this.soonestTask)}`);
            document.getElementById('time-of-task').innerText = `${this.getTimeRemaining(this.soonestTask)}`;
        }

        // menu info div internal container 2
        let menuInternalInfoDiv2 = document.createElement('div');
        menuInternalInfoDiv2.classList.add('menu-info-internal');
        menuInfoDiv.appendChild(menuInternalInfoDiv2);

        // Add completion stats label
        let completionStatsLabel = document.createElement('h3');
        completionStatsLabel.innerText = 'Stats:';
        menuInternalInfoDiv2.appendChild(completionStatsLabel);

        // // Add completed task count
        // let completedTaskCount = document.createElement('h4');
        // completedTaskCount.innerText = `Completed tasks: ${this.completedTaskCount}`;
        // completedTaskCount.style.marginRight = '29px'; // Add right margin
        // completedTaskCount.style.color = 'white'; // Set text color to white
        // // make it normal, not bold
        // completedTaskCount.style.fontWeight = 'normal';
        // menuInternalInfoDiv2.appendChild(completedTaskCount);

        // Add incomplete task count
        let incompleteTaskCount = document.createElement('h4');
        incompleteTaskCount.innerText = `Incomplete tasks: ${this.incompleteTaskCount}`;
        incompleteTaskCount.style.marginRight = '29px'; // Add right margin
        incompleteTaskCount.style.color = 'white'; // Set text color to white
        // make it normal, not bold
        incompleteTaskCount.style.fontWeight = 'normal';
        menuInternalInfoDiv2.appendChild(incompleteTaskCount);

        // determine count of tasks due this week and this month
        this.tasksDueThisWeek = 0;
        this.tasksDueThisMonth = 0;
        this.tasks.forEach(task => {
            if (task) {
                if (!task.taskDueDate) {
                    return;
                }
                if (this.getTimeRemainingInt(task) < 604800000) {
                    this.tasksDueThisWeek++;
                }
                if (this.getTimeRemainingInt(task) < 2592000000) {
                    this.tasksDueThisMonth++;
                }
            }
        });

        // add count of tasks due this week
        let tasksDueThisWeek = document.createElement('h4');
        tasksDueThisWeek.innerText = `Due this week: ${this.tasksDueThisWeek}`;
        tasksDueThisWeek.style.marginRight = '29px'; // Add right margin
        tasksDueThisWeek.style.color = 'white'; // Set text color to white
        // make it normal, not bold
        tasksDueThisWeek.style.fontWeight = 'normal';
        menuInternalInfoDiv2.appendChild(tasksDueThisWeek);

        // add count of tasks due this month
        let tasksDueThisMonth = document.createElement('h4');
        tasksDueThisMonth.innerText = `Due this month: ${this.tasksDueThisMonth}`;
        tasksDueThisMonth.style.marginRight = '29px'; // Add right margin
        tasksDueThisMonth.style.color = 'white'; // Set text color to white
        // make it normal, not bold
        tasksDueThisMonth.style.fontWeight = 'normal';
        menuInternalInfoDiv2.appendChild(tasksDueThisMonth);

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

        // Container for meta task operations while holds another container of class "nav-menu-buttons" for addtask, filter, and sort
        let metaTaskContainer = document.createElement('div');
        metaTaskContainer.classList.add('course-menu-buttons');
        operationsContainer.appendChild(metaTaskContainer);

        // nav-menu-buttons container for add task, filter, and sort buttons
        let navMenuButtons = document.createElement('div');
        navMenuButtons.classList.add('nav-menu-buttons');
        metaTaskContainer.appendChild(navMenuButtons);

        // Add task button
        let addTaskButton = document.createElement('button');
        addTaskButton.innerText = 'Add Task';
        addTaskButton.classList.add('TaskAdd-btn');
        addTaskButton.style.marginRight = '25px'; // Add right margin
        navMenuButtons.appendChild(addTaskButton);

        // Filter tasks button
        let filterTaskButton = document.createElement('button');
        // if there is a filter, set the button text to reflect the filter
        if (this.filter === "") {
            filterTaskButton.innerText = 'Filter - None';
        } else if (this.filter) {
            filterTaskButton.innerText = `Filter - ${this.filter}`;
        }  else {
            filterTaskButton.innerText = 'Filter - None';
        }
        filterTaskButton.id = 'TaskFilter-btn';
        filterTaskButton.style.marginRight = '25px'; // Add right margin
        filterTaskButton.style.fontSize = '15px';
        navMenuButtons.appendChild(filterTaskButton);

        // Sort tasks button
        let sortTaskButton = document.createElement('button');
        // if there is a sort, set the button text to reflect the sort
        if (this.sort) {
            sortTaskButton.innerText = `Sort - ${this.sort}`;
        } else {
            sortTaskButton.innerText = 'Sort - None';
        }
        sortTaskButton.id = 'TaskSort-btn';
        navMenuButtons.appendChild(sortTaskButton);
        sortTaskButton.style.fontSize = '15px';

        // // Add subtitle
        // let subTitle = document.createElement('h3');
        // subTitle.innerText = '- To Do -';
        // subTitle.style.marginTop = '40px'; // Add top margin
        // subTitle.style.fontSize = '20px'; // Set font size to 20
        // subTitle.style.color = "#ffffff";
        // subTitle.style.textAlign = 'center'; // Center the subtitle
        // taskMenuContainer.appendChild(subTitle);

        // create taskContainerTop for the to do label
        let taskContainerTop = document.createElement('div');
        taskContainerTop.classList.add('task-container-top');
        taskMenuContainer.appendChild(taskContainerTop);

        // create TO DO: Label inside of the task container
        let toDoLabel = document.createElement('h3');
        toDoLabel.innerText = 'To Do:';
        toDoLabel.style.fontSize = '27px'; // Set font size to 27
        taskContainerTop.appendChild(toDoLabel);

        // Create a container for all tasks
        let taskContainer = document.createElement('div');
        taskContainer.innerText = 'Empty \n\n Add a task';
        taskContainer.classList.add('task-container');
        taskContainer.style.textAlign = 'center'; // Add text alignment style
        taskContainerTop.appendChild(taskContainer);

        // Add event listener to add task button
        addTaskButton.addEventListener('click', () => {
            // Display task popup and get user input
            this.displayTaskPopup();
            this.display();
        });
        
        // Add event listener to filter task button
        filterTaskButton.addEventListener('click', () => {
            // prompt user for filter choice
            const filterChoice = prompt("Enter the filter you would like to apply to the tasks: category, or none.");
            
            // Function to set the filter for the tasks according to the user choice of category, completion, or none.
            // Filter by course
            if (filterChoice === 'category') {
                const course = prompt("Enter the category you would like to show tasks for:");
                this.filter = course;
            }
    
            // Filter by none, returns array of tasks with no filter
            if (filterChoice === 'none') {
                this.filter = "";
            }
            console.log("Buttons decides filter is: " + this.filter);
            this.display();
        });

        // Add event listener to sort task button
        sortTaskButton.addEventListener('click', () => {
            // prompt user for sort choice
            const sortChoice = prompt("Enter the sort you would like to apply to the tasks: time or none.");
            // conditionals
            if (sortChoice === 'time') {
                this.sort = "time";
            }
            // Remove sorting choice
            if (sortChoice === 'none') {
                this.sort = "none";
            }
        });

        if (this.tasks.length === 0) {
            taskContainer.innerHTML = "Empty . . .  Add a task to start";
            return;
        } else {
            console.log("Tasks exist. Displaying tasks...");
            //clear the task container
            taskContainer.innerHTML = '';
        }

        // create an array containing only the tasks that meet both the sort and filter criteria
        let filteredTasks = this.tasks;
        if (this.filter) {
            filteredTasks = this.createFilter(this.tasks, this.filter);
            console.log("Display 1");
            // print all tasks in the filteredTasks array
            console.log(filteredTasks);
        }
        if (this.sort) {
            filteredTasks = this.createSort(filteredTasks, this.sort);
            console.log("Display 2"+filteredTasks);
            // print all tasks in the filteredTasks array
            console.log(filteredTasks);
        }

        // Iterate through all tasks in the task manager, task must be in the filter and sort lists.
        for (let i = 0; i < filteredTasks.length; i++) {
            let task = filteredTasks[i];

            console.log(`Task ${task} displaying...`);
            console.log("due date: " + task.taskDueDate)

            // Create new div for each task
            let taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.setAttribute('id', "task-id-"+task.taskName);

            // create div wrappers for task name, course, and due date elements and append them to it:
            let taskInfoDiv = document.createElement('div');
            taskInfoDiv.classList.add('task-info');
            taskDiv.appendChild(taskInfoDiv);

            // Create task name element
            let taskNameElement = document.createElement('h3');
            taskNameElement.innerText = task.taskName;
            taskNameElement.style.marginBottom = '20px'; // Add bottom margin
            taskInfoDiv.appendChild(taskNameElement);

            // Create task due date element
            let taskDueDateElement = document.createElement('h4');
            taskDueDateElement.innerText = `\n${this.getTimeRemaining(task)}`;
            taskDueDateElement.id = 'task-due-date'+task.taskName; // Add an id to the element
            taskDueDateElement.style.color = 'white'; // Set text color to white
            taskInfoDiv.appendChild(taskDueDateElement);

            // Create task course element
            let taskCourseElement = document.createElement('h4');
            taskCourseElement.innerText = `${task.taskCourse}`;
            taskCourseElement.style.marginTop = '15px'; // Add bottom margin
            taskCourseElement.style.color = 'white'; // Set text color to white

            taskInfoDiv.appendChild(taskCourseElement);

            // // Create task grade element
            // let taskGradeElement = document.createElement('p');
            // taskGradeElement.innerText = `Grade: ${task.taskGrade}`;
            // taskDiv.appendChild(taskGradeElement);

            // // Create task weight element
            // let taskWeightElement = document.createElement('p');
            // taskWeightElement.innerText = `Weight: ${task.taskWeight}`;
            // taskDiv.appendChild(taskWeightElement);

            // Create container for task options
            let taskDivOptions = document.createElement('div');
            taskDivOptions.classList.add('task-options');
            taskDiv.appendChild(taskDivOptions);
            taskDivOptions.style.display = 'flex';
            taskDivOptions.style.justifyContent = 'space-around';
            taskDivOptions.style.gap = '10px';

            // Create complete button
            let completeButton = document.createElement('button');
            completeButton.innerText = '✔';
            completeButton.classList.add('secondary');
            completeButton.classList.add('complete');
            completeButton.classList.add('assignment-operators');
            completeButton.classList.add('TaskComplete-btn');
            taskDivOptions.appendChild(completeButton);

            // Add event listener to complete button
            completeButton.addEventListener('click', () => {
                console.log("Complete button clicked...........................");
                console.log(`Task ${task.taskName} deleting...`);
                this.DeleteTask(task.taskName);
                this.completedTaskCount++;
                this.display();
            });

            // Create edit button
            let editButton = document.createElement('button');
            editButton.innerText = '✐';
            editButton.classList.add('secondary');
            editButton.classList.add('assignment-operators');
            editButton.classList.add('TaskEdit-btn');
            taskDivOptions.appendChild(editButton);

            // Add event listener to edit button
            editButton.addEventListener('click', () => {
                console.log("Edit button clicked...........................");
                this.EditTask(task.taskName);
                this.display();
            });
            
            // Create delete button
            let deleteButton = document.createElement('button');
            deleteButton.innerText = '\u{1F5D1}';
            deleteButton.classList.add('TaskDelete-btn');
            deleteButton.classList.add('secondary');
            deleteButton.classList.add('ass-delete-button');
            deleteButton.classList.add('assignment-operators');
            taskDivOptions.appendChild(deleteButton);

            // Add event listener to delete button
            deleteButton.addEventListener('click', () => {
                console.log(`Task ${task.taskName} deleting...`);
                this.DeleteTask(task.taskName);
                this.display();
            });

            // Append task div to courses loaded div
            taskContainer.appendChild(taskDiv);

            
        }
    }
}
