// import React from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { signOut } from 'firebase/auth';
// import { auth } from '../../firebase';

// const HomePage = () => {
//   const { currentUser } = useAuth();

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//     } catch (e) {
//       console.error('Sign out failed:', e);
//     }
//   };

//   return (
//     <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>
//       <h1>Welcome to the MintAI Homepage!</h1>
//       <p>This is the main page of your application.</p>
//       {currentUser && (
//         <div style={{ marginTop: 20 }}>
//           <div>Signed in as: {currentUser.displayName || currentUser.email}</div>
//           <button onClick={handleSignOut} style={{ marginTop: 12, padding: '8px 14px', borderRadius: 8, background: '#ef4444', color: 'white' }}>
//             Sign Out
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;