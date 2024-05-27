// Course.js
class Course {
    constructor(id, title, assignments = [], overallGrade = null) {
        this.id = id;
        this.title = title;
        this.assignments = assignments; // Array of assignments directly linked to the course
        this.overallGrade = overallGrade; // Overall grade for the course
    }

    // Method to recalculate the course grade
    recalculateCourseGrade() {
        let totalWeight = 0;
        let totalPoints = 0;
        this.assignments.forEach(assignment => {
            if (assignment.completed) {
                totalPoints += assignment.grade * (assignment.weight / 100);
                totalWeight += assignment.weight;
            }
        });
        this.courseGrade = (totalPoints / totalWeight) * 100 || 0;
    }

    // Calculate the weighted sum of grades
    calculateWeightedSum() {
        return parseFloat(this.assignments.reduce((sum, assignment) => sum + assignment.grade * assignment.weight / 100, 0).toFixed(2));
    }

    // Method to add an assignment to the course
    addAssignment(assignment) {
        this.assignments.push(assignment);
    }

    // Method to remove an assignment from the course
    removeAssignment(assignmentId) {
        this.assignments = this.assignments.filter(assignment => assignment.id!== assignmentId);
    }
}
