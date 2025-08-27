namespace Kutuphane_Servisi.Models
{
    public class CreateBorrowRequestDto
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public int PublisherId { get; set; }
        public DateTime? BorrowStartDate { get; set; } 
        public DateTime? BorrowEndDate { get; set; }   
        public string? Notes { get; set; }
    }

    public class UpdateBorrowRequestDto
    {
        public string Status { get; set; } = "Pending";
        public string? Notes { get; set; }
    }

    public class BorrowRequestListDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public int PublisherId { get; set; }
        public string PublisherName { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; }
        
        
        public DateTime? BorrowStartDate { get; set; }
        public DateTime? BorrowEndDate { get; set; }
        
        public DateTime? ApprovedDate { get; set; }
        public DateTime? RejectedDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public bool IsReturned { get; set; }
        public string? Notes { get; set; }
    }
} 