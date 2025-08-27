using Kutuphane_Servisi.Models;
using Kutuphane_Servisi.Service;
using Microsoft.AspNetCore.Mvc;

namespace Kutuphane_Servisi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService service_;

        public CategoryController(ICategoryService service)
        {
            service_ = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<object>> GetAll()
        {
            var categories = service_.GetAll()
                .Select(c => new { id = c.ID, name = c.Name })
                .ToList();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public ActionResult<object> GetById(int id)
        {
            var category = service_.GetById(id);
            if (category == null)
                return NotFound("Kategori bulunamadı.");
            return Ok(new { id = category.ID, name = category.Name });
        }

        [HttpPost]
        public ActionResult Add(Category category)
        {
            service_.Add(category);
            return Ok("Kategori eklendi.");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Category category)
        {
            if (id != category.ID)
                return BadRequest("ID uyuşmuyor.");

            var existingCategory = service_.GetById(id);
            if (existingCategory == null)
                return NotFound("Kategori bulunamadı.");

            service_.Update(category);
            return Ok("Kategori güncellendi.");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existingCategory = service_.GetById(id);
            if (existingCategory == null)
                return NotFound("Kategori bulunamadı.");

            service_.Delete(id);
            return Ok("Kategori silindi.");
        }
    }
}
