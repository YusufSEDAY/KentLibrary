using Kutuphane_Servisi.Models;

namespace Kutuphane_Servisi.Repository
{
    public interface ICategoryRepository
    {
        IEnumerable<Category> GetAll();
        Category GetById(int id);
        void Add(Category category);
        void Update(Category category);
        void Delete(int id);
    }
}
