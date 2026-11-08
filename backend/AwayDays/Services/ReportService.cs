using AwayDays.Data;
using AwayDays.Dtos.Reports;
using Microsoft.EntityFrameworkCore;

namespace AwayDays.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _db;

    public ReportService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<SeasonReportDto> GetSeasonAsync(int season)
    {
        var from = Season.Start(season);
        var to = Season.End(season);

        var trips = _db.Trips
            .AsNoTracking()
            .Where(t => t.Match.KickOff >= from && t.Match.KickOff < to);

        var tripCount = await trips.CountAsync();
        var totalDistance = await trips.SumAsync(t => t.DistanceKm);

        // Die Datenbank gruppiert die Ausgaben nach Kategorie und summiert sie (GROUP BY + SUM).
        var costsByCategory = await _db.Expenses
            .AsNoTracking()
            .Where(e => e.Trip.Match.KickOff >= from && e.Trip.Match.KickOff < to)
            .GroupBy(e => e.Category)
            .Select(g => new CategoryTotalDto(g.Key, g.Sum(e => e.Amount)))
            .ToListAsync();

        var sortedCosts = costsByCategory.OrderByDescending(c => c.Total).ToList();

        // Alle Spiele, bei denen ich dabei war, in zeitlicher Reihenfolge.
        var attended = await _db.Matches
            .AsNoTracking()
            .Where(m => m.KickOff >= from && m.KickOff < to && m.Trips.Any())
            .OrderBy(m => m.KickOff)
            .Select(m => new AttendedMatchDto(
                m.Id,
                m.Trips.OrderBy(t => t.CreatedAt).Select(t => t.Id).First(),
                m.KickOff,
                m.Opponent,
                m.IsHome,
                m.Competition,
                m.GoalsBvB,
                m.GoalsOpponent))
            .ToListAsync();

        // Bilanz nur für Spiele mit Ergebnis.
        var played = attended.Where(m => m.GoalsBvB is not null && m.GoalsOpponent is not null).ToList();

        return new SeasonReportDto(
            season,
            tripCount,
            totalDistance,
            sortedCosts.Sum(c => c.Total),
            played.Count(m => m.GoalsBvB > m.GoalsOpponent),
            played.Count(m => m.GoalsBvB == m.GoalsOpponent),
            played.Count(m => m.GoalsBvB < m.GoalsOpponent),
            sortedCosts,
            attended);
    }
}
