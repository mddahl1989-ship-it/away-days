namespace AwayDays.Models;

public class Trip
{
    public Guid Id { get; set; }
    public Guid MatchId { get; set; }
    public Match Match { get; set; } = null!;
    public TravelMode TravelMode { get; set; }
    public int DistanceKm { get; set; }
    public int Friends { get; set; }
    public string? Notes { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public List<Expense> Expenses { get; set; } = [];

    
}