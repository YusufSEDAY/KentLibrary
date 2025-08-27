using Kutuphane_Servisi.Models;

namespace Kutuphane_Servisi.Service
{
    public interface ICategoryService
    {
        IEnumerable<Category> GetAll();
        Category GetById(int id);
        void Add(Category category);
        void Update(Category category);
        void Delete(int id);
    }
}
