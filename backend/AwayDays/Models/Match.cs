using System.Security.Cryptography;

namespace AwayDays.Models;

public class Match
{
    public Guid Id { get; set; }
    public DateTimeOffset KickOff { get; set; }
    public string Opponent { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public Competition Competition { get; set; }
    public bool IsHome { get; set; }
    public int? GoalsBvB { get; set; }
    public int? GoalsOpponent { get; set; }

    public List<TripleDES> Trips { get; set; } = [];

}