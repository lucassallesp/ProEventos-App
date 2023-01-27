using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Domain.Identity;

namespace ProEventos.Persistence
{
    public class ProEventosContext : IdentityDbContext<User, Role, int, 
                                                       IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, 
                                                       IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public ProEventosContext(DbContextOptions<ProEventosContext> options) : base(options) { }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<Palestrante> Palestrantes { get; set; }
        public DbSet<PalestranteEvento> PalestrantesEventos { get; set; }
        public DbSet<RedeSocial> RedesSociais { get; set; }

            /// <summary>
            /// This method will be used to associate both parameters EventoID and PalestranteId
            /// on the database creation which means that on the PalestrantesEventos table creation
            /// these parameters will be associated to make known the respective event associated its
            /// speakers
            /// </summary>
            /// <param name="modelBuilder"></param>
            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                modelBuilder.Entity<UserRole>(userRole => 
                    {
                        userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                        userRole.HasOne(ur => ur.Role)
                            .WithMany(r => r.UserRoles)
                            .HasForeignKey(ur => ur.RoleId)
                            .IsRequired();

                        userRole.HasOne(ur => ur.User)
                            .WithMany(r => r.UserRoles)
                            .HasForeignKey(ur => ur.UserId)
                            .IsRequired();
                    }
                );

                modelBuilder.Entity<PalestranteEvento>()        
                    .HasKey(PE => new{ PE.EventoId, PE.PalestranteId });

                modelBuilder.Entity<Evento>()
                    .HasMany(e => e.RedesSociais)
                    .WithOne(rs => rs.Evento)
                    .OnDelete(DeleteBehavior.Cascade);

                modelBuilder.Entity<Palestrante>()
                    .HasMany(e => e.RedesSociais)
                    .WithOne(rs => rs.Palestrante)
                    .OnDelete(DeleteBehavior.Cascade);    
            }
    }
}