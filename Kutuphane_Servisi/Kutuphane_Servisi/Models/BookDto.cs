using System;
using System.Collections.Generic;

namespace Kutuphane_Servisi.Models
{
    public class BookDto
    {
        public string title { get; set; }
        public string author { get; set; }
        public string summary { get; set; }
        public DateTime publishDate { get; set; }
        public int pageCount { get; set; }
        public string ISBN { get; set; }
        public string publisher { get; set; }
        public string language { get; set; }
        public string? cover { get; set; }
        public List<int>? categoryIDs { get; set; }
    }
} 