using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Kutuphane_Servisi.Models
{
    public class Category
    {
        public int? ID { get; set; }
        public string Name { get; set; }
        
        [JsonIgnore]
        public ICollection<BookCategory>? BookCategories { get; set; }
    }
}
