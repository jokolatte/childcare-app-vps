import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Use Link instead of <a>
import './App.css';
import TestAPI from './TestAPI';
import ClassroomForm from './components/ClassroomForm';

function App() {
  return (
    <Router>
      <div>
        <h1>Childcare App</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link> {/* Replaced <a> with <Link> */}
            </li>
            <li>
              <Link to="/classrooms">Classroom Form</Link>
            </li>
          </ul>
        </nav>
        <hr />
      </div>
      <Routes>
        <Route path="/" element={<div>Welcome to the Childcare App</div>} />
        <Route path="/classrooms" element={<ClassroomForm />} />
        <Route
          path="/test-api"
          element={
            <div>
              <h2>Test API Integration</h2>
              <TestAPI />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
