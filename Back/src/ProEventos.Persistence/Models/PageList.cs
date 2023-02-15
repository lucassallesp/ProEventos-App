using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ProEventos.Persistence.Models
{
    public class PageList<T> : List<T>
    {
        //The total number of pages based on the number of items and the page size.
        public int TotalPages { get; set; } 

        //The number of items per page.
        public int PageSize { get; set; }

        //The total number of items.
        public int TotalCount { get; set; }

        //The current page number.
        public int CurrentPage { get; set; }     

        public PageList() {}

        public PageList(List<T> items, int count, int pageNumber, int pageSize)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            AddRange(items);
        }  

        public static async Task<PageList<T>> CreateAsync(
            IQueryable<T> source, int pageNumber, int pageSize
        ) 
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();
            
            return new PageList<T>(items, count, pageNumber, pageSize);
        }
    }
}