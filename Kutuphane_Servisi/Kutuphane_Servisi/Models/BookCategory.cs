using System;
using System.Text.Json.Serialization;

namespace Kutuphane_Servisi.Models
{
    public class BookCategory
    {
        public int BookID { get; set; }
        
        [JsonIgnore]
        public Book Book { get; set; }

        public int CategoryID { get; set; }
        
        [JsonIgnore]
        public Category Category { get; set; }
    }
} 