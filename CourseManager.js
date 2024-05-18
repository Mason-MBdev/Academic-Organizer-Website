class CourseManager {
    constructor() {
        this.courses = [];
    }

    calculateOverallGrade() {
        let totalGrade = 0;
        let totalWeight = this.courses.length;
        this.courses.forEach(course => {
            if (course.courseGrade!== null) { // Ensure course has a grade
                totalGrade += course.courseGrade;
            }
        });
        return totalWeight > 0? totalGrade / totalWeight : 0;
    }

    addCourse(title) {
        const newCourse = new Course(this.generateUniqueId(), title, []);
        this.courses.push(newCourse);
        return newCourse;
    }

    generateUniqueId() {
        return Math.random().toString(36).substring(7);
    }

    getCourseById(id) {
        return this.courses.find(course => course.id === id);
    }

    removeCourse(id) {
        this.courses = this.courses.filter(course => course.id!== id);
    }
    
    addAssignmentToCourse(courseId, assignmentDetails) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        course.addAssignment(assignmentDetails); // This line was causing the error
    }

    removeAssignmentFromCourse(courseId, assignmentId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        course.removeAssignment(assignmentId);
    }
}
