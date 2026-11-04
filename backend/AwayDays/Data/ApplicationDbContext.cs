using AwayDays.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AwayDays.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Match> Matches => Set<Match>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Expense> Expenses => Set<Expense>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<DateTimeOffset>()
            .HaveConversion<DateTimeOffsetToBinaryConverter>(); 

    }  

       protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Match>(entity =>
        {
            entity.Property(m => m.Opponent).HasMaxLength(100).IsRequired();
            entity.Property(m => m.Venue).HasMaxLength(100).IsRequired();
            entity.Property(m => m.Competition).HasConversion<string>().HasMaxLength(30);
            entity.HasIndex(m => m.KickOff);
        });

        modelBuilder.Entity<Trip>(entity =>
        {
            entity.Property(t => t.TravelMode).HasConversion<string>().HasMaxLength(30);
            entity.Property(t => t.Notes).HasMaxLength(1000);

            entity.HasOne(t => t.Match)
                .WithMany(m => m.Trips)
                .HasForeignKey(t => t.MatchId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.Property(e => e.Category).HasConversion<string>().HasMaxLength(30);
            entity.Property(e => e.Description).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Amount).HasPrecision(18, 2);

            entity.HasOne(e => e.Trip)
                .WithMany(t => t.Expenses)
                .HasForeignKey(e => e.TripId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}