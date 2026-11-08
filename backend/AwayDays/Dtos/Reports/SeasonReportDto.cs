namespace AwayDays.Dtos.Reports;

// Saisonbilanz: Saison 2026 = 1. Juli 2026 bis 30. Juni 2027.
public record SeasonReportDto(
    int Season,
    int TripCount,
    int TotalDistanceKm,
    decimal TotalCost,
    int Wins,
    int Draws,
    int Losses,
    IReadOnlyList<CategoryTotalDto> CostsByCategory,
    IReadOnlyList<AttendedMatchDto> AttendedMatches);
