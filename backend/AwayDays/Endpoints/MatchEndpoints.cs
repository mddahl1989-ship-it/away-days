using System.ComponentModel.DataAnnotations;
using AwayDays.Dtos.Matches;
using AwayDays.Models;
using AwayDays.Filters;
using AwayDays.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace AwayDays.Endpoints;

public static class MatchEndpoints
{
    public static RouteGroupBuilder MapMatchEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/matches").WithTags("Matches")
            .AddEndpointFilter<RejectEmptyIdFilter>();

        group.MapGet("/", GetAllMatches)
            .WithName("GetAllMatches")
            .WithSummary("Spiele auflisten, neueste zuerst, mit optionalen Filtern")
            .ProducesValidationProblem();

        group.MapGet("/{id:guid}", GetMatchById)
            .WithName("GetMatchById")
            .WithSummary("Ein Spiel abrufen");

        group.MapPost("/", CreateMatch)
            .WithName("CreateMatch")
            .WithSummary("Ein Spiel anlegen")
            .ProducesValidationProblem();

        group.MapPut("/{id:guid}", UpdateMatch)
            .WithName("UpdateMatch")
            .WithSummary("Ein Spiel bearbeiten")
            .ProducesValidationProblem();

        group.MapDelete("/{id:guid}", DeleteMatch)
            .WithName("DeleteMatch")
            .WithSummary("Ein Spiel löschen (nur ohne Fahrten)")
            .ProducesProblem(StatusCodes.Status409Conflict);

        return group;
    }

    // Alle Filter kommen aus dem Query-String, z. B. /api/matches?q=bayern&season=2026
    private static async Task<Ok<IReadOnlyList<MatchResponseDto>>> GetAllMatches(
        string? q,
        Competition? competition,
        [Range(2000, 2100)] int? season,
        bool? isHome,
        IMatchService matchService)
    {
        return TypedResults.Ok(await matchService.GetAllAsync(q, competition, season, isHome));
    }

    private static async Task<Results<Ok<MatchResponseDto>, NotFound>> GetMatchById(Guid id, IMatchService matchService)
    {
        var match = await matchService.GetByIdAsync(id);
        return match is null ? TypedResults.NotFound() : TypedResults.Ok(match);
    }

    private static async Task<Created<MatchResponseDto>> CreateMatch(CreateMatchDto dto, IMatchService matchService)
    {
        var match = await matchService.CreateAsync(dto);
        return TypedResults.Created($"/api/matches/{match.Id}", match);
    }

    private static async Task<Results<Ok<MatchResponseDto>, NotFound>> UpdateMatch(Guid id, UpdateMatchDto dto, IMatchService matchService)
    {
        var match = await matchService.UpdateAsync(id, dto);
        return match is null ? TypedResults.NotFound() : TypedResults.Ok(match);
    }

    private static async Task<Results<NoContent, NotFound>> DeleteMatch(Guid id, IMatchService matchService)
    {
        return await matchService.DeleteAsync(id) ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}
