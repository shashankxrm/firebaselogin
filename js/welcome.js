import { db, getDoc, doc } from './firebase-config.js';

document.getElementById('continueBtn').addEventListener('click', () => {
  const phoneNumber = document.getElementById('phoneNumber').value;
  checkPhoneNumber(phoneNumber);
});

async function checkPhoneNumber(phoneNumber) {
  try {
    const docRef = doc(db, 'users', phoneNumber);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Phone number exists, proceed to sign-in page
      window.location.href = `signin.html?phoneNumber=${phoneNumber}`;
    } else {
      // Phone number does not exist, proceed to sign-up page
      window.location.href = `signup.html?phoneNumber=${phoneNumber}`;
    }
  } catch (error) {
    console.error('Error checking phone number:', error);
  }
}