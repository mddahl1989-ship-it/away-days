using System.ComponentModel.DataAnnotations;
using AwayDays.Dtos.Trips;
using AwayDays.Filters;
using AwayDays.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace AwayDays.Endpoints;

public static class TripEndpoints
{
    public static RouteGroupBuilder MapTripEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/trips").WithTags("Trips")
            .AddEndpointFilter<RejectEmptyIdFilter>();

        group.MapGet("/", GetAllTrips)
            .WithName("GetAllTrips")
            .WithSummary("Fahrten auflisten, neueste zuerst, optional nach Saison")
            .ProducesValidationProblem();

        group.MapGet("/{id:guid}", GetTripById)
            .WithName("GetTripById")
            .WithSummary("Eine Fahrt mit Spiel und Ausgaben abrufen");

        group.MapPost("/", CreateTrip)
            .WithName("CreateTrip")
            .WithSummary("Eine Fahrt mit ihren Ausgaben anlegen");

        group.MapPut("/{id:guid}", UpdateTrip)
            .WithName("UpdateTrip")
            .WithSummary("Die Daten einer Fahrt bearbeiten (ohne Ausgaben)");

        group.MapDelete("/{id:guid}", DeleteTrip)
            .WithName("DeleteTrip")
            .WithSummary("Eine Fahrt samt Ausgaben löschen");

        group.MapPost("/{tripId:guid}/expenses", AddExpense)
            .WithName("AddExpense")
            .WithSummary("Einer Fahrt eine Ausgabe hinzufügen")
            .ProducesValidationProblem();

        group.MapDelete("/{tripId:guid}/expenses/{expenseId:guid}", DeleteExpense)
            .WithName("DeleteExpense")
            .WithSummary("Eine Ausgabe löschen");

        return group;
    }

    private static async Task<Ok<IReadOnlyList<TripSummaryDto>>> GetAllTrips(
        [Range(2000, 2100)] int? season,
        ITripService tripService)
    {
        return TypedResults.Ok(await tripService.GetAllAsync(season));
    }

    private static async Task<Results<Ok<TripDetailDto>, NotFound>> GetTripById(Guid id, ITripService tripService)
    {
        var trip = await tripService.GetByIdAsync(id);
        return trip is null ? TypedResults.NotFound() : TypedResults.Ok(trip);
    }

    private static async Task<Results<Created<TripDetailDto>, ValidationProblem>> CreateTrip(
        CreateTripDto dto, ITripService tripService)
    {
        // Regel, die Daten braucht: Das Spiel muss existieren.
        if (!await tripService.MatchExistsAsync(dto.MatchId!.Value))
        {
            return MatchNotFound(dto.MatchId.Value);
        }

        var trip = await tripService.CreateAsync(dto);
        return TypedResults.Created($"/api/trips/{trip.Id}", trip);
    }

    private static async Task<Results<Ok<TripDetailDto>, NotFound, ValidationProblem>> UpdateTrip(
        Guid id, UpdateTripDto dto, ITripService tripService)
    {
        if (!await tripService.MatchExistsAsync(dto.MatchId!.Value))
        {
            return MatchNotFound(dto.MatchId.Value);
        }

        var trip = await tripService.UpdateAsync(id, dto);
        return trip is null ? TypedResults.NotFound() : TypedResults.Ok(trip);
    }

    private static async Task<Results<NoContent, NotFound>> DeleteTrip(Guid id, ITripService tripService)
    {
        return await tripService.DeleteAsync(id) ? TypedResults.NoContent() : TypedResults.NotFound();
    }

    private static async Task<Results<Created<ExpenseResponseDto>, NotFound>> AddExpense(
        Guid tripId, CreateExpenseDto dto, ITripService tripService)
    {
        var expense = await tripService.AddExpenseAsync(tripId, dto);
        return expense is null
            ? TypedResults.NotFound()
            : TypedResults.Created($"/api/trips/{tripId}/expenses/{expense.Id}", expense);
    }

    private static async Task<Results<NoContent, NotFound>> DeleteExpense(
        Guid tripId, Guid expenseId, ITripService tripService)
    {
        return await tripService.DeleteExpenseAsync(tripId, expenseId)
            ? TypedResults.NoContent()
            : TypedResults.NotFound();
    }

    private static ValidationProblem MatchNotFound(Guid matchId) =>
        TypedResults.ValidationProblem(new Dictionary<string, string[]>
        {
            ["MatchId"] = [$"Es gibt kein Spiel mit der Id '{matchId}'."]
        });
}
