import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            border: '1px solid #AA7BC3',
            padding: '16px',
            color: '#AA7BC3',
          },
          iconTheme: {
            primary: '#9464AC',
            secondary: '#FFFAEE',
          },
        }}
      />
    </Router>
  );
}

export default App;
