// File: /src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from './firebase';

// Route pages
import Login from './routes/Login';
import IdeaSpace from './routes/IdeaSpace';
import ActionItems from './routes/ActionItems';

// Components
import Navigation from './components/Navigation';

/**
 * Protect certain routes. If user isn't logged in, redirect to /login.
 */
function PrivateRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Wait until we know whether user is logged in or not
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Always show the login form (public route). */}
        <Route path="/login" element={<Login user={user} />} />

        {/* Protected routes: Only show if user is logged in. */}
        <Route
          path="/ideas"
          element={
            <PrivateRoute user={user}>
              <>
                <Navigation isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
                <IdeaSpace isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/action-items"
          element={
            <PrivateRoute user={user}>
              <>
                <Navigation isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
                <ActionItems isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
              </>
            </PrivateRoute>
          }
        />

        {/* Root path: go to /ideas if logged in, otherwise /login */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/ideas" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;