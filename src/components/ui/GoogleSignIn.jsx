// import React, { useState, useEffect } from "react";
// import { signInWithPopup } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { auth, provider, db } from '../../firebase';

// function GoogleSignIn() {
//   const [loading, setLoading] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Log Firebase initialization on component mount
//   useEffect(() => {
//     console.log("Firebase Auth initialized:", auth);
//   }, []);

//   const handleSignIn = async () => {
//     try {
//       setLoading(true);
//       setError("");
      
//       console.log("Attempting Google Sign-in...");
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       console.log("Sign-in successful. User:", user.email);
      
//       // Try to store user data in Firestore (non-blocking)
//       try {
//         console.log("Attempting to store user data in Firestore...");
//         await setDoc(doc(db, "users", user.uid), {
//           email: user.email,
//           name: user.displayName,
//           photoURL: user.photoURL,
//           createdAt: new Date().toISOString()
//         });
//         console.log("User data stored successfully in Firestore");
//       } catch (firestoreError) {
//         // Firestore errors are non-blocking - user is still signed in
//         console.warn("Firestore save failed (non-critical):", firestoreError);
//         console.warn("This is okay - authentication worked, but user data wasn't saved to database.");
//       }

//       setUserEmail(user.email);
      
//       // Redirect to homepage on successful sign-in
//       navigate("/");
//     } catch (error) {
//       console.error("Google Sign-in error:", error);
//       console.error("Error code:", error.code);
//       console.error("Error message:", error.message);
      
//       // Show user-friendly error message
//       if (error.code === 'auth/configuration-not-found') {
//         setError("Firebase Auth is not properly configured. Please check Firebase Console settings.");
//       } else if (error.code === 'auth/popup-blocked') {
//         setError("Popup was blocked. Please allow popups for this site.");
//       } else if (error.code === 'auth/popup-closed-by-user') {
//         setError("Sign-in cancelled.");
//       } else {
//         setError(`Sign-in failed: ${error.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 text-center">
//       <button
//         onClick={handleSignIn}
//         disabled={loading}
//         className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
//       >
//         {loading ? "Signing in..." : "Sign in with Google"}
//       </button>

//       {error && (
//         <p className="mt-3 text-red-500 text-sm">
//           {error}
//         </p>
//       )}

//       {userEmail && (
//         <p className="mt-3 text-green-500">
//           Welcome, {userEmail}! 🎉
//         </p>
//       )}
//     </div>
//   );
// }

// export default GoogleSignIn;

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, provider, db } from '../../firebase';

function GoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 2. Initialize the hook

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      });

      // 3. Navigate to the main dashboard on success!
      navigate('/main-dashboard'); 

    } catch (error) {
      console.error("Google Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-center">
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
      >
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
}

export default GoogleSignIn;