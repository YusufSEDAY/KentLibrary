using Kutuphane_Servisi.Models;

namespace Kutuphane_Servisi.Repository
{
    public interface IBookRepository
    {
        IEnumerable<Book> GetAll(); //Tüm Kitapları Getir
        Book GetById(int id); // ID ile Getir
        void Add(Book book); //Ekle
        void Update(Book book); //Güncelle
        void Delete(int id); //Sil
           
    }
}
