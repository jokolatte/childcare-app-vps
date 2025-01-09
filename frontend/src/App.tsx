import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ClassroomForm from "./components/ClassroomForm";
import AddChild from "./components/AddChild";
import EditChild from './components/EditChild';
import EditFamily from './components/EditFamily';
import TransitionsPage from './components/TransitionsPage';
import WithdrawalManagementPage from './components/WithdrawalManagementPage';


const App: React.FC = () => {
    return (
        <Router>
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1, padding: "20px" }}>
                    <Routes>
                        <Route path="/" element={<div>Welcome to the Dashboard</div>} />
                        <Route path="/classrooms" element={<ClassroomForm />} />
                        <Route path="/add-child" element={<AddChild />} />
                        <Route path="/edit-child" element={<EditChild />} />
                        <Route path="/edit-family" element={<EditFamily />} />
                        <Route path="/transitions" element={<TransitionsPage />} />
                        <Route path="/withdrawals" element={<WithdrawalManagementPage />} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
