using AwayDays.Models;

namespace AwayDays.Dtos.Trips;

// Eine Zeile im Fahrtenbuch: die Fahrt mit den wichtigsten Daten zum Spiel.
public record TripSummaryDto(
    Guid Id,
    Guid MatchId,
    string Opponent,
    string Venue,
    Competition Competition,
    DateTimeOffset KickOff,
    bool IsHome,
    int? GoalsBvB,
    int? GoalsOpponent,
    TravelMode TravelMode,
    int DistanceKm,
    int Friends,
    int ExpenseCount,
    decimal TotalCost);
