using Kutuphane_Servisi.Models;
using Kutuphane_Servisi.Repository;

namespace Kutuphane_Servisi.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository repository_;

        public CategoryService(ICategoryRepository repository)
        {
            repository_ = repository;
        }

        public IEnumerable<Category> GetAll()
        {
            return repository_.GetAll();
        }

        public Category GetById(int id)
        {
            return repository_.GetById(id);
        }

        public void Add(Category category)
        {
            repository_.Add(category);
        }

        public void Update(Category category)
        {
            repository_.Update(category);
        }

        public void Delete(int id)
        {
            repository_.Delete(id);
        }
    }
}
