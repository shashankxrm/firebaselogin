import { db, getDoc, doc, auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('googleSignInBtn').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        checkPhoneNumberAssociation(user.email);
        console.log('User signed in with Google:', user);
        displayMessage('Sign-in successful', 'success');
        redirectToWelcomeBackPage();
      })
      .catch((error) => {
        displayError('Error during Google sign-in: ' + error.message);
      });
  });

  document.getElementById('emailSignInBtn').addEventListener('click', async () => {
    const phoneNumberElement = document.getElementById('phoneNumber');
    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');
    console.log('Phone number element:', phoneNumberElement); // Debugging line
    if (phoneNumberElement && emailElement && passwordElement) {
      const phoneNumber = phoneNumberElement.value;
      const email = emailElement.value;
      const password = passwordElement.value;

      console.log(`Attempting sign-in with email: ${email} and password: ${password}`);

      // Check if the email is connected to the phone number
      const isValid = await validateEmailAndPassword(email, password, phoneNumber);
      if (isValid) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('User signed in:', user);
            displayMessage('Sign-in successful', 'success');
            redirectToWelcomeBackPage();
          })
          .catch((error) => {
            displayError('Error during email sign-in: ' + error.message);
          });
      } else {
        displayError('Email or password is incorrect');
      }
    } else {
      displayError('Phone number, email, or password input element not found');
    }
  });
});

async function validateEmailAndPassword(email, password, phoneNumber) {
  try {
    const docRef = doc(db, 'users', phoneNumber);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log(`Firestore data: email=${userData.email}, password=${userData.password}`);
      return userData.email === email && userData.password === password;
    } else {
      displayError('No user found with this phone number');
      return false;
    }
  } catch (error) {
    displayError('Error validating email and password: ' + error.message);
    return false;
  }
}

function displayError(message) {
  const errorElement = document.getElementById('error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  } else {
    console.error('Error element not found');
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

function redirectToWelcomeBackPage() {
  setTimeout(() => {
    window.location.href = 'welcome-back.html';
  }, 2000); // Redirect after 2 seconds
}