using System;
using System.Text.Json.Serialization;

namespace Kutuphane_Servisi.Models
{
    public class FavoriteBook
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public int BookID { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        
        [JsonIgnore]
        public User User { get; set; }
        
        [JsonIgnore]
        public Book Book { get; set; }
    }
} 