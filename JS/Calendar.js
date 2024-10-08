const monthDays = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31
};

class CalendarManager {
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    
    getDaysInMonth(month, year) {
        if (month === 'February' && isLeapYear(year)) {
            return 29;
        }
        return monthDays[month];
    }

    // when a date is clicked, return information about that date.


    display() {
        console.log(taskManager.tasks);
        const events = taskManager.tasks;

        // Clear existing content
        let coursesLoadedDiv = document.querySelector('.courses-loaded');
        coursesLoadedDiv.innerHTML = '';

        // create a container for all task menu elements
        let taskMenuContainer = document.createElement('div');
        taskMenuContainer.classList.add('task-menu-container');
        coursesLoadedDiv.appendChild(taskMenuContainer);

        // add a label saying "The Calendar feature is still under development, come back soon!"
        let calendarUnderDevelopment = document.createElement('h1');
        calendarUnderDevelopment.textContent = "The Calendar feature is still under construction, come back soon!";
        calendarUnderDevelopment.style = "text-align: center; margin: 40px 0";
        taskMenuContainer.appendChild(calendarUnderDevelopment);

        // based on the month of the current user, please display the number of dates, please use the map above
        let currentDate = new Date();
        let currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        let currentYear = new Date().getFullYear();
        let currentNumberDate = currentDate.getDate();

        let daysInMonth = this.getDaysInMonth(currentMonth, currentYear);
        console.log(`Number of dates in ${currentMonth}: ${daysInMonth}`);

        // for the number of days in the month, print boxes representing those days in rows of 7 width (to represent each week)
        let calendarContainer = document.createElement('div');
        calendarContainer.classList.add('calendar-container');

        // display the current month as title
        let monthTitle = document.createElement('h1');
        monthTitle.style = "margin-bottom: 30px";
        monthTitle.textContent = currentMonth +" "+ currentNumberDate + ", " + currentYear;
        calendarContainer.appendChild(monthTitle);

        // Print rows of days
        let currentDay = 1;
        for (let i = 0; i < Math.ceil(daysInMonth / 7); i++) {
            let weekRow = document.createElement('div');
            weekRow.classList.add('week-row');

            for (let j = 0; j < 7; j++) {
                if (currentDay > daysInMonth) {
                    break;
                }

                let dayBox = document.createElement('div');
                dayBox.classList.add('day-box');
                dayBox.innerHTML = `<p>${currentDay}</p>`;

                // let todayFilter = events.filter(task => task.taskDueDate === );
                // console.log()
                // console.log(currentDay);

                if (currentDay === currentDate.getDate() && currentMonth === currentDate.toLocaleString('default', { month: 'long' }) && currentYear === currentDate.getFullYear()) {
                    dayBox.classList.add('currentday');
                }

                dayBox.dataset.date = `${currentMonth} ${currentDay}, ${currentYear}`;

                dayBox.addEventListener('click', () => {
                    const clickedDate = dayBox.dataset.date;
                    updateDateDisplay(clickedDate); // Update the date display box
                });

                weekRow.appendChild(dayBox);
                currentDay++;
            }

            calendarContainer.appendChild(weekRow);
        }

        taskMenuContainer.appendChild(calendarContainer);
    }
}

function updateDateDisplay(date) {
    let dateDisplayBox = document.querySelector('.date-display-box');

    if (!dateDisplayBox) {
        // Create the date display box if it doesn't exist
        dateDisplayBox = document.createElement('div');
        dateDisplayBox.classList.add('date-display-box');

        let taskMenuContainer = document.querySelector('.task-menu-container');
        taskMenuContainer.appendChild(dateDisplayBox);
    }

    dateDisplayBox.textContent = `Selected Date: ${date}`;
    // grab info from the TaskManager object to print the details of any tasks due on that day
    const tasksDueOnDate = this.eventArray.filter(event => event.date === date);
    tasksDueOnDate.forEach(task => {
        console.log(`Task: ${task.title}`);
        console.log(`Description: ${task.description}`);
        console.log(`Due Date: ${task.date}`);
        console.log('---');
    });
}