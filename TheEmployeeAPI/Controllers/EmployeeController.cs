using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheEmployeeAPI.Data;
using TheEmployeeAPI.Models;

namespace TheEmployeeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        // Get employees with optional filtering by ManagerId
        [HttpGet]
        public async Task<IActionResult> GetEmployees([FromQuery] int? managerId)
        {
            if (managerId.HasValue)
            {
                var employees = await _context.Employees
                    .Where(e => e.ManagerId == managerId.Value)
                    .ToListAsync();
                return Ok(employees);
            }
            return Ok(await _context.Employees.ToListAsync());
        }

        // Get a list of all managers
        [HttpGet("managers")]
        public async Task<IActionResult> GetManagers()
        {
            var employees = await _context.Employees.ToListAsync(); // Fetch all employees from the database
            var managersByRole = employees
                .Where(e => e.Roles.Contains("Director"))
                .ToList();

            return Ok(managersByRole);
        }
        
        // Add a new employee
        [HttpPost]
        public async Task<IActionResult> AddEmployee([FromBody] Employee employee)
        {
            // Check if an employee with the same ID already exists
            var existingEmployee = await _context.Employees.FindAsync(employee.Id);
            if (existingEmployee != null)
            {
                return BadRequest(new { message = $"An employee with ID {employee.Id} already exists." });
            }

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEmployees), new { id = employee.Id }, employee);
        }

        // Delete an employee by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id) 
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) {
                return NotFound(new {message = $"Employee with ID {id} not found"});
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return Ok(new {message = $"Employee with ID {id} has been deleted"});
        }
    }
}
