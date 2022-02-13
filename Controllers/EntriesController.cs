using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LoggerService;
using Expenses.Data;
using Expenses.Filter;
using Expenses.Models;
using Expenses.Wrapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Expenses.Controllers
{
    [EnableCors]
    [Route("api/[controller]")]
    [ApiController]
    public class EntriesController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IConfiguration configuration;
        private readonly ILoggerManager _logger;
        public EntriesController( AppDbContext dbContext, IConfiguration configuration, ILoggerManager logger)
        {
            this.dbContext = dbContext;
            this.configuration = configuration;
            _logger = logger;
        }

       /* public EntriesController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }*/

       
        [HttpGet("{id:int}")]
        public ActionResult<Entry> GetEntry(int id)
        {
          
                _logger.LogInfo("Find entry:");
                var entry = dbContext.Entries.FirstOrDefault(n => n.Id == id);
                if (entry == null) return Ok("Not found");
                _logger.LogInfo("Return entry:");
                return Ok(entry);
        }

       
        public async Task<ActionResult<List<Entry>>> GetSort(int PageNumber, int PageSize, bool sortDir, string Name)
        {
                
                var validFilter = new SortFilter(PageNumber, PageSize, sortDir, Name);
                var pagedData = await dbContext.Entries.ToListAsync();
                _logger.LogInfo("Find entries");
                if (!string.IsNullOrWhiteSpace(Name))
                {
                    if (sortDir == true)
                    {
                    pagedData = await dbContext.Entries
                   .OrderBy(Entries => Entries.Description)
                   .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                   .Take(validFilter.PageSize)
                   .Where(Entries => Entries.Description.ToLower().Contains(Name.Trim().ToLower()))
                   .ToListAsync();
                     }
                    else
                    {
                        pagedData = await dbContext.Entries
                        .OrderByDescending(Entries => Entries.Description)
                        .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                        .Take(validFilter.PageSize)
                        .Where(Entries => Entries.Description.ToLower().Contains(Name.Trim().ToLower()))
                        .ToListAsync();
                    }
                }
                else
                {
                    if (sortDir == true)
                    {
                        pagedData = await dbContext.Entries
                       .OrderBy(Entries => Entries.Description)
                       .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                       .Take(validFilter.PageSize)
                       .ToListAsync();
                    }
                    else
                    {
                        pagedData = await dbContext.Entries
                        .OrderByDescending(Entries => Entries.Description)
                        .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                        .Take(validFilter.PageSize)
                        .ToListAsync();
                    }

                }
                _logger.LogInfo("Return entries");
               var result = new PagedResponse<List<Entry>>(pagedData, validFilter.PageNumber, validFilter.PageSize, validFilter.SortDir, validFilter.Name);
                return Ok(result);
            }


        [Route("csv")]
        public async Task<IActionResult> ExportEntryData()
        {
            string fileDownloadName;
            var entryData = await dbContext.Entries.ToListAsync();
            fileDownloadName = "employee.csv";

            return new EntryCSVResult(entryData, fileDownloadName);
        }

        [HttpPost]
        public ActionResult<Entry> PostEntry([FromBody] Entry entry)
        {
               
                entry.Id = dbContext.Entries.Max(x => x.Id) + 1;
                dbContext.Entries.Add(entry);
                dbContext.SaveChanges();
                _logger.LogInfo("Create entry");
                return Ok("Entry was created!");
        }


        [HttpPut("{id:int}")]
        public ActionResult<Entry> UpdateEntry(int id, [FromBody] Entry entry)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (dbContext.Entries.FirstOrDefault(x => x.Id ==id)==null) return BadRequest();
            
             var oldEntry = dbContext.Entries.FirstOrDefault(n => n.Id == id);
             if (oldEntry == null) return NotFound();

              oldEntry.Description = entry.Description;
              oldEntry.IsExpense = entry.IsExpense;
              oldEntry.Value = entry.Value;
                _logger.LogInfo("Update entry");
                dbContext.SaveChanges();
             return Ok("Entry updated!");
        }


        [HttpDelete("{id:int}")]
        public ActionResult<Entry> DeleteEntry(int id)
        {
            
             var entry = dbContext.Entries.FirstOrDefault(n => n.Id == id);
             if (entry == null) return NotFound();

             dbContext.Entries.Remove(entry);
             dbContext.SaveChanges();
                _logger.LogInfo("Delete entry");
                return Ok("Entry deleted");
        }


        [HttpGet("page")]
        public ActionResult<Entry> GetPageSizeOptions()
        {
                 var entry = configuration.GetValue<String>("MyAppSettings:PageSizeOptions");
                _logger.LogInfo("Return page size options");
                if (entry == null) return NotFound();
                return Ok(entry);
        }
    }
}
