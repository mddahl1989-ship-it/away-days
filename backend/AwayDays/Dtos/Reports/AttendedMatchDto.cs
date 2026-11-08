using AwayDays.Models;

namespace AwayDays.Dtos.Reports;

// Ein Spiel, bei dem ich im Stadion war (für die Formkurve in der Saisonbilanz).
public record AttendedMatchDto(
    Guid MatchId,
    Guid TripId,
    DateTimeOffset KickOff,
    string Opponent,
    bool IsHome,
    Competition Competition,
    int? GoalsBvB,
    int? GoalsOpponent);
