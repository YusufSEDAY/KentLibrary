using Kutuphane_Servisi.Context;
using Kutuphane_Servisi.Models;
using Kutuphane_Servisi.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kutuphane_Servisi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly BookDbContext context_;

        public AuthController(BookDbContext context)
        {
            context_ = context;
        }
        
        [HttpGet]
        public ActionResult<IEnumerable<object>> GetAll()
        {
            var users = context_.Users.Select(u => new
            {
                id = u.ID,
                firstName = u.FirstName,
                lastName = u.LastName,
                username = u.Username,
                email = u.Email,
                role = u.Role,
                birthDate = u.BirthDate,
                address = u.Address,
                publisherName = u.PublisherName,
                website = u.Website,
                createdAt = u.CreatedAt
            }).ToList();
            
            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<object> GetById(int id)
        {
            var user = context_.Users.FirstOrDefault(u => u.ID == id);
            
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            var userResponse = new
            {
                id = user.ID,
                firstName = user.FirstName,
                lastName = user.LastName,
                username = user.Username,
                email = user.Email,
                role = user.Role,
                birthDate = user.BirthDate,
                address = user.Address,
                publisherName = user.PublisherName,
                website = user.Website,
                createdAt = user.CreatedAt
            };

            return Ok(userResponse);
        }

        [HttpGet("username/{username}")]
        public ActionResult<object> GetByUsername(string username)
        {
            var user = context_.Users.FirstOrDefault(u => u.Username == username);
            
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            var userResponse = new
            {
                id = user.ID,
                firstName = user.FirstName,
                lastName = user.LastName,
                username = user.Username,
                email = user.Email,
                role = user.Role,
                birthDate = user.BirthDate,
                address = user.Address,
                publisherName = user.PublisherName,
                website = user.Website,
                createdAt = user.CreatedAt
            };

            return Ok(userResponse);
        }

        [HttpPost("register")]
        public ActionResult Register([FromBody] UserRegisterDto dto)
        {
            var userExists = context_.Users.Any(u => u.Username == dto.Username);
            if (userExists) 
            {
                return BadRequest("Bu Kullanıcı adı zaten alınmış.");
            }

            var emailExists = context_.Users.Any(u => u.Email == dto.Email);
            if (emailExists)
            {
                return BadRequest("Bu E-posta adresi zaten kullanılıyor.");
            }

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                BirthDate = dto.BirthDate,
                Email = dto.Email,
                Address = dto.Address,
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
            };
            
            context_.Users.Add(user);
            context_.SaveChanges();
            
            var userResponse = new
            {
                id = user.ID,
                firstName = user.FirstName,
                lastName = user.LastName,
                username = user.Username,
                email = user.Email,
                role = user.Role,
                createdAt = user.CreatedAt,
                message = "Kayıt Başarılı."
            };
            
            return CreatedAtAction(nameof(GetById), new { id = user.ID }, userResponse);
        }

        [HttpPost("register-publisher")]
        public ActionResult RegisterPublisher([FromBody] PublisherRegisterDto dto)
        {
            var userExists = context_.Users.Any(u => u.Username == dto.Username);
            if (userExists) 
            {
                return BadRequest("Bu Kullanıcı adı zaten alınmış.");
            }

            var emailExists = context_.Users.Any(u => u.Email == dto.Email);
            if (emailExists)
            {
                return BadRequest("Bu E-posta adresi zaten kullanılıyor.");
            }

            var user = new User
            {
                FirstName = dto.AuthorizedPersonName, 
                LastName = "", 
                BirthDate = DateTime.Now, 
                Email = dto.Email,
                Address = dto.Address,
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "publisher",
                PublisherName = dto.PublisherName, 
                Website = dto.Website 
            };
            
            context_.Users.Add(user);
            context_.SaveChanges();
            
            var userResponse = new
            {
                id = user.ID,
                publisherName = dto.PublisherName,
                authorizedPersonName = dto.AuthorizedPersonName,
                username = user.Username,
                email = user.Email,
                address = user.Address,
                website = dto.Website,
                role = user.Role,
                createdAt = user.CreatedAt,
                message = "Yayın evi kaydı başarılı."
            };
            
            return CreatedAtAction(nameof(GetById), new { id = user.ID }, userResponse);
        }

        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginDto dto)
        {
            var user = context_.Users.FirstOrDefault(u => u.Username == dto.Username);
            
            if (user == null)
            {
                return BadRequest("Kullanıcı adı veya şifre hatalı.");
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return BadRequest("Kullanıcı adı veya şifre hatalı.");
            }

            var userResponse = new
            {
                id = user.ID,
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                username = user.Username,
                role = user.Role,
                birthDate = user.BirthDate,
                address = user.Address,
                publisherName = user.PublisherName,
                website = user.Website,
                createdAt = user.CreatedAt,
                message = "Giriş başarılı."
            };

            return Ok(userResponse);
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id, [FromBody] UserUpdateDto dto)
        {
            var user = context_.Users.FirstOrDefault(u => u.ID == id);
            
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            if (dto.Username != null && dto.Username != user.Username)
            {
                var usernameExists = context_.Users.Any(u => u.Username == dto.Username && u.ID != id);
                if (usernameExists)
                {
                    return BadRequest("Bu kullanıcı adı zaten alınmış.");
                }
            }

            if (dto.Email != null && dto.Email != user.Email)
            {
                var emailExists = context_.Users.Any(u => u.Email == dto.Email && u.ID != id);
                if (emailExists)
                {
                    return BadRequest("Bu e-posta adresi zaten kullanılıyor.");
                }
            }

            if (dto.FirstName != null) user.FirstName = dto.FirstName;
            if (dto.LastName != null) user.LastName = dto.LastName;
            if (dto.BirthDate.HasValue) user.BirthDate = dto.BirthDate.Value;
            if (dto.Email != null) user.Email = dto.Email;
            if (dto.Address != null) user.Address = dto.Address;
            if (dto.Username != null) user.Username = dto.Username;
            if (dto.Role != null) user.Role = dto.Role;
            if (dto.PublisherName != null) user.PublisherName = dto.PublisherName;
            if (dto.Website != null) user.Website = dto.Website;
            
            // Şifre değişiyorsa hash'le
            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            context_.SaveChanges();

            var userResponse = new
            {
                id = user.ID,
                firstName = user.FirstName,
                lastName = user.LastName,
                username = user.Username,
                email = user.Email,
                role = user.Role,
                birthDate = user.BirthDate,
                address = user.Address,
                publisherName = user.PublisherName,
                website = user.Website,
                createdAt = user.CreatedAt,
                message = "Kullanıcı bilgileri güncellendi."
            };

            return Ok(userResponse);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var user = context_.Users.FirstOrDefault(u => u.ID == id);
            
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            context_.Users.Remove(user);
            context_.SaveChanges();

            return Ok(new { message = "Kullanıcı başarıyla silindi." });
        }

        [HttpGet("count")]
        public ActionResult GetUserCount()
        {
            var count = context_.Users.Count();
            return Ok(new { userCount = count });
        }

        [HttpGet("role/{role}")]
        public ActionResult GetUsersByRole(string role)
        {
            var users = context_.Users
                .Where(u => u.Role == role)
                .Select(u => new
                {
                    id = u.ID,
                    firstName = u.FirstName,
                    lastName = u.LastName,
                    username = u.Username,
                    email = u.Email,
                    role = u.Role
                })
                .ToList();
            
            return Ok(users);
        }

        [HttpGet("statistics/{userId}")]
        public async Task<IActionResult> GetUserStatistics(int userId)
        {
            try
            {
                var user = await context_.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound("Kullanıcı bulunamadı.");
                }

                var statistics = new
                {
                    UserId = userId,
                    Role = user.Role
                };

                if (user.Role == "member")
                {
                    
                    var borrowedBooksCount = await context_.BorrowRequests
                        .Where(br => br.UserId == userId && br.Status == "Approved")
                        .CountAsync();

                    var favoriteBooksCount = await context_.FavoriteBooks
                        .Where(fb => fb.UserID == userId)
                        .CountAsync();



                    return Ok(new
                    {
                        statistics.UserId,
                        statistics.Role,
                        borrowedBooksCount = borrowedBooksCount,
                        favoriteBooksCount = favoriteBooksCount
                    });
                }
                else if (user.Role == "publisher")
                {
                    
                    var allBooks = await context_.Books.ToListAsync();
                    var publisherBooks = allBooks.Where(b => b.publisher == user.PublisherName).ToList();
                    var booksCount = publisherBooks.Count;

                    var borrowRequestsCount = await context_.BorrowRequests
                        .Where(br => br.PublisherId == userId)
                        .CountAsync();



                    return Ok(new
                    {
                        statistics.UserId,
                        statistics.Role,
                        booksCount = booksCount,
                        borrowRequestsCount = borrowRequestsCount
                    });
                }
                else if (user.Role == "admin")
                {
                    
                    var totalUsers = await context_.Users.CountAsync();
                    var totalBooks = await context_.Books.CountAsync();



                    return Ok(new
                    {
                        statistics.UserId,
                        statistics.Role,
                        totalUsers = totalUsers,
                        totalBooks = totalBooks
                    });
                }

                return BadRequest("Geçersiz kullanıcı rolü.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Sunucu hatası: {ex.Message}");
            }
        }
    }
}
