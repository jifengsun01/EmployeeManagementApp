import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [managerId, setManagerId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchManagers();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("/api/employee")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };

  const fetchManagers = () => {
    axios
      .get("/api/employee/managers")
      .then((response) => {
        setManagers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching managers:", error);
      });
  };

  const handleManagerChange = (e) => {
    const selectedManagerId = e.target.value;
    setManagerId(selectedManagerId);

    const url = selectedManagerId ? `/api/employee?managerId=${selectedManagerId}` : "/api/employee";

    axios
      .get(url)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees by manager:", error);
      });
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    axios
      .delete(`/api/employee/${employeeToDelete.id}`)
      .then(() => {
        fetchEmployees(); // Refresh the employee list
        fetchManagers(); // Refresh manager list
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
        setDeleteDialogOpen(false);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={2}
    >
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Employee List</h2>

      {/* Manager selection dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "18px", fontWeight: "bold", marginRight: "10px" }}>Manager:</label>
        <select
          value={managerId}
          onChange={handleManagerChange}
          style={{
            width: "300px",
            height: "40px",
            fontSize: "16px",
            textAlign: "center", 
            textAlignLast: "center", 
          }}
        >
          <option value="">---Select Manager---</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.firstName} {manager.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Employee table */}
      <TableContainer component={Paper} sx={{ width: "70%", marginBottom: 2 }}>
        <Table sx={{ border: "2px solid #000" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  border: "2px solid #000",
                  fontSize: "18px", 
                }}
              >
                Employee ID
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  border: "2px solid #000",
                  fontSize: "18px",
                }}
              >
                First Name
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  border: "2px solid #000",
                  fontSize: "18px",
                }}
              >
                Last Name
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  border: "2px solid #000",
                  fontSize: "18px",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell
                  sx={{
                    textAlign: "center",
                    border: "2px solid #000",
                    fontSize: "16px", 
                  }}
                >
                  {employee.id}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    border: "2px solid #000",
                    fontSize: "16px",
                  }}
                >
                  {employee.firstName}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    border: "2px solid #000",
                    fontSize: "16px",
                  }}
                >
                  {employee.lastName}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    border: "2px solid #000",
                    fontSize: "16px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(employee)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Employee button */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/add-employee"
        sx={{
          width: "200px",
          fontSize: "16px", 
        }}
      >
        Add Employee
      </Button>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {employeeToDelete?.firstName} {employeeToDelete?.lastName}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeList;
