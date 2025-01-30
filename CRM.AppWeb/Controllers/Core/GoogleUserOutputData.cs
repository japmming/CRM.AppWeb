namespace GS1Peru.AppWeb.Controllers.Core
{
    public class GoogleUserOutputData
    {
        public string id { get; set; }
        public string email { get; set; }
        public bool verified_email { get; set; }
        public string name { get; set; }
        public string given_name { get; set; }
        public string family_name { get; set; }
        public string picture { get; set; }
        public string locale { get; set; }
    }
}

/*
 {
  "id": "107362119848347454517",
  "email": "natcodee.house@gmail.com",
  "verified_email": true,
  "name": "Jhony Frank Llontop Caballero",
  "given_name": "Jhony Frank",
  "family_name": "Llontop Caballero",
  "picture": "https://lh3.googleusercontent.com/a/ALm5wu15EFsw1MJSo7rJ7GhoRX6rJi1q9AiKUVjuxP5d=s96-c",
  "locale": "es"
}
 */