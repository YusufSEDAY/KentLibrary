using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Kutuphane_Servisi.Models
{
    public class Book
    {
        public int ID { get; set; }
        public string title { get; set; }
        public string author { get; set; }
        public string summary { get; set; }
        public DateTime publishDate { get; set; }
        public int pageCount { get; set; }
        public string ISBN { get; set; }
        public string publisher { get; set; }
        public int? PublisherId { get; set; }
        
        [JsonIgnore]
        public User Publisher { get; set; }
        
        public string language { get; set; }
        public string? cover { get; set; }
        
        [JsonIgnore]
        public ICollection<BookCategory> BookCategories { get; set; }
    }
}
