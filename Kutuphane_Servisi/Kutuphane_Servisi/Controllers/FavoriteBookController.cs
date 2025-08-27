using Kutuphane_Servisi.Models;
using Kutuphane_Servisi.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Kutuphane_Servisi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteBookController : ControllerBase
    {
        private readonly BookDbContext _context;
        public FavoriteBookController(BookDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<BookListDto>> GetUserFavorites(int userId)
        {
            var favoriteBooks = _context.FavoriteBooks
                .Where(fb => fb.UserID == userId)
                .Include(fb => fb.Book)
                .ThenInclude(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
                .Select(fb => new BookListDto
                {
                    ID = fb.Book.ID,
                    title = fb.Book.title,
                    author = fb.Book.author,
                    summary = fb.Book.summary,
                    publishDate = fb.Book.publishDate,
                    pageCount = fb.Book.pageCount,
                    ISBN = fb.Book.ISBN,
                    publisher = fb.Book.publisher,
                    language = fb.Book.language,
                    cover = fb.Book.cover,
                    categories = fb.Book.BookCategories.Select(bc => bc.Category.Name).ToList()
                })
                .ToList();

            return Ok(favoriteBooks);
        }

        
        [HttpPost("add")]
        public IActionResult AddToFavorites([FromBody] FavoriteBookDto dto)
        {
            
            var user = _context.Users.FirstOrDefault(u => u.ID == dto.UserID);
            var book = _context.Books.FirstOrDefault(b => b.ID == dto.BookID);

            if (user == null)
                return BadRequest("Kullanıcı bulunamadı.");

            if (book == null)
                return BadRequest("Kitap bulunamadı.");

            
            var existingFavorite = _context.FavoriteBooks
                .FirstOrDefault(fb => fb.UserID == dto.UserID && fb.BookID == dto.BookID);

            if (existingFavorite != null)
                return BadRequest("Bu kitap zaten favorilerinizde.");

            var favoriteBook = new FavoriteBook
            {
                UserID = dto.UserID,
                BookID = dto.BookID,
                CreatedAt = DateTime.Now
            };

            _context.FavoriteBooks.Add(favoriteBook);
            _context.SaveChanges();

            return Ok("Kitap favorilere eklendi.");
        }

        
        [HttpDelete("remove")]
        public IActionResult RemoveFromFavorites([FromBody] FavoriteBookDto dto)
        {
            var favoriteBook = _context.FavoriteBooks
                .FirstOrDefault(fb => fb.UserID == dto.UserID && fb.BookID == dto.BookID);

            if (favoriteBook == null)
                return BadRequest("Bu kitap favorilerinizde bulunamadı.");

            _context.FavoriteBooks.Remove(favoriteBook);
            _context.SaveChanges();

            return Ok("Kitap favorilerden çıkarıldı.");
        }

        
        [HttpGet("check/{userId}/{bookId}")]
        public ActionResult<bool> CheckIfFavorite(int userId, int bookId)
        {
            var isFavorite = _context.FavoriteBooks
                .Any(fb => fb.UserID == userId && fb.BookID == bookId);

            return Ok(isFavorite);
        }
    }
} 