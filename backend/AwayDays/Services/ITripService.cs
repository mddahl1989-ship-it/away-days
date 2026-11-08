using AwayDays.Dtos.Trips;

namespace AwayDays.Services;

public interface ITripService
{
    Task<IReadOnlyList<TripSummaryDto>> GetAllAsync(int? season);
    Task<TripDetailDto?> GetByIdAsync(Guid id);
    Task<bool> MatchExistsAsync(Guid matchId);
    Task<TripDetailDto> CreateAsync(CreateTripDto dto);
    Task<TripDetailDto?> UpdateAsync(Guid id, UpdateTripDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<ExpenseResponseDto?> AddExpenseAsync(Guid tripId, CreateExpenseDto dto);
    Task<bool> DeleteExpenseAsync(Guid tripId, Guid expenseId);
}
