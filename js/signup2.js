import { db, auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Assuming the phone number is passed as a query parameter in the URL
const urlParams = new URLSearchParams(window.location.search);
const phoneNumber = urlParams.get('phoneNumber');

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('googleSignUpBtn').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        saveUserToFirestore(user.email, 'GoogleAuth', phoneNumber)
          .then(() => {
            displayMessage('User signed up with Google successfully', 'success');
            redirectToWelcomePage();
          })
          .catch((error) => {
            displayMessage('Error saving user data to Firestore: ' + error.message, 'error');
          });
        console.log('User signed up with Google:', user);
      })
      .catch((error) => {
        displayMessage('Error during Google sign-up: ' + error.message, 'error');
      });
  });

  document.getElementById('emailSignUpBtn').addEventListener('click', () => {
    if (phoneNumber) {
      const email = `${phoneNumber}@celebrare.in`;
      const password = `celebrare@${phoneNumber}`;

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          saveUserToFirestore(email, password, phoneNumber)
            .then(() => {
              displayMessage('User account created successfully', 'success');
              redirectToWelcomePage();
            })
            .catch((error) => {
              displayMessage('Error saving user data to Firestore: ' + error.message, 'error');
            });
          console.log('User account created:', user);
        })
        .catch((error) => {
          displayMessage('Error during account creation: ' + error.message, 'error');
        });
    } else {
      displayMessage('Phone number not found in URL parameters', 'error');
    }
  });
});

async function saveUserToFirestore(email, password, phoneNumber) {
  try {
    await setDoc(doc(db, 'users', phoneNumber), {
      email: email,
      password: password
    });
    console.log('User data saved to Firestore');
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    throw error;
  }
}

function displayMessage(message, type) {
  const messageElement = document.getElementById('message');
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    messageElement.style.color = type === 'success' ? 'green' : 'red';
  } else {
    console.error('Message element not found');
  }
}

function redirectToWelcomePage() {
  window.location.href = 'welcome.html';
}