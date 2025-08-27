using Kutuphane_Servisi.Models;

namespace Kutuphane_Servisi.Service
{
    public interface IBookService
    {
        IEnumerable<Book> GetAll(); 
        Book GetById(int id); 
        void Add(Book book); 
        void Update(Book book); 
        void Delete(int id); 
    }
}
