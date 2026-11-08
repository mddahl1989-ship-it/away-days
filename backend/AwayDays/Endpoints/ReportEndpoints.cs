using System.ComponentModel.DataAnnotations;
using AwayDays.Dtos.Reports;
using AwayDays.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace AwayDays.Endpoints;

public static class ReportEndpoints
{
    public static RouteGroupBuilder MapReportEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/reports").WithTags("Reports");

        group.MapGet("/season", GetSeasonReport)
            .WithName("GetSeasonReport")
            .WithSummary("Saisonbilanz: Fahrten, Kilometer, Kosten und Bilanz der Spiele, bei denen ich dabei war")
            .ProducesValidationProblem();

        return group;
    }

    // /api/reports/season?season=2026 -> Saison 2026/27
    private static async Task<Ok<SeasonReportDto>> GetSeasonReport(
        [Range(2000, 2100)] int season,
        IReportService reportService)
    {
        return TypedResults.Ok(await reportService.GetSeasonAsync(season));
    }
}
