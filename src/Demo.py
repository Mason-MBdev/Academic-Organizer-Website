import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QLabel, QLineEdit, QPushButton, QTextEdit, QGridLayout, QVBoxLayout, QHBoxLayout, QListWidget, QMessageBox, QDialog
from PyQt5.QtGui import QFont


class Course:
    def __init__(self, name):
        self.name = name
        self.assignments = {}

    def add_assignment(self, assignment_name, score, max_score):
        try:
            score = float(score)
            max_score = float(max_score)
        except ValueError:
            QMessageBox.critical(None, "Error", "Please enter valid numeric values for score and max score.")
            return

        self.assignments[assignment_name] = {"score": score, "max_score": max_score}

    def delete_assignment(self, assignment_name):
        if assignment_name in self.assignments:
            del self.assignments[assignment_name]

    def calculate_grade(self):
        if not self.assignments:
            return 0  # No assignments yet, grade is 0
        total_score = sum(assignment["score"] for assignment in self.assignments.values())
        total_max_score = sum(assignment["max_score"] for assignment in self.assignments.values())
        return (total_score / total_max_score) * 100


class Student:
    def __init__(self, name):
        self.name = name
        self.courses = []

    def add_course(self, course_name):
        if any(course.name == course_name for course in self.courses):
            QMessageBox.critical(None, "Error", "Course with the same name already exists.")
            return
        course = Course(course_name)
        self.courses.append(course)

    def get_course_by_name(self, course_name):
        for course in self.courses:
            if course.name == course_name:
                return course
        return None

    def calculate_overall_grade(self):
        total_score = 0
        total_max_score = 0
        for course in self.courses:
            total_score += sum(assignment["score"] for assignment in course.assignments.values())
            total_max_score += sum(assignment["max_score"] for assignment in course.assignments.values())
        if total_max_score != 0:
            overall_grade = (total_score / total_max_score) * 100
        else:
            overall_grade = 0
        return overall_grade


