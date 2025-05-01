namespace Orbis.Web.Models
{
    public class VisitedCountry
    {
        public int Id { get; set; }
        public string CountryCode { get; set; } = string.Empty;
        public string UserId { get; set; } = "anonymous"; // Default to anonymous user
    }
}
