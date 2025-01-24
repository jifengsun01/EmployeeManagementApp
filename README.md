# Employee Management Application

This Employee Management application provides functionality to manage employees, view their details, and add new employees through a user-friendly interface. 

## Table of Contents

- [Employee Management Application](#employee-management-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech-stack Used](#tech-stack-used)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Database Design](#database-design)
    - [`Employee`](#employee)
  - [Application Architecture](#application-architecture)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Future Enhancements](#future-enhancements)
  - [Demo](#demo)

---

## Features

- **Employee Management**: Add, view, and manage employee details.
- **Manager Filtering**: Filter employees by their respective managers.
- **Data Storage**: Persist employee data using SQLite database.
- **Separation of Concerns**: Clear division of responsibilities between the data, business, and UI layers.
- **Modern UI**: Responsive frontend design using React and Material-UI.
- **RESTful API**: Efficient and scalable API endpoints for employee management.

---

## Tech-stack Used

### Backend
- **C#/.NET Core**: For API and business logic implementation.
- **Entity Framework Core**: For database management and object-relational mapping.
- **SQLite**: Lightweight database for storing application data.

### Frontend
- **React.js**: For building the user interface.
- **Material-UI**: For responsive and styled components.
- **Axios**: For making API requests.

---

## Database Design

The database consists of the following table:

### `Employee`
- **Id** (Primary Key): Unique identifier for each employee.
- **FirstName**: Employee's first name.
- **LastName**: Employee's last name.
- **Roles**: List of roles assigned to the employee (e.g., "Director", "IT").
- **ManagerId** (Foreign Key): References the `Id` of the employee's manager.
- **Manager**: Navigation property for the manager.

Referential integrity is maintained through the foreign key `ManagerId`.

---

## Application Architecture

The application is divided into three layers:
1. **Data Layer**: Handles database operations using Entity Framework Core.
2. **Business Layer**: Contains logic for managing employees.
3. **UI Layer**: Provides an intuitive interface for interacting with the application.

---

## Installation

### Prerequisites
- .NET SDK
- Node.js and npm
- SQLite

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd EmployeeManagementApp

2. Set up the backend:
   ```bash
   cd TheEmployeeAPI
   dotnet run

3. Set up the frontend:
   ```bash
   cd employeefrontend
   npm install
   nmp start

## Future Enhancements
- Add functionality for editing and deleting employees.
- Implement authentication and role-based access control.
- Enhance UI for better accessibility and user experience.


## Demo
- Display employee list and add new employees.
- Input validations
  
  ![AddEmployee](https://github.com/user-attachments/assets/427b92d0-6b61-4db3-951f-53738756b6d2)

- if employee id already exists, throw warning:
  
  ![checkExistingEmployeeId](https://github.com/user-attachments/assets/a4628345-0d9e-4180-aeca-4ce05a60a117)

- Add employees with Director (manager) roles. Newly added employees with management role will also be displayed in the drowdown.
  
  ![AddManager](https://github.com/user-attachments/assets/af5e9a6d-c47f-4252-8ef8-f1ea252455e3)




