namespace Kutuphane_Servisi.Models
{
    public class PublisherRegisterDto
    {
        public string PublisherName { get; set; }       
        public string AuthorizedPersonName { get; set; } 
        public string Address { get; set; }             
        public string Email { get; set; }               
        public string Username { get; set; }           
        public string Password { get; set; }           
        public string? Website { get; set; }            
        public string Role { get; set; } = "publisher";  
    }
} 