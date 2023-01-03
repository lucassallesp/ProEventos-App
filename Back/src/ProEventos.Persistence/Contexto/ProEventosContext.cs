using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;

namespace ProEventos.Persistence
{
    public class ProEventosContext : DbContext
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