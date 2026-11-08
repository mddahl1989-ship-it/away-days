using AwayDays.Models;

namespace AwayDays.Dtos.Reports;

public record CategoryTotalDto(ExpenseCategory Category, decimal Total);
