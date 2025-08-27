using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Kutuphane_Servisi.Models
{
    public class BorrowRequest
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public int BookId { get; set; }
        public int PublisherId { get; set; }
        
        public DateTime RequestDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "Pending"; 
        
        public DateTime? ApprovedDate { get; set; }
        public DateTime? RejectedDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public bool IsReturned { get; set; } = false;
        
        public DateTime? BorrowStartDate { get; set; }
        public DateTime? BorrowEndDate { get; set; }
        
        public string? Notes { get; set; }

        
        [JsonIgnore]
        public User User { get; set; }
        
        [JsonIgnore]
        public Book Book { get; set; }
        
        [JsonIgnore]
        public User Publisher { get; set; }
    }
} 