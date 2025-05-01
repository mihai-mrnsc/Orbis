using Microsoft.AspNetCore.Mvc;
using Orbis.Web.Data;
using Orbis.Web.Models;

namespace Orbis.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitedCountriesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly string _userId = "anonymous";

        public VisitedCountriesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var countries = _db.VisitedCountries
                .Where(c => c.UserId == _userId)
                .Select(c => c.CountryCode)
                .ToList();
            return Ok(countries);
        }

        [HttpPost("{code}")]
        public IActionResult Add(string code)
        {
            if (!_db.VisitedCountries.Any(c => c.CountryCode == code && c.UserId == _userId))
            {
                _db.VisitedCountries.Add(new VisitedCountry { CountryCode = code, UserId = _userId });
                _db.SaveChanges();
            }
            return Ok();
        }

        [HttpDelete("{code}")]
        public IActionResult Remove(string code)
        {
            var country = _db.VisitedCountries
                .FirstOrDefault(c => c.CountryCode == code && c.UserId == _userId);
            if (country != null)
            {
                _db.VisitedCountries.Remove(country);
                _db.SaveChanges();
            }
            return Ok();
        }

        [HttpDelete]
        public IActionResult ClearAll()
        {
            var countries = _db.VisitedCountries.Where(c => c.UserId == _userId).ToList();
            _db.VisitedCountries.RemoveRange(countries);
            _db.SaveChanges();
            return Ok();
        }

    }
}
