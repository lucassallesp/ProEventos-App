using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ProEventos.Domain.Enum;

namespace ProEventos.Domain.Identity
{
    public class UserRole : IdentityUserRole<int>   //TKey is the type of the id key param
    {
        public Role Role { get; set; }
        public User User { get; set; }
    }
}