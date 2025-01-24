import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Fetch employees from backend
  useEffect(() => {
    axios
      .get("/employees") // Replace with your backend URL
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  // Handle form submission to add an employee
  const handleAddEmployee = () => {
    const newEmployee = { firstName, lastName };
  
    axios
      .post("/employees", newEmployee)
      .then((response) => {
        setEmployees([...employees, response.data]); // Update state with the new employee
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
      });
  
    // Reset input fields
    setFirstName("");
    setLastName("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Management</h1>
      <div>
        <h2>Add Employee</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>
      <div>
        <h2>Employee List</h2>
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              {employee.firstName} {employee.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
