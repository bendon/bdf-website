import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import NavbarWithCTA from './components/layout/NavbarWithCTA';
import BitPointLandingPage from './pages/BitPointLandingPage';
import AccountPage from './pages/AccountPage';
import SignInModal from './components/modals/SignInModal';

function App() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <UserProvider>
      <NavbarWithCTA onSignInModalOpen={() => setShowSignInModal(true)} />
      <Routes>
        <Route path="/" element={<BitPointLandingPage />} />
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
  );
}

export default App;