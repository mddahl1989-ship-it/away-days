using AwayDays.Data;
using AwayDays.Dtos.Matches;
using AwayDays.Dtos.Trips;
using AwayDays.Models;
using Microsoft.EntityFrameworkCore;

namespace AwayDays.Services;

public class TripService : ITripService
{
    private readonly ApplicationDbContext _db;

    public TripService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<TripSummaryDto>> GetAllAsync(int? season)
    {
        var query = _db.Trips.AsNoTracking();

        if (season is not null)
        {
            var from = Season.Start(season.Value);
            var to = Season.End(season.Value);
            query = query.Where(t => t.Match.KickOff >= from && t.Match.KickOff < to);
        }

        // t.Match.Opponent im Select: EF Core macht den Join selbst, ohne Include.
        return await query
            .OrderByDescending(t => t.Match.KickOff)
            .Select(t => new TripSummaryDto(
                t.Id,
                t.MatchId,
                t.Match.Opponent,
                t.Match.Venue,
                t.Match.Competition,
                t.Match.KickOff,
                t.Match.IsHome,
                t.Match.GoalsBvB,
                t.Match.GoalsOpponent,
                t.TravelMode,
                t.DistanceKm,
                t.Friends,
                t.Expenses.Count,
                t.Expenses.Sum(e => e.Amount)))
            .ToListAsync();
    }

    public async Task<TripDetailDto?> GetByIdAsync(Guid id)
    {
        // Projektion direkt in das DTO: Spiel, Ausgaben und Summe kommen aus einer Abfrage.
        return await _db.Trips
            .AsNoTracking()
            .Where(t => t.Id == id)
            .Select(t => new TripDetailDto(
                t.Id,
                new MatchResponseDto(
                    t.Match.Id, t.Match.KickOff, t.Match.Opponent, t.Match.Venue, t.Match.Competition,
                    t.Match.IsHome, t.Match.GoalsBvB, t.Match.GoalsOpponent, t.Match.Trips.Count),
                t.TravelMode,
                t.DistanceKm,
                t.Friends,
                t.Notes,
                t.CreatedAt,
                t.Expenses
                    .OrderBy(e => e.Category)
                    .Select(e => new ExpenseResponseDto(e.Id, e.Category, e.Description, e.Amount))
                    .ToList(),
                t.Expenses.Sum(e => e.Amount)))
            .FirstOrDefaultAsync();
    }

    public async Task<bool> MatchExistsAsync(Guid matchId)
    {
        return await _db.Matches.AnyAsync(m => m.Id == matchId);
    }

    public async Task<TripDetailDto> CreateAsync(CreateTripDto dto)
    {
        // Das Spiel wurde schon im Endpunkt geprüft.
        var trip = new Trip
        {
            Id = Guid.NewGuid(),
            MatchId = dto.MatchId!.Value,
            TravelMode = dto.TravelMode!.Value,
            DistanceKm = dto.DistanceKm,
            Friends = dto.Friends,
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
            CreatedAt = DateTimeOffset.UtcNow,
            Expenses = (dto.Expenses ?? [])
                .Select(e => new Expense
                {
                    Id = Guid.NewGuid(),
                    Category = e.Category!.Value,
                    Description = e.Description.Trim(),
                    Amount = e.Amount
                })
                .ToList()
        };

        // Fahrt und alle Ausgaben werden mit einem einzigen SaveChangesAsync gespeichert.
        _db.Trips.Add(trip);
        await _db.SaveChangesAsync();

        return (await GetByIdAsync(trip.Id))!;
    }

    public async Task<TripDetailDto?> UpdateAsync(Guid id, UpdateTripDto dto)
    {
        // Ohne AsNoTracking: EF Core verfolgt die Fahrt und speichert nur die Änderungen.
        var trip = await _db.Trips.FindAsync(id);
        if (trip is null)
        {
            return null;
        }

        trip.MatchId = dto.MatchId!.Value;
        trip.TravelMode = dto.TravelMode!.Value;
        trip.DistanceKm = dto.DistanceKm;
        trip.Friends = dto.Friends;
        trip.Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim();
        await _db.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var trip = await _db.Trips.FindAsync(id);
        if (trip is null)
        {
            return false;
        }

        // Die Ausgaben werden per Cascade mitgelöscht.
        _db.Trips.Remove(trip);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<ExpenseResponseDto?> AddExpenseAsync(Guid tripId, CreateExpenseDto dto)
    {
        if (!await _db.Trips.AnyAsync(t => t.Id == tripId))
        {
            return null;
        }

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            TripId = tripId,
            Category = dto.Category!.Value,
            Description = dto.Description.Trim(),
            Amount = dto.Amount
        };

        _db.Expenses.Add(expense);
        await _db.SaveChangesAsync();

        return new ExpenseResponseDto(expense.Id, expense.Category, expense.Description, expense.Amount);
    }

    public async Task<bool> DeleteExpenseAsync(Guid tripId, Guid expenseId)
    {
        var expense = await _db.Expenses.FirstOrDefaultAsync(e => e.Id == expenseId && e.TripId == tripId);
        if (expense is null)
        {
            return false;
        }

        _db.Expenses.Remove(expense);
        await _db.SaveChangesAsync();
        return true;
    }
}
