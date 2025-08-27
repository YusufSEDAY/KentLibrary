using Kutuphane_Servisi.Models;
using Microsoft.EntityFrameworkCore;

namespace Kutuphane_Servisi.Context
{
    public class BookDbContext: DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options) { }
        public DbSet<Book> Books { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<BookCategory> BookCategories { get; set; }
        public DbSet<FavoriteBook> FavoriteBooks { get; set; }
        public DbSet<BorrowRequest> BorrowRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BookCategory>()
                .HasKey(bc => new { bc.BookID, bc.CategoryID });

            modelBuilder.Entity<BookCategory>()
                .HasOne(bc => bc.Book)
                .WithMany(b => b.BookCategories)
                .HasForeignKey(bc => bc.BookID);

            modelBuilder.Entity<BookCategory>()
                .HasOne(bc => bc.Category)
                .WithMany(c => c.BookCategories)
                .HasForeignKey(bc => bc.CategoryID);

            modelBuilder.Entity<FavoriteBook>()
                .HasOne(fb => fb.User)
                .WithMany()
                .HasForeignKey(fb => fb.UserID);

            modelBuilder.Entity<FavoriteBook>()
                .HasOne(fb => fb.Book)
                .WithMany()
                .HasForeignKey(fb => fb.BookID);

            // Aynı kullanıcı aynı kitabı birden fazla kez favoriye ekleyemez
            modelBuilder.Entity<FavoriteBook>()
                .HasIndex(fb => new { fb.UserID, fb.BookID })
                .IsUnique();

            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.User)
                .WithMany()
                .HasForeignKey(br => br.UserId);

            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.Book)
                .WithMany()
                .HasForeignKey(br => br.BookId);

            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.Publisher)
                .WithMany()
                .HasForeignKey(br => br.PublisherId);
        }
    }
}
