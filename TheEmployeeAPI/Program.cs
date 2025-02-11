using Microsoft.EntityFrameworkCore;
using TheEmployeeAPI.Data;
using TheEmployeeAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddControllers(); 

var app = builder.Build();

SeedDatabase(app);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();

void SeedDatabase(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    // Check if data already exists
    if (!db.Employees.Any())
    {
        var jeffrey = new Employee
        {
            Id = 1,
            FirstName = "Jeffrey",
            LastName = "Wells",
            Roles = new List<string> { "Director" }
        };

        var victor = new Employee
        {
            Id = 2,
            FirstName = "Victor",
            LastName = "Atkins",
            Roles = new List<string> { "Director" },
            ManagerId = 1 // Jeffrey's ID
        };

        var kelli = new Employee
        {
            Id = 3,
            FirstName = "Kelli",
            LastName = "Hamilton",
            Roles = new List<string> { "Director" },
            ManagerId = 1
        };

        db.Employees.AddRange(
            jeffrey,
            victor,
            kelli,
            new Employee
            {
                Id = 4,
                FirstName = "Adam",
                LastName = "Braun",
                Roles = new List<string> { "IT", "Support" },
                ManagerId = 2  // Victor's ID
            },
            new Employee
            {
                Id = 5,
                FirstName = "Brian",
                LastName = "Cruz",
                Roles = new List<string> { "Accounting" },
                ManagerId = 2  // Victor's ID
            },
            new Employee
            {
                Id = 6,
                FirstName = "Kristen",
                LastName = "Floyd",
                Roles = new List<string> { "Analyst", "Sales" },
                ManagerId = 2  // Victor's ID
            },
            new Employee
            {
                Id = 7,
                FirstName = "Lois",
                LastName = "Martinez",
                Roles = new List<string> { "Support" },
                ManagerId = 3  // Kelli's ID
            },
            new Employee
            {
                Id = 8,
                FirstName = "Michael",
                LastName = "Lind",
                Roles = new List<string> { "Analyst" },
                ManagerId = 3  // Kelli's ID
            },
            new Employee
            {
                Id = 9,
                FirstName = "Eric",
                LastName = "Bay",
                Roles = new List<string> { "IT", "Sales" },
                ManagerId = 3  // Kelli's ID
            },
            new Employee
            {
                Id = 10,
                FirstName = "Brandon",
                LastName = "Young",
                Roles = new List<string> { "Accounting" },
                ManagerId = 3  // Kelli's ID
            }

        );

        db.SaveChanges();
    }
}
