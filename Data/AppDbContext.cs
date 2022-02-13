using Expenses.Models;
using Microsoft.EntityFrameworkCore;

namespace Expenses.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
           : base(options)
        { 
        }
        public DbSet<Entry> Entries { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
