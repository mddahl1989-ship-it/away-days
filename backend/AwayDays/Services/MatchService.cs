using AwayDays.Data;
using AwayDays.Dtos.Matches;
using AwayDays.Errors;
using AwayDays.Models;
using Microsoft.EntityFrameworkCore;

namespace AwayDays.Services;

public class MatchService : IMatchService
{
    private readonly ApplicationDbContext _db;

    public MatchService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<MatchResponseDto>> GetAllAsync(string? q, Competition? competition, int? season, bool? isHome)
    {
        var query = _db.Matches.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var pattern = $"%{q}%";
            query = query.Where(m => EF.Functions.Like(m.Opponent, pattern));
        }

        if (competition is not null)
        {
            query = query.Where(m => m.Competition == competition);
        }

        if (isHome is not null)
        {
            query = query.Where(m => m.IsHome == isHome);
        }

        if (season is not null)
        {
            var from = SeasonStart(season.Value);
            var to = SeasonStart(season.Value + 1);
            query = query.Where(m => m.KickOff >= from && m.KickOff < to);
        }

        return await query
            .OrderByDescending(m => m.KickOff)
            .Select(m => new MatchResponseDto(
                m.Id, m.KickOff, m.Opponent, m.Venue, m.Competition,
                m.IsHome, m.GoalsBvB, m.GoalsOpponent, m.Trips.Count))
            .ToListAsync();
    }

    public async Task<MatchResponseDto?> GetByIdAsync(Guid id)
    {
        return await _db.Matches
            .AsNoTracking()
            .Where(m => m.Id == id)
            .Select(m => new MatchResponseDto(
                m.Id, m.KickOff, m.Opponent, m.Venue, m.Competition,
                m.IsHome, m.GoalsBvB, m.GoalsOpponent, m.Trips.Count))
            .FirstOrDefaultAsync();
    }

    public async Task<MatchResponseDto> CreateAsync(CreateMatchDto dto)
    {
        var match = new Match
        {
            Id = Guid.NewGuid(),
            KickOff = dto.KickOff!.Value,
            Opponent = dto.Opponent,
            Venue = dto.Venue,
            Competition = dto.Competition!.Value,
            IsHome = dto.IsHome,
            GoalsBvB = dto.GoalsBvB,
            GoalsOpponent = dto.GoalsOpponent
        };

        _db.Matches.Add(match);
        await _db.SaveChangesAsync();

        return ToDto(match, 0);
    }

    public async Task<MatchResponseDto?> UpdateAsync(Guid id, UpdateMatchDto dto)
    {
        var match = await _db.Matches.FindAsync(id);
        if (match is null)
        {
            return null;
        }

        match.KickOff = dto.KickOff!.Value;
        match.Opponent = dto.Opponent;
        match.Venue = dto.Venue;
        match.Competition = dto.Competition!.Value;
        match.IsHome = dto.IsHome;
        match.GoalsBvB = dto.GoalsBvB;
        match.GoalsOpponent = dto.GoalsOpponent;
        await _db.SaveChangesAsync();

        var tripCount = await _db.Trips.CountAsync(t => t.MatchId == id);
        return ToDto(match, tripCount);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var match = await _db.Matches.FindAsync(id);
        if (match is null)
        {
            return false;
        }

        if (await _db.Trips.AnyAsync(t => t.MatchId == id))
        {
            throw new ConflictException("Zu diesem Spiel gibt es noch Fahrten. Lösche zuerst die Fahrten.");
        }

        _db.Matches.Remove(match);
        await _db.SaveChangesAsync();
        return true;
    }

    // Saison 2025 = 1. Juli 2025 bis 30. Juni 2026
    private static DateTimeOffset SeasonStart(int year) =>
        new(year, 7, 1, 0, 0, 0, TimeSpan.Zero);

    private static MatchResponseDto ToDto(Match m, int tripCount) =>
        new(m.Id, m.KickOff, m.Opponent, m.Venue, m.Competition,
            m.IsHome, m.GoalsBvB, m.GoalsOpponent, tripCount);
}

