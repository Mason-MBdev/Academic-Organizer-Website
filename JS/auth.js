import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();

// DOM ELEMENTS
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.getElementById('account-details');
var userID;

// listen for auth status changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userID = user.uid;
    // account info
    const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const html = `Logged in as ${user.email}`;
            accountDetails.textContent = html;
    }

    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');

    console.log("User Logged In: ", user);

    const dbRef = ref(db, 'users/' + userID);

    console.log("Data retrieved:", dbRef);

    // Retrieve the data
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Data retrieved:", snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error retrieving data: ", error);
      });


    // grab the user's associated doc and console log the results, additionally try to impose new managers
    db.collection('users').doc(user.uid).get().then(doc => {
      
      console.log("User document object");
      console.log(doc.data);
      console.log("WIth brackets");
      console.log(doc.data());
      console.log("Course array check");
      console.log(doc.data().courses);
      
      // console.log("4");
      courseManager.courses = doc.data().courses;
      taskManager.tasks = doc.data().tasks;

      console.log("Replacement testing:");
      console.log(courseManager.courses);
      console.log(taskManager.tasks);

      console.log("Final Object stats:");
      console.log(courseManager);
      console.log(taskManager);

    });
  } else {
    userID = null;
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
    console.log("User Logged Out");
  }
});
  
// save user data as JSON to firebase
const cloudSaveButton = document.getElementById('Firebase-save-btn');
cloudSaveButton.addEventListener('click', (e) => {
  e.preventDefault();
  console.log("womp womp womp");

  // The reference where you want to store the data
  const dbRef = ref(database, 'users/' + userID);

  const data = {
      courses: courseManager.courses,
      tasks: taskManager.tasks,
      // calendar: calendarManager.events
  };

  // Convert the data to JSON
  const jsonObject = JSON.stringify(data);

  // Store the JSON object
  set(dbRef, jsonObject) 
    .then(() => {
      console.log("Data stored successfully.");
    })
    .catch((error) => {
      console.error("Error storing data: ", error);
    });

  // return db.collection('users').doc(userID).set({
  //   course: courseManager.courses,
  //   task: taskManager.tasks,
  //   // calendar: calendarManager
  // });
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: "womp womp womp"
    });
  }).then(() => {
    // close the signup modal & reset form
    closeSignup();
    signupForm.reset();
  });

  console.log("User Created");
});
  
// logout
const logout = document.getElementById('logout');
logout.addEventListener('click', (e) => {
  console.log("User Logged Out");
  e.preventDefault();
  auth.signOut();
});
  
// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    closeLogin();
    loginForm.reset();
  });
});