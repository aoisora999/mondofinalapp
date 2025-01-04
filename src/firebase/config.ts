import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCdOjQIKzOmfhbQSzekuRoywl05l5CVIZQ",
    authDomain: "mondo-82764.firebaseapp.com",
    projectId: "mondo-82764",
    storageBucket: "mondo-82764.firebasestorage.app",
    messagingSenderId: "1090721275889",
    appId: "1:1090721275889:web:62384940070384accc2e50"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Initialize security settings with default PIN
export const initializeSecuritySettings = async () => {
  try {
    console.log('Starting security settings initialization...');
    const securityRef = doc(db, 'security', 'settings');
    const securityDoc = await getDoc(securityRef);
    
    if (!securityDoc.exists()) {
      console.log('No security settings found, creating default...');
      await setDoc(securityRef, {
        pin: '0720',  // Default PIN
        lastUpdated: new Date().toISOString()
      });
      console.log('Security settings initialized successfully');
    } else {
      console.log('Security settings already exist');
    }
  } catch (error) {
    console.error('Error initializing security settings:', error);
    // Add more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  }
}

// Function to verify PIN with better error handling
export const verifyPin = async (inputPin: string) => {
  try {
    console.log('Verifying PIN...');
    const securityRef = doc(db, 'security', 'settings');
    const securityDoc = await getDoc(securityRef);
    
    if (securityDoc.exists()) {
      const isValid = securityDoc.data().pin === inputPin;
      console.log('PIN verification result:', isValid);
      return isValid;
    }
    console.log('No security document found');
    return false;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    return false;
  }
}

// Add this new function to update the PIN
export const updateSecurityPin = async (newPin: string) => {
  try {
    console.log('Updating security PIN...');
    const securityRef = doc(db, 'security', 'settings');
    await setDoc(securityRef, {
      pin: newPin,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log('PIN updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating PIN:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    throw error; // Re-throw to handle in the component
  }
} 