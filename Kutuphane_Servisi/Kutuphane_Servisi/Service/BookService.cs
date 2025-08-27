using Kutuphane_Servisi.Models;
using Kutuphane_Servisi.Repository;

namespace Kutuphane_Servisi.Service
{
    public class BookService : IBookService 
    {
        private readonly IBookRepository repository_;
        public BookService(IBookRepository repository)
        {
            repository_ = repository;
        }
        public IEnumerable<Book> GetAll() 
        {
            return repository_.GetAll();
        }
        public Book GetById(int id) 
        {
            return repository_.GetById(id);
        }
        public void Add(Book book) 
        {
            repository_.Add(book);
        }
        public void Update(Book book) 
        {
            repository_.Update(book);
        }
        public void Delete(int id) 
        {
            repository_.Delete(id);
        }


    }
}
