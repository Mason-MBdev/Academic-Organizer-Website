// Assignment.js
class Assignment {
    constructor(name, grade, weight, completed = false) {
        this.id = null;
        this.name = name;
        this.grade = grade;
        this.weight = weight;
        this.completed = completed;
    }

    markAsComplete() {
        this.completed = !this.completed;
        console.log(`Assignment ${this.name} marked as ${this.completed ? "completed" : "incomplete"}`);
    }

    updateGrade(newGrade) {
        this.grade = newGrade;
    }
}