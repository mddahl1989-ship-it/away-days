using System.ComponentModel.DataAnnotations;
using AwayDays.Models;

namespace AwayDays.Dtos.Trips;

// Beim Bearbeiten ändern sich nur die Fahrtdaten. Ausgaben haben eigene Endpunkte.
public record UpdateTripDto(
    [Required(ErrorMessage = "Bitte wähle ein Spiel.")] Guid? MatchId,
    [Required(ErrorMessage = "Bitte wähle die Anreise.")] TravelMode? TravelMode,
    [Range(0, 5000, ErrorMessage = "Kilometer: 0 bis 5.000.")] int DistanceKm,
    [Range(0, 50, ErrorMessage = "Mitfahrer: 0 bis 50.")] int Friends,
    [StringLength(1000, ErrorMessage = "Notizen: höchstens 1.000 Zeichen.")] string? Notes);
