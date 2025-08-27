namespace Kutuphane_Servisi.Models
{
    public class User
    {
        public int ID { get; set; }
        //Kayıt Bilgileri
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        //Giriş Bilgileri
        public string Username { get; set; }
        public string PasswordHash { get; set; }// Şifreyi hash li tutacağız.
        public string Role { get; set; }
        //Sistem Bilgileri
        public DateTime CreatedAt { get; set; } = DateTime.Now; 
        
        // Yayın evi bilgileri 
        public string? PublisherName { get; set; }
        public string? Website { get; set; }
    }
}
