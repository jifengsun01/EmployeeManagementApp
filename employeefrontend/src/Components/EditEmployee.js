import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

function EditEmployee() {
  const { id } = useParams(); // Get the employee ID from the URL
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [managerId, setManagerId] = useState("");
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  // Fetch employee data
  const fetchEmployee = async (id) => {
    try {
      const response = await axios.get(`/api/employee/${id}`);
      const employee = response.data;
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setRoles(employee.roles);
      setManagerId(employee.managerId || "");
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  // Fetch managers and exclude the current employee
  const fetchManagers = async (currentEmployeeId) => {
    try {
      const response = await axios.get("/api/employee/managers");
      // Filter out the current employee from the managers list
      const filteredManagers = response.data.filter(
        (manager) => manager.id !== parseInt(currentEmployeeId)
      );
      setManagers(filteredManagers);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  // UseEffect to fetch data when the component mounts or the ID changes
  useEffect(() => {
    fetchEmployee(id);
    fetchManagers(id); // Pass the current employee ID to exclude them from the managers list
  }, [id]);

  const validateFields = () => {
    const validationErrors = {};
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      validationErrors.firstName = "First Name must contain only letters.";
    }
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      validationErrors.lastName = "Last Name must contain only letters.";
    }
    if (roles.length === 0) {
      validationErrors.roles = "At least one role must be selected.";
    }
    if (!managerId) {
      validationErrors.managerId = "Please select a manager.";
    }
    return validationErrors;
  };

  const handleSave = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedEmployee = {
      id: parseInt(id),
      firstName,
      lastName,
      roles,
      managerId: managerId ? parseInt(managerId) : null,
    };

    axios
      .put(`/api/employee/${id}`, updatedEmployee)
      .then(() => {
        alert("Employee updated successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
        setBackendError(error.response?.data?.message || "Failed to update employee. Please try again.");
      });
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleRoleChange = (role, isChecked) => {
    if (isChecked) {
      setRoles([...roles, role]);
    } else {
      setRoles(roles.filter((r) => r !== role));
    }
  };

  const clearFieldError = (field, value) => {
    if (errors[field]) {
      const updatedErrors = { ...errors };
      if (field === "firstName" && /^[a-zA-Z]+$/.test(value)) {
        delete updatedErrors[field];
      }
      if (field === "lastName" && /^[a-zA-Z]+$/.test(value)) {
        delete updatedErrors[field];
      }
      if (field === "roles" && roles.length > 0) {
        delete updatedErrors[field];
      }
      if (field === "managerId" && managerId) {
        delete updatedErrors[field];
      }
      setErrors(updatedErrors);
    }
  };

  const inputFieldWidth = 300;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        backgroundColor: "#f7f7f7",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2>Edit Employee</h2>
        {backendError && <div style={{ color: "red" }}>{backendError}</div>}

        {/* Manager Dropdown */}
        <div>
          <TextField
            select
            label="Select Manager"
            value={managerId}
            onChange={(e) => {
              setManagerId(e.target.value);
              clearFieldError("managerId", e.target.value);
            }}
            error={!!errors.managerId}
            helperText={errors.managerId}
            variant="outlined"
            sx={{ width: inputFieldWidth }}
            margin="normal"
          >
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* First Name */}
        <div>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              clearFieldError("firstName", e.target.value);
            }}
            error={!!errors.firstName}
            helperText={errors.firstName}
            variant="outlined"
            sx={{ width: inputFieldWidth }}
            margin="normal"
          />
        </div>

        {/* Last Name */}
        <div>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              clearFieldError("lastName", e.target.value);
            }}
            error={!!errors.lastName}
            helperText={errors.lastName}
            variant="outlined"
            sx={{ width: inputFieldWidth }}
            margin="normal"
          />
        </div>

        {/* Roles Selection */}
        <div style={{ textAlign: "left", margin: "20px auto", maxWidth: "300px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Roles:</label>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              height: "150px",
              overflowY: "scroll",
            }}
          >
            {["Accounting", "Analyst", "Director", "IT", "Sales", "Support"].map((role) => (
              <div key={role} style={{ marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  id={`role-${role}`}
                  value={role}
                  checked={roles.includes(role)}
                  onChange={(e) => handleRoleChange(role, e.target.checked)}
                />
                <label htmlFor={`role-${role}`} style={{ marginLeft: "5px" }}>
                  {role}
                </label>
              </div>
            ))}
          </div>
          {errors.roles && <div style={{ color: "red" }}>{errors.roles}</div>}
        </div>

        {/* Buttons */}
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSave} style={{ marginRight: "10px" }}>
            Save
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditEmployee;