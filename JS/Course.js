// Course.js
class Course {
    constructor(id, title, assignments = [], overallGrade = null) {
        this.id = parseInt(id);
        this.title = title;
        this.assignments = assignments; // Array of assignments directly linked to the course
        this.overallGrade = overallGrade; // Overall grade for the course
        this.assignmentIdCounter = 0;
        this.highestGradeAssignment = null;
        this.completedAssignments = 0;
        this.incompleteAssignments = 0;
        this.decidedWeight = 0;
        this.undecidedWeight = 0;
        this.totalWeight = 0;
        this.maxGrade = 100;
        this.minGrade = 0;
    }

    getCompletedAssignmentsCount() {
        this.completedAssignments = this.assignments.filter(assignment => assignment.completed).length;
        this.incompleteAssignments = this.assignments.length - this.completedAssignments;
        return this.completedAssignments;
    }
    
    // Method to recalculate the course grade and store the highest grade assignment
    recalculateCourseGrade() {
        console.log("This is a function");
        let totalWeight = 0;
        let totalPoints = 0;
        let maxPoints = 0;
        let minPoints = 0;

        this.assignments.forEach(assignment => {
            if (!this.highestGradeAssignment || assignment.grade > this.highestGradeAssignment.grade) {
                this.highestGradeAssignment = assignment;
            }

            console.log(`assignment: ${assignment.name} grade: ${assignment.grade} weight: ${assignment.weight} completed: ${assignment.completed}`);
            if (assignment.completed) {
                totalPoints += assignment.grade * (assignment.weight / 100);
                totalWeight += assignment.weight;
            } else {
                // For incomplete assignments, consider max grade (100%) and min grade (0%)
                maxPoints += 100 * (assignment.weight / 100);
                minPoints += 0 * (assignment.weight / 100);
            }
        });

        console.log(`total points: ${totalPoints} total weight: ${totalWeight}`);
        this.overallGrade = (totalPoints / totalWeight) * 100 || 0;

        // console log this.totalWeight
        console.log(`total weight: ${this.totalWeight}`);

        // Calculate the maximum and minimum achievable grades
        this.maxGrade = parseFloat(((totalPoints + maxPoints) / this.totalWeight) * 100).toFixed(2);
        this.minGrade = parseFloat((totalPoints / this.totalWeight) * 100).toFixed(2);

        // Console log the max and min grades
        console.log(`max grade: ${this.maxGrade} min grade: ${this.minGrade}`);

        console.log(`course name: ${this.title} grade recalculated: ${this.overallGrade.toFixed(2)}%`);
    }



    // calculate the decided and undecided weight of the course based off of: completion, weight, and grade of all assignments
    courseWeightCalculations() {
        let decidedWeight = 0;
        let undecidedWeight = 0;
        this.assignments.forEach(assignment => {
            if (assignment.completed) {
                decidedWeight += assignment.weight;
            } else {
                undecidedWeight += assignment.weight;
            }
        });

        this.decidedWeight = decidedWeight;
        this.undecidedWeight = undecidedWeight;
        this.totalWeight = decidedWeight + undecidedWeight;
        return undecidedWeight;
    }

    // Method to add an assignment to the course
    addAssignment(assignment) {
        // print the internal assignment details
        console.log(assignment);
        assignment.id = this.assignmentIdCounter++;
        this.assignments.push(assignment);
    }

    // Method to remove an assignment from the course
    removeAssignment(assignmentId) {
        assignmentId = parseInt(assignmentId);
        this.assignments = this.assignments.filter(assignment => assignment.id!== assignmentId);
    }
}
