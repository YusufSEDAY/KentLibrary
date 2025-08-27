using Kutuphane_Servisi.Models;
using Kutuphane_Servisi.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Kutuphane_Servisi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _context;
        public BookController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<BookListDto>> GetAll()
        {
            var books = _context.Books
                .Include(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
                .Select(b => new BookListDto
                {
                    ID = b.ID,
                    title = b.title,
                    author = b.author,
                    summary = b.summary,
                    publishDate = b.publishDate,
                    pageCount = b.pageCount,
                    ISBN = b.ISBN,
                    publisher = b.publisher,
                    publisherId = b.PublisherId,
                    language = b.language,
                    cover = b.cover,
                    categories = b.BookCategories.Select(bc => bc.Category.Name).ToList()
                })
                .ToList();

            return Ok(books);
        }

        [HttpGet("featured")]
        public ActionResult<IEnumerable<BookListDto>> GetFeaturedBooks()
        {
            // En son eklenen 6 kitabı öne çıkan olarak göster
            var featuredBooks = _context.Books
                .Include(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
                .OrderByDescending(b => b.ID)
                .Take(6)
                .Select(b => new BookListDto
                {
                    ID = b.ID,
                    title = b.title,
                    author = b.author,
                    summary = b.summary,
                    publishDate = b.publishDate,
                    pageCount = b.pageCount,
                    ISBN = b.ISBN,
                    publisher = b.publisher,
                    publisherId = b.PublisherId,
                    language = b.language,
                    cover = b.cover,
                    categories = b.BookCategories.Select(bc => bc.Category.Name).ToList()
                })
                .ToList();

            return Ok(featuredBooks);
        }
        [HttpGet("{id}")]
        public ActionResult<Book> GetById(int id)
        {
            var books = _context.Books.Include(b => b.BookCategories).ThenInclude(bc => bc.Category).FirstOrDefault(b => b.ID == id);
            if (books == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(books);
            }
        }
        [HttpPost]
        public IActionResult Add([FromBody] BookDto dto)
        {
            var book = new Book
            {
                title = dto.title,
                author = dto.author,
                summary = dto.summary,
                publishDate = dto.publishDate,
                pageCount = dto.pageCount,
                ISBN = dto.ISBN,
                publisher = dto.publisher,
                language = dto.language,
                cover = dto.cover,
                BookCategories = dto.categoryIDs?.Select(catId => new BookCategory { CategoryID = catId }).ToList() ?? new List<BookCategory>()
            };

            _context.Books.Add(book);
            _context.SaveChanges();
            return Ok("Kitap eklendi.");
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] BookDto dto)
        {
            var book = _context.Books
                .Include(b => b.BookCategories)
                .FirstOrDefault(b => b.ID == id);

            if (book == null)
                return NotFound();

            
            book.title = dto.title;
            book.author = dto.author;
            book.summary = dto.summary;
            book.publishDate = dto.publishDate;
            book.pageCount = dto.pageCount;
            book.ISBN = dto.ISBN;
            book.publisher = dto.publisher;
            book.language = dto.language;
            book.cover = dto.cover;

            
            book.BookCategories.Clear();
            if (dto.categoryIDs != null)
            {
                foreach (var catId in dto.categoryIDs)
                {
                    book.BookCategories.Add(new BookCategory { BookID = id, CategoryID = catId });
            }
            }

            _context.SaveChanges();
                return Ok("Kitap güncellendi.");
        }
        [HttpDelete("{id}")]
        public ActionResult Delete(int id) 
        {
            var book = _context.Books
                .Include(b => b.BookCategories)
                .FirstOrDefault(b => b.ID == id);
                
            if(book == null) 
            {
                return NotFound("Kitap bulunamadı.");
            }

          
            _context.BookCategories.RemoveRange(book.BookCategories);
            
            
            var favoriteBooks = _context.FavoriteBooks.Where(fb => fb.BookID == id);
            _context.FavoriteBooks.RemoveRange(favoriteBooks);
            
           
            var borrowRequests = _context.BorrowRequests.Where(br => br.BookId == id);
            _context.BorrowRequests.RemoveRange(borrowRequests);
            
           
            _context.Books.Remove(book);
            
            _context.SaveChanges();
            return Ok("Kitap ve ilişkili tüm veriler silindi.");
        }


    }
}
