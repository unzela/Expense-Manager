using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Filter
{
    public class SortFilter
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public bool SortDir { get; set; }
        public string Name { get; set; }

        public SortFilter()
        {
            this.PageNumber = 1;
            this.PageSize = 10;
            this.SortDir = true;
            this.Name = null;
        }
        public SortFilter(int pageNumber, int pageSize, bool sortDir, string name)
        {
            this.PageNumber = pageNumber < 1 ? 1 : pageNumber;
            this.PageSize = pageSize > 100 ? 100 : pageSize;
            this.SortDir = sortDir;
            this.Name = name;
        }
    }
}
