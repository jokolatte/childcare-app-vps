import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TestAPI from './TestAPI';
import ClassroomForm from './components/ClassroomForm.jsx';

function App() {
  return (
    <Router>
      <div>
        <h1>Childcare App</h1>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/classrooms">Classroom Form</a>
            </li>
          </ul>
        </nav>
        <hr />
      </div>
      <Routes>
        <Route path="/" element={<div>Welcome to the Childcare App</div>} />
        <Route path="/classrooms" element={<ClassroomForm />} />
        <Route path="/test-api" element={<div><h2>Test API Integration</h2><TestAPI /></div>} />
      </Routes>
    </Router>
  );
}

export default App;
