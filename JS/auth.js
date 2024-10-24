
// IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// DOM ELEMENTS
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.getElementById('account-details');
var userData;
var userID;

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBO2KJaF9rHOLopMEU22F1Es8-qgZNlLM4",
  authDomain: "academic-organizer.firebaseapp.com",
  projectId: "academic-organizer",
  storageBucket: "academic-organizer.appspot.com",
  messagingSenderId: "708999915370",
  appId: "1:708999915370:web:68e25a6f6d2d47b585a713",
  measurementId: "G-5NDDY4FDVL"
};
  
// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ======================================== ACCOUNT MANAGEMENT ========================================
// Signup =============================================================================================
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Getting user info from form
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // Sign the user up for authentication
  auth.createUserWithEmailAndPassword(email, password).then(() => {
    closeSignup();
    signupForm.reset();
  });

  // // Add user reference to database
  // set(ref(db, 'users/' + user.uid), {
    
  // }).then (() => {
  //   console.log("User Added to Database");
  // });

  console.log("User Created");
});

// Login ==============================================================================================
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get user info from form
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // Log user in
  signInWithEmailAndPassword(auth, email, password).then((cred) => {
    closeLogin();
    loginForm.reset();
  });
});
  
// Logout =============================================================================================
const logout = document.getElementById('logout');
logout.addEventListener('click', (e) => {
  console.log("User Logged Out");
  e.preventDefault();
  auth.signOut();
});

// Login Status ======================================================================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userID = user.uid;
    const userRef = ref(db, 'users/' + user.uid);

    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
    
    // Get realtime user data 
    onValue(userRef, (snapshot) => {
      userData = snapshot.val();
      console.log("User Data:", userData);

      // Load data from database to local storage
      if (userData) {
        console.log("Loading data from database to local storage");
        // console.log(userData.courseManager.tasks);
        // console.log(taskManager);


        // // Update the properties of taskManager
        // taskManager = userData.courseManager.tasks;
        // if (taskManager.tasks) {
        //   console.log(taskManager.tasks);
        //   taskManager.display();
        //   taskManager.updateTimeRemaining();
        //   taskManager.startLoop();
        // }
        
        // console.log(userData.courseManager.courses);

        // Update the properties of courseManager
        courseManager.courses = userData.courseManager.courses.map(courseData => {
            const course = new Course(courseData.id, courseData.name);
            Object.assign(course, courseData);
            return course;
        });
        console.log(courseManager.courses);
        var courseID = courseManager.selectFirstCourse();
        courseManager.selectCourse(courseID);
        courseManager.display();
        courseManager.displayAssignments(courseID);
        console.log("displaying Assignments in Course: " + courseManager.selectedCourse.id);
      }

      accountDetails.innerHTML = `Signed in as - ${user.email}`;
    });

    console.log("User Logged In: ", user);
  } 
  
  else {
    userID = null;
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
    console.log("User Logged Out");
  }
});

// ======================================== DATABASE MANAGEMENT ========================================
// Copy data from database to local storage ============================================================



// Copy data from local storage to database ============================================================
document.getElementById('Firebase-save-btn').addEventListener('click', () => {
  console.log("save button pressed");
  var data = {
      courses: courseManager.courses,
      tasks: taskManager,
    //   calendar: calendarManager.events
  };
  saveDataToDatabase(data);
});

function saveDataToDatabase(data) {
  console.log("Saving data to database");
  console.log(data)
  userID = auth.currentUser.uid;
  if (userID && data) {
    set(ref(db, 'users/' + userID + '/courseManager'), data)
      .then(() => {
        console.log("Data saved to database");
      })
      .catch((error) => {
        console.error("Error saving data to database: ", error);
      }); 
  } else {
    console.log("No user logged in or no data provided");
  }
};