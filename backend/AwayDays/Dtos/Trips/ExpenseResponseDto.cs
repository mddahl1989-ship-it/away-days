using AwayDays.Models;

namespace AwayDays.Dtos.Trips;

public record ExpenseResponseDto(
    Guid Id,
    ExpenseCategory Category,
    string Description,
    decimal Amount);
