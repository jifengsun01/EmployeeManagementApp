
namespace TheEmployeeAPI.Models {
    public class Employee
        {
            public int Id { get; set; }
            public required string FirstName { get; set; }
            public required string LastName { get; set; }
            public required List<string> Roles { get; set; } = new List<string>();
            public int? ManagerId { get; set; }
            public Employee? Manager { get; set; }
        }

}
    