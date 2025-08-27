using System.Collections.Generic;

namespace Kutuphane_Servisi.Models
{
    public class BookListDto
    {
        public int ID { get; set; }
        public string title { get; set; }
        public string author { get; set; }
        public string summary { get; set; }
        public System.DateTime publishDate { get; set; }
        public int pageCount { get; set; }
        public string? ISBN { get; set; }
        public string publisher { get; set; }
        public int? publisherId { get; set; }
        public string language { get; set; }
        public string? cover { get; set; }
        public List<string> categories { get; set; }
    }
} 