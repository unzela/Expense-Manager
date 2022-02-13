using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Models
{
    public class EntryCSVResult : FileResult
    {
        private readonly IEnumerable<Entry> _entries;
        public EntryCSVResult(IEnumerable<Entry> entries, string fileDownloadName) : base("text/csv")
        {
            _entries = entries;
            FileDownloadName = fileDownloadName;
        }
        public async override Task ExecuteResultAsync(ActionContext context)
        {
            var response = context.HttpContext.Response;
            context.HttpContext.Response.Headers.Add("Content-Disposition", new[] { "attachment; filename=" + FileDownloadName });
            using (var streamWriter = new StreamWriter(response.Body))
            {
                await streamWriter.WriteLineAsync(
                  $"Description, isExpense, Id"
                );
                foreach (var p in _entries)
                {
                    await streamWriter.WriteLineAsync(
                      $"{p.Description}, {p.IsExpense}, {p.Id}"
                    );
                    await streamWriter.FlushAsync();
                }
                await streamWriter.FlushAsync();
            }
        }
    }
}
