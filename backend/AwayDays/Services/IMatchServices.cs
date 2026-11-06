using AwayDays.Dtos.Matches;
using AwayDays.Models;

namespace AwayDays.Services;

public interface IMatchService
{
    Task<IReadOnlyList<MatchResponseDto>> GetAllAsync(string? q, Competition? competition, int? season, bool? isHome);
    Task<MatchResponseDto?> GetByIdAsync(Guid id);
    Task<MatchResponseDto> CreateAsync(CreateMatchDto dto);
    Task<MatchResponseDto?> UpdateAsync(Guid id, UpdateMatchDto dto);
    Task<bool> DeleteAsync(Guid id);
}
