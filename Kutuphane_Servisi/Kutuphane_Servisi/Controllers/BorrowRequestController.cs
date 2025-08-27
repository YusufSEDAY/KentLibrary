using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kutuphane_Servisi.Context;
using Kutuphane_Servisi.Models;

namespace Kutuphane_Servisi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowRequestController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BorrowRequestController(BookDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BorrowRequestListDto>>> GetAll()
        {
            var requests = await _context.BorrowRequests
                .Include(br => br.User)
                .Include(br => br.Book)
                .Include(br => br.Publisher)
                .Select(br => new BorrowRequestListDto
                {
                    Id = br.Id,
                    UserId = br.UserId,
                    UserName = $"{br.User.FirstName} {br.User.LastName}",
                    BookId = br.BookId,
                    BookTitle = br.Book.title,
                    PublisherId = br.PublisherId,
                    PublisherName = br.Publisher.PublisherName ?? "Bilinmeyen Yayınevi",
                    RequestDate = br.RequestDate,
                    Status = br.Status,
                    BorrowStartDate = br.BorrowStartDate,
                    BorrowEndDate = br.BorrowEndDate,
                    ApprovedDate = br.ApprovedDate,
                    RejectedDate = br.RejectedDate,
                    ReturnDate = br.ReturnDate,
                    IsReturned = br.IsReturned,
                    Notes = br.Notes
                })
                .ToListAsync();

            return Ok(requests);
        }

       
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BorrowRequestListDto>>> GetUserRequests(int userId)
        {
            var requests = await _context.BorrowRequests
                .Include(br => br.User)
                .Include(br => br.Book)
                .Include(br => br.Publisher)
                .Where(br => br.UserId == userId)
                .Select(br => new BorrowRequestListDto
                {
                    Id = br.Id,
                    UserId = br.UserId,
                    UserName = $"{br.User.FirstName} {br.User.LastName}",
                    BookId = br.BookId,
                    BookTitle = br.Book.title,
                    PublisherId = br.PublisherId,
                    PublisherName = br.Publisher.PublisherName ?? "Bilinmeyen Yayınevi",
                    RequestDate = br.RequestDate,
                    Status = br.Status,
                    BorrowStartDate = br.BorrowStartDate,
                    BorrowEndDate = br.BorrowEndDate,
                    ApprovedDate = br.ApprovedDate,
                    RejectedDate = br.RejectedDate,
                    ReturnDate = br.ReturnDate,
                    IsReturned = br.IsReturned,
                    Notes = br.Notes
                })
                .ToListAsync();

            return Ok(requests);
        }

       
        [HttpGet("publisher/{publisherId}")]
        public async Task<ActionResult<IEnumerable<BorrowRequestListDto>>> GetPublisherRequests(int publisherId)
        {
            var requests = await _context.BorrowRequests
                .Include(br => br.User)
                .Include(br => br.Book)
                .Include(br => br.Publisher)
                .Where(br => br.PublisherId == publisherId)
                .Select(br => new BorrowRequestListDto
                {
                    Id = br.Id,
                    UserId = br.UserId,
                    UserName = $"{br.User.FirstName} {br.User.LastName}",
                    BookId = br.BookId,
                    BookTitle = br.Book.title,
                    PublisherId = br.PublisherId,
                    PublisherName = br.Publisher.PublisherName ?? "Bilinmeyen Yayınevi",
                    RequestDate = br.RequestDate,
                    Status = br.Status,
                    BorrowStartDate = br.BorrowStartDate,
                    BorrowEndDate = br.BorrowEndDate,
                    ApprovedDate = br.ApprovedDate,
                    RejectedDate = br.RejectedDate,
                    ReturnDate = br.ReturnDate,
                    IsReturned = br.IsReturned,
                    Notes = br.Notes
                })
                .ToListAsync();

            return Ok(requests);
        }

        
        [HttpPost]
        public async Task<IActionResult> Create(CreateBorrowRequestDto dto)
        {
            try
            {
                
                var userId = dto.UserId;

                
                var book = await _context.Books.FindAsync(dto.BookId);
                if (book == null)
                {
                    return BadRequest("Kitap bulunamadı.");
                }

                
                int publisherId;
                if (dto.PublisherId > 0)
                {
                    publisherId = dto.PublisherId;
                }
                else
                {
                    
                    var publisher = await _context.Users
                        .FirstOrDefaultAsync(u => u.Role == "publisher" && 
                            (u.PublisherName == book.publisher || 
                             (u.PublisherName != null && book.publisher != null && u.PublisherName.Contains(book.publisher)) || 
                             (u.PublisherName != null && book.publisher != null && book.publisher.Contains(u.PublisherName))));
                    
                    if (publisher == null)
                    {
                        return BadRequest("Bu kitabın yayınevi sistemde bulunamadı.");
                    }
                    
                    publisherId = publisher.ID;
                }

                
                var existingRequest = await _context.BorrowRequests
                    .FirstOrDefaultAsync(br => br.UserId == userId && br.BookId == dto.BookId && br.Status == "Pending");

                if (existingRequest != null)
                {
                    return BadRequest("Bu kitap için zaten bekleyen bir talebiniz bulunmaktadır.");
                }

                var request = new BorrowRequest
                {
                    UserId = userId,
                    BookId = dto.BookId,
                    PublisherId = publisherId,
                    RequestDate = DateTime.Now,
                    Status = "Pending",
                    BorrowStartDate = dto.BorrowStartDate,
                    BorrowEndDate = dto.BorrowEndDate,
                    Notes = dto.Notes
                };

                _context.BorrowRequests.Add(request);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Ödünç alma talebi başarıyla oluşturuldu.",
                    requestId = request.Id 
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Hata oluştu: {ex.Message}");
            }
        }

       
        [HttpGet("{id}")]
        public async Task<ActionResult<BorrowRequestListDto>> GetById(int id)
        {
            var request = await _context.BorrowRequests
                .Include(br => br.User)
                .Include(br => br.Book)
                .Include(br => br.Publisher)
                .FirstOrDefaultAsync(br => br.Id == id);

            if (request == null)
            {
                return NotFound();
            }

            var dto = new BorrowRequestListDto
            {
                Id = request.Id,
                UserId = request.UserId,
                UserName = $"{request.User.FirstName} {request.User.LastName}",
                BookId = request.BookId,
                BookTitle = request.Book.title,
                PublisherId = request.PublisherId,
                PublisherName = request.Publisher.PublisherName ?? "Bilinmeyen Yayınevi",
                RequestDate = request.RequestDate,
                Status = request.Status,
                BorrowStartDate = request.BorrowStartDate,
                BorrowEndDate = request.BorrowEndDate,
                ApprovedDate = request.ApprovedDate,
                RejectedDate = request.RejectedDate,
                ReturnDate = request.ReturnDate,
                IsReturned = request.IsReturned,
                Notes = request.Notes
            };

            return Ok(dto);
        }

        
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateBorrowRequestDto dto)
        {
            var request = await _context.BorrowRequests.FindAsync(id);

            if (request == null)
            {
                return NotFound();
            }

            request.Status = dto.Status;
            request.Notes = dto.Notes;

            if (dto.Status == "Approved")
            {
                request.ApprovedDate = DateTime.Now;
            }
            else if (dto.Status == "Rejected")
            {
                request.RejectedDate = DateTime.Now;
            }
            else if (dto.Status == "Returned")
            {
                request.ReturnDate = DateTime.Now;
                request.IsReturned = true;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = await _context.BorrowRequests.FindAsync(id);

            if (request == null)
            {
                return NotFound();
            }

            _context.BorrowRequests.Remove(request);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 