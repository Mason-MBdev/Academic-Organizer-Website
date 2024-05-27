// Assignment.js
class Assignment {
    constructor(name, grade, weight) {
        this.id = id;
        this.name = name;
        this.grade = grade;
        this.weight = weight;
        this.completed = false;
    }

    markAsComplete() {
        this.completed = !this.completed;
        console.log(`Assignment ${this.name} marked as ${this.completed ? "completed" : "incomplete"}`);
    }

    updateGrade(newGrade) {
        this.grade = newGrade;
    }
}