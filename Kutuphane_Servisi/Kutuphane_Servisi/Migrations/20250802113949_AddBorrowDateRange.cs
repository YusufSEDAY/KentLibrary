using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kutuphane_Servisi.Migrations
{
    /// <inheritdoc />
    public partial class AddBorrowDateRange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "BorrowEndDate",
                table: "BorrowRequests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BorrowStartDate",
                table: "BorrowRequests",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BorrowEndDate",
                table: "BorrowRequests");

            migrationBuilder.DropColumn(
                name: "BorrowStartDate",
                table: "BorrowRequests");
        }
    }
}
