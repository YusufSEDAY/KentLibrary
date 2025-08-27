using Kutuphane_Servisi.Context;
using Kutuphane_Servisi.Models;

namespace Kutuphane_Servisi.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly BookDbContext context_;

        public CategoryRepository(BookDbContext context)
        {
            context_ = context;
        }

        public IEnumerable<Category> GetAll()
        {
            return context_.Categories.ToList();
        }

        public Category GetById(int id)
        {
            return context_.Categories.Find(id);
        }

        public void Add(Category category)
        {
            context_.Categories.Add(category);
            context_.SaveChanges();
        }

        public void Update(Category category)
        {
            context_.Categories.Update(category);
            context_.SaveChanges();
        }

        public void Delete(int id)
        {
            var category = context_.Categories.Find(id);
            if (category != null)
            {
                context_.Categories.Remove(category);
                context_.SaveChanges();
            }
        }
    }
}
