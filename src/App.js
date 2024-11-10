import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import NavbarWithCTA from './components/layout/NavbarWithCTA';
import BitPointLandingPage from './pages/BitPointLandingPage';
import AccountPage from './pages/AccountPage';
import GetStartedPage from './pages/GetStartedPage';
import SignInModal from './components/modals/SignInModal';

// Using environment variable to load Google Client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <NavbarWithCTA onSignInModalOpen={() => setShowSignInModal(true)} />
        <Routes>
          <Route path="/" element={<BitPointLandingPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
        />
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
