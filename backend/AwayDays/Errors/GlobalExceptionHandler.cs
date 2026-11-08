using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace AwayDays.Errors;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailsService;
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(IProblemDetailsService problemDetailsService, ILogger<GlobalExceptionHandler> logger)
    {
        _problemDetailsService = problemDetailsService;
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (statusCode, title, detail) = exception switch
        {
            ConflictException => (StatusCodes.Status409Conflict, "Conflict", exception.Message),
            // Fehler aus der Datenbank, z. B. ein verletzter Fremdschlüssel.
            // Die Meldung der Datenbank enthält SQL-Details, deshalb ein eigener Text.
            DbUpdateException => (StatusCodes.Status409Conflict, "Database conflict",
                "Die Änderung passt nicht zu den gespeicherten Daten und wurde nicht übernommen."),
            BadHttpRequestException badRequest => (badRequest.StatusCode, "Bad request", exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred", null)
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception for {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
        }
        else if (exception is DbUpdateException)
        {
            _logger.LogWarning(exception, "Database update failed for {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
        }

        httpContext.Response.StatusCode = statusCode;

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails =
            {
                Status = statusCode,
                Title = title,
                // Bei 500 keine Meldung an den Client: sie könnte interne Details verraten.
                Detail = detail
            }
        });
    }
}
