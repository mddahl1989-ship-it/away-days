using AwayDays.Dtos.Matches;
using AwayDays.Models;

namespace AwayDays.Dtos.Trips;

// Eine Fahrt mit Spiel und allen Ausgaben.
public record TripDetailDto(
    Guid Id,
    MatchResponseDto Match,
    TravelMode TravelMode,
    int DistanceKm,
    int Friends,
    string? Notes,
    DateTimeOffset CreatedAt,
    IReadOnlyList<ExpenseResponseDto> Expenses,
    decimal TotalCost);
