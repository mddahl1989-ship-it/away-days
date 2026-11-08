using AwayDays.Dtos.Reports;

namespace AwayDays.Services;

public interface IReportService
{
    Task<SeasonReportDto> GetSeasonAsync(int season);
}
