namespace AwayDays.Filters;

// Läuft vor dem Handler und lehnt Routen wie /api/matches/00000000-0000-0000-0000-000000000000 ab.
// Eine leere Guid ist in dieser API nie eine gültige Id. Geprüft werden alle Ids in der Route
// (id, tripId, expenseId).
public class RejectEmptyIdFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        foreach (var (key, value) in context.HttpContext.Request.RouteValues)
        {
            if (Guid.TryParse(value?.ToString(), out var id) && id == Guid.Empty)
            {
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>
                {
                    [key] = ["Die Id darf keine leere Guid sein."]
                });
            }
        }

        // Alles in Ordnung: weiter zum nächsten Filter oder zum Handler.
        return await next(context);
    }
}
