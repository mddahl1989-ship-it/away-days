using AwayDays.Models;

namespace AwayDays.Dtos.Matches;

public record MatchResponseDto(
    Guid Id,
    DateTimeOffset KickOff,
    string Opponent,
    string Venue,
    Competition Competition,
    bool IsHome,
    int? GoalsBvB,
    int? GoalsOpponent,
    int TripCount);