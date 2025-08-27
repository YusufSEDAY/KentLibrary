using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kutuphane_Servisi.Migrations
{
    /// <inheritdoc />
    public partial class SeedBookData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Örnek kitaplar ekle (kategoriler zaten var)
            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "ID", "title", "author", "summary", "publishDate", "pageCount", "ISBN", "publisher", "language", "cover" },
                values: new object[,]
                {
                    { 1, "Sefiller", "Victor Hugo", "Fransız Devrimi sonrası dönemde geçen, Jean Valjean'ın hayatını anlatan epik roman.", new DateTime(1862, 1, 1), 1463, "9789750738606", "Can Yayınları", "Fransızca", null },
                    { 2, "Suç ve Ceza", "Fyodor Dostoyevski", "St. Petersburg'da yaşayan fakir öğrenci Raskolnikov'un işlediği cinayet ve sonrasında yaşadığı vicdani azap.", new DateTime(1866, 1, 1), 687, "9786053609396", "İş Bankası Kültür Yayınları", "Rusça", null },
                    { 3, "Kürk Mantolu Madonna", "Sabahattin Ali", "Berlin'de yaşayan Türk genci Raif Efendi'nin Maria Puder ile olan aşk hikayesi.", new DateTime(1943, 1, 1), 160, "9789753638026", "Yapı Kredi Yayınları", "Türkçe", null },
                    { 4, "1984", "George Orwell", "Totaliter bir rejim altında yaşayan Winston Smith'in Big Brother'a karşı mücadelesi.", new DateTime(1949, 1, 1), 328, "9789750719384", "Can Yayınları", "İngilizce", null },
                    { 5, "Küçük Prens", "Antoine de Saint-Exupéry", "Küçük bir gezegenden gelen prensin Dünya'da öğrendiği hayat dersleri.", new DateTime(1943, 1, 1), 96, "9789750719384", "Can Yayınları", "Fransızca", null }
                });

            // Kitap-Kategori ilişkileri ekle (mevcut kategori ID'lerini kullan)
            migrationBuilder.InsertData(
                table: "BookCategories",
                columns: new[] { "BookID", "CategoryID" },
                values: new object[,]
                {
                    { 1, 1 }, // Sefiller - Roman
                    { 1, 2 }, // Sefiller - Klasik
                    { 2, 1 }, // Suç ve Ceza - Roman
                    { 2, 3 }, // Suç ve Ceza - Psikoloji
                    { 3, 1 }, // Kürk Mantolu Madonna - Roman
                    { 3, 4 }, // Kürk Mantolu Madonna - Aşk
                    { 4, 5 }, // 1984 - Distopya
                    { 4, 6 }, // 1984 - Bilim Kurgu
                    { 5, 7 }, // Küçük Prens - Çocuk
                    { 5, 10 } // Küçük Prens - Felsefe
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Verileri sil
            migrationBuilder.DeleteData(
                table: "BookCategories",
                keyColumns: new[] { "BookID", "CategoryID" },
                keyValues: new object[,]
                {
                    { 1, 1 }, { 1, 2 }, { 2, 1 }, { 2, 3 }, { 3, 1 }, { 3, 4 }, { 4, 5 }, { 4, 6 }, { 5, 7 }, { 5, 10 }
                });

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "ID",
                keyValues: new object[] { 1, 2, 3, 4, 5 });
        }
    }
}
