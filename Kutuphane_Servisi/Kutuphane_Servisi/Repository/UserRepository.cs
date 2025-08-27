using Kutuphane_Servisi.Context;
using Kutuphane_Servisi.Models;
using System.Collections.Generic;
using System.Linq;

namespace Kutuphane_Servisi.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly BookDbContext context_;

        public UserRepository(BookDbContext context)
        {
            context_ = context;
        }
        public IEnumerable<User> GetAll()
        {
            return context_.Users.ToList();

        }
        public User GetById(int id)
        {
            return context_.Users.FirstOrDefault(u => u.ID == id);
        }
        public User GetByUsername(string username)
        {
            return context_.Users.FirstOrDefault(u => u.Username == username);
        }
        public void Add(User user)
        {
            context_.Users.Add(user);
            context_.SaveChanges();
        }
        public void Update(User user)
        {
            context_.Users.Update(user);
            context_.SaveChanges();
        }
        /*public void Delete(int id)
        {
            context_.Users.Remove(id);
            context_.SaveChanges();
        }*/

  

    }
}
