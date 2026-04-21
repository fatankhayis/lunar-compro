import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';
import { Toaster } from 'react-hot-toast';
import { I18nProvider } from './i18n/I18nProvider.jsx';

function App() {
  return (
    <I18nProvider>
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
    </I18nProvider>
  );
}

export default App;
