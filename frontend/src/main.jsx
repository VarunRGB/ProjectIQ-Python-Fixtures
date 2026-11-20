import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [message, setMessage] = React.useState('Checking backend...');
  React.useEffect(() => {
    fetch('/api/sqlite-check')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable');
        return response.json();
      })
      .then((data) => setMessage(data.sqlite === true ? 'SQLite verified' : 'SQLite unavailable'))
      .catch(() => setMessage('Backend unavailable'));
  }, []);
  return React.createElement('main', null,
    React.createElement('h1', null, 'ProjectIQ D4 pilot'),
    React.createElement('p', null, message));
}

createRoot(document.getElementById('root')).render(React.createElement(App));
