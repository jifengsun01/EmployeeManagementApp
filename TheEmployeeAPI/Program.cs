using Microsoft.EntityFrameworkCore;
using TheEmployeeAPI.Data;
using TheEmployeeAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
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
        var jeffrey = new Employee { FirstName = "Jeffrey", LastName = "Wells", Roles = new List<string> { "Director" } };
        var victor = new Employee { FirstName = "Victor", LastName = "Atkins", Roles = new List<string> { "Director" }, Manager = jeffrey };
        var kelli = new Employee { FirstName = "Kelli", LastName = "Hamilton", Roles = new List<string> { "Director" }, Manager = jeffrey };

        db.Employees.AddRange(
            jeffrey,
            victor,
            kelli,
            new Employee { FirstName = "Adam", LastName = "Braun", Roles = new List<string> { "IT", "Support" }, Manager = victor },
            new Employee { FirstName = "Brian", LastName = "Cruz", Roles = new List<string> { "Accounting" }, Manager = victor },
            new Employee { FirstName = "Kristen", LastName = "Floyd", Roles = new List<string> { "Analyst", "Sales" }, Manager = victor },
            new Employee { FirstName = "Lois", LastName = "Martinez", Roles = new List<string> { "Support" }, Manager = kelli },
            new Employee { FirstName = "Michael", LastName = "Lind", Roles = new List<string> { "Analyst" }, Manager = kelli },
            new Employee { FirstName = "Eric", LastName = "Bay", Roles = new List<string> { "IT", "Sales" }, Manager = kelli },
            new Employee { FirstName = "Brandon", LastName = "Young", Roles = new List<string> { "Accounting" }, Manager = kelli }
        );

        db.SaveChanges();
    }
}