class AddAssignmentDialog(QDialog):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Add New Assignment")
        self.setLayout(QVBoxLayout())

        self.assignment_name_label = QLabel("Assignment Name:")
        self.assignment_name_input = QLineEdit()
        self.layout().addWidget(self.assignment_name_label)
        self.layout().addWidget(self.assignment_name_input)

        self.score_label = QLabel("Score:")
        self.score_input = QLineEdit()
        self.layout().addWidget(self.score_label)
        self.layout().addWidget(self.score_input)

        self.max_score_label = QLabel("Max Score:")
        self.max_score_input = QLineEdit()
        self.layout().addWidget(self.max_score_label)
        self.layout().addWidget(self.max_score_input)

        button_add_assignment = QPushButton("Add Assignment")
        button_add_assignment.clicked.connect(self.accept)
        self.layout().addWidget(button_add_assignment)

        self.setStyleSheet("""
            background-color: #333333;
            color: #FFFFFF;
            QLabel {
                color: #FFFFFF;
            }
            QLineEdit {
                background-color: #666666;
                color: #FFFFFF;
                border: 1px solid #CCCCCC;
                border-radius: 3px;
            }
            QPushButton {
                background-color: #555555;
                color: #FFFFFF;
                border: 2px solid #FFFFFF;
                border-radius: 5px;
            }
        """)

    def get_assignment_details(self):
        assignment_name = self.assignment_name_input.text()
        score = self.score_input.text()
        max_score = self.max_score_input.text()
        return assignment_name, score, max_score


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Student Course Manager")
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        self.student = Student("John Doe")

        self.setup_ui()

    def setup_ui(self):
        main_layout = QHBoxLayout(self.centralWidget())

        # Left Column: Course Entry
        left_layout = QVBoxLayout()
        main_layout.addLayout(left_layout)

        label_courses = QLabel("Courses:")
        left_layout.addWidget(label_courses)

        # Overall Grade Label
        self.label_overall_grade = QLabel("Overall Grade: 0.00%")
        left_layout.addWidget(self.label_overall_grade)

        # List of courses added
        self.course_list = QListWidget()
        self.course_list.itemClicked.connect(self.select_course)
        left_layout.addWidget(self.course_list)

        # button and input for course addition 
        self.entry_course = QLineEdit()
        left_layout.addWidget(self.entry_course)

        button_add_course = QPushButton("^ Add Course ^")
        button_add_course.clicked.connect(self.add_course)
        left_layout.addWidget(button_add_course)

        # Middle Column: Course Information and Stats
        middle_layout = QVBoxLayout()
        main_layout.addLayout(middle_layout)

        label_course_info = QLabel("Course Stats:")
        middle_layout.addWidget(label_course_info)

        self.text_course_details = QTextEdit()
        middle_layout.addWidget(self.text_course_details)

        # Right Column: Assignment Listbox and Buttons
        right_layout = QVBoxLayout()
        main_layout.addLayout(right_layout)

        label_assignment_course = QLabel("Manage Assignments:")
        right_layout.addWidget(label_assignment_course)

        self.entry_assignment_course = QLabel()
        right_layout.addWidget(self.entry_assignment_course)

        self.assignment_list = QListWidget()
        right_layout.addWidget(self.assignment_list)

        button_open_assignment_window = QPushButton("Create new Assignment")
        button_open_assignment_window.clicked.connect(self.open_assignment_window)
        right_layout.addWidget(button_open_assignment_window)

        button_delete_assignment = QPushButton("Delete Selected Assignment")
        button_delete_assignment.clicked.connect(self.delete_assignment)
        right_layout.addWidget(button_delete_assignment)

        self.update_course_list()

        self.setStyleSheet("""
            QMainWindow {
                background-color: #333333;
                color: #FFFFFF;
            }
            QLabel {
                color: #FFFFFF;
                font-size: 11pt;
            }
            QLineEdit {
                background-color: #666666;
                color: #FFFFFF;
                border: 1px solid #CCCCCC;
                border-radius: 3px;
            }
            QPushButton {
                background-color: #555555;
                color: #FFFFFF;
                border: 2px solid #FFFFFF;
                border-radius: 5px;
                font-size: 11pt; /* Increased font size by 2 points */

            }
            QListWidget {
                background-color: #666666;
                color: #FFFFFF;
                border: 1px solid #CCCCCC;
                border-radius: 3px;
                font-size: 11pt;

            }
            QTextEdit {
                background-color: #666666;
                color: #FFFFFF;
                border: 1px solid #CCCCCC;
                border-radius: 3px;
                font-size: 11pt;
            }
        """)

    def add_course(self):
        course_name = self.entry_course.text()
        if course_name == "":
            return
        self.student.add_course(course_name)
        self.update_course_list()
        self.entry_course.clear()

    def select_course(self, item):
        selected_course_name = item.text()
        self.entry_assignment_course.setText(selected_course_name)
        self.update_course_details(selected_course_name)
        self.update_assignment_list(selected_course_name)

    def update_course_list(self):
        self.course_list.clear()
        for course in self.student.courses:
            self.course_list.addItem(course.name)

    def update_course_details(self, course_name):
        course = self.student.get_course_by_name(course_name)
        if course:
            course_grade = course.calculate_grade()
            self.text_course_details.clear()
            self.text_course_details.append(f"Name: {course.name}\n")
            self.text_course_details.append(f"Grade: {course_grade:.2f}%\n")

    def update_assignment_list(self, course_name):
        course = self.student.get_course_by_name(course_name)
        if course:
            self.assignment_list.clear()
            for assignment_name, assignment in course.assignments.items():
                self.assignment_list.addItem(f"{assignment_name}: {assignment['score']} / {assignment['max_score']}")

    def delete_assignment(self):
        selected_course_name = self.entry_assignment_course.text()
        course = self.student.get_course_by_name(selected_course_name)
        if course:
            selected_item = self.assignment_list.currentItem()
            if selected_item:
                selected_assignment = selected_item.text().split(":")[0].strip()
                course.delete_assignment(selected_assignment)
                self.update_assignment_list(selected_course_name)
                self.update_course_details(selected_course_name)
                self.update_overall_grade()

    def open_assignment_window(self):
        dialog = AddAssignmentDialog()
        if dialog.exec_() == QDialog.Accepted:
            assignment_name, score, max_score = dialog.get_assignment_details()
            selected_course_name = self.entry_assignment_course.text()
            course = self.student.get_course_by_name(selected_course_name)
            if course:
                course.add_assignment(assignment_name, score, max_score)
                self.update_assignment_list(selected_course_name)
                self.update_course_details(selected_course_name)
                self.update_overall_grade()

    def update_overall_grade(self):
        overall_grade = self.student.calculate_overall_grade()
        self.label_overall_grade.setText(f"Overall Grade: {overall_grade:.2f}%")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
