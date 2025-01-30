namespace GS1Peru.Core.Entities.IP
{
    public class IpProperties
    {
        public string Status { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public string Region { get; set; }
        public string RegionName { get; set; }
        public string City { get; set; }
        public string Zip { get; set; }
        public string Lat { get; set; }
        public string Lon { get; set; }
        public string TimeZone { get; set; }
        public string ISP { get; set; }
        public string ORG { get; set; }
        public string AS { get; set; }
        public string Query { get; set; }

        public IpProperties()
        {
            Country = string.Empty;
            CountryCode = string.Empty;
            Region = string.Empty;
            RegionName = string.Empty;
            City = string.Empty;
            Zip = string.Empty;
            Lat = string.Empty;
            Lon = string.Empty;
            TimeZone = string.Empty;
            ISP = string.Empty;
            ORG = string.Empty;
            AS = string.Empty;
        }

    }
}
