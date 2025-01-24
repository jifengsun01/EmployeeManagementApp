import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EmployeeList from "./Components/EmployeeList";
import AddEmployee from "./Components/AddEmployee";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Employee Management</h1>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add-employee" element={<AddEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;