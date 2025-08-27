using Kutuphane_Servisi.Context;
using Kutuphane_Servisi.Models;
using Microsoft.EntityFrameworkCore;

namespace Kutuphane_Servisi.Repository
{
    public class BookRepository : IBookRepository
    {
        private readonly BookDbContext context_;
        public BookRepository(BookDbContext context) 
        {
           context_=context;
        }

        public IEnumerable<Book> GetAll()
        {
            return context_.Books.ToList();
        }

        public Book GetById(int id)
        {
            return context_.Books.Find(id);
        }
        public void Add(Book book)
        {
            context_.Books.Add(book);
            context_.SaveChanges();
        }
        public void Update(Book book)
        {
            var existingBook = context_.Books.Find(book.ID);
            if (existingBook != null)
            {
                existingBook.ID = book.ID;
                existingBook.title = book.title;
                existingBook.author = book.author;
                existingBook.publisher = book.publisher;
                existingBook.pageCount = book.pageCount;
                existingBook.publishDate = book.publishDate;

                context_.SaveChanges();
             }
        }
        public void Delete(int id)
        {
            var book = context_.Books.Find(id);
            if (book != null) 
            {
                context_.Books.Remove(book);
                context_.SaveChanges();
            }
        }


    }
}
