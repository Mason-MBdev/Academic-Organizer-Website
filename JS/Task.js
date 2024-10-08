// Task class holds the task details and provides methods to edit and get task details.
// Accessed through the TaskManager class which holds and operates on a list of Tasks.
class Task {
    constructor(taskName, taskGrade = null, taskWeight = null, taskCourse, taskDueDate, taskCompleted = false) {
        this.taskName = taskName;
        this.taskGrade = taskGrade;
        this.taskWeight = taskWeight;
        this.taskCourse = taskCourse;
        this.taskDueDate = taskDueDate;
        this.taskCompleted = taskCompleted;
    }

    editTask (taskName, taskGrade = null, taskWeight = null, taskCourse, taskDueDate, taskCompleted = false) {
        this.taskName = taskName;
        this.taskGrade = taskGrade;
        this.taskWeight = taskWeight;
        this.taskCourse = taskCourse;
        this.taskDueDate = taskDueDate;
        this.taskCompleted = taskCompleted;
    }

    // Getters for: name, weight, grade, due date, courses ------------------------------------------------------------------------------------
    getTaskGrade() {
        return this.taskGrade;
    }
    
    getTaskWeight() {
        return this.taskWeight;
    }

    getTaskName() {
        return this.taskName;
    }

    getDueDate() {
        return this.taskDueDate;
    }

    getCourse() {
        return this.taskCourse;
    }

    getTaskCompleted() {
        return this.taskCompleted;
    }

    // Setters for: Name, weight, grade, due date, courses ------------------------------------------------------------------------------------
    setTaskName(newName) {
        this.taskName = newName;
    }
    
    setTaskWeight(newWeight) {
        this.taskWeight = newWeight;
    }
    
    setTaskGrade(newGrade) {
        this.taskGrade = newGrade;
    }

    setDueDate(newDate) {
        this.taskDueDate = newDate;
    }
    
    setCourse(newCourse) {
        this.taskCourse = newCourse;
    }

    setTaskCompleted(newCompleted) {
        this.taskCompleted = newCompleted;
    }
}