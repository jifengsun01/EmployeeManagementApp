using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;
using TheEmployeeAPI.Models;

namespace TheEmployeeAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Manager)
                .WithMany()
                .HasForeignKey(e => e.ManagerId);

            modelBuilder.Entity<Employee>()
                .Property(e => e.Roles)
                .HasConversion(
                    new ValueConverter<List<string>, string>(
                        v => JsonSerializer.Serialize(v, default(JsonSerializerOptions)),
                        v => JsonSerializer.Deserialize<List<string>>(v, default(JsonSerializerOptions)) ?? new List<string>()
                    )
                );
        }

    }
}