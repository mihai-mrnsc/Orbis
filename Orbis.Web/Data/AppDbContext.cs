using Microsoft.EntityFrameworkCore;
using Orbis.Web.Models;

namespace Orbis.Web.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<VisitedCountry> VisitedCountries => Set<VisitedCountry>();
    }
}
