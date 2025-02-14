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


        // Get a single employee by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }
            return Ok(employee);
        }


        // Update an existing employee
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
        {
            if (id != updatedEmployee.Id)
            {
                return BadRequest(new { message = "Employee ID mismatch." });
            }

            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            // Update the employee's properties
            existingEmployee.FirstName = updatedEmployee.FirstName;
            existingEmployee.LastName = updatedEmployee.LastName;
            existingEmployee.Roles = updatedEmployee.Roles;
            existingEmployee.ManagerId = updatedEmployee.ManagerId;

            _context.Entry(existingEmployee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Employees.Any(e => e.Id == id))
                {
                    return NotFound(new { message = $"Employee with ID {id} not found." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // 204 No Content is typically returned for successful updates
        }
    }
}
