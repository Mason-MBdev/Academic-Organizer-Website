class SaveManager {
    saveToFile(courseManager, taskManager, calendarManager) {
        const data = {
            courses: courseManager.courses,
            tasks: taskManager,
            // calendar: calendarManager.events
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "data.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    loadFromFile(courseManager, taskManager, calendarManager, file) {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            const data = JSON.parse(content);

            // Update the properties of taskManager
            // taskManager = data.tasks;
            // console.log(taskManager);
            // taskManager.display();
            // taskManager.updateTimeRemaining();
            // taskManager.startLoop();

            // Update the properties of courseManager
            courseManager.courses = data.courses.map(courseData => {
                const course = new Course(courseData.id, courseData.name); // Adjust constructor arguments as needed
                Object.assign(course, courseData);
                return course;
            });
            
            console.log(courseManager.courses);
            var courseID = courseManager.selectFirstCourse();
            courseManager.selectCourse(courseID);
            courseManager.display();
            courseManager.displayAssignments(courseID);
            console.log("displaying Assignments in Course: " + courseManager.selectedCourse.id);

            // Uncomment and update the calendarManager if needed
            // calendarManager.events = data.calendar;
            // calendarManager.display();
        }
    }
}

// Example usage
// const saveManager = new SaveManager();

// document.getElementById('save-btn').addEventListener('click', () => {   
//     saveManager.saveToFile(courseManager, taskManager, calendarManager);
// });

// document.getElementById('load-btn').addEventListener('click', () => {
//     saveManager.loadFromFile(courseManager, taskManager, calendarManager);
// });
