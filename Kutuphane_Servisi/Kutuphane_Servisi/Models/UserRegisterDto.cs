namespace Kutuphane_Servisi.Models
{
    public class UserRegisterDto
    {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public DateTime BirthDate { get; set; }
            public string Email { get; set; }
            public string Address { get; set; }

            public string Username { get; set; }
            public string Password { get; set; }
            public string Role { get; set; } 
    }

    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UserUpdateDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public string? PublisherName { get; set; }
        public string? Website { get; set; }
    }
}
