using System.ComponentModel.DataAnnotations;
using AwayDays.Models;

namespace AwayDays.Dtos.Matches;

public record UpdateMatchDto(
    [Required] DateTimeOffset? KickOff,
    [Required, StringLength(100, MinimumLength = 1)] string Opponent,
    [Required, StringLength(100, MinimumLength = 1)] string Venue,
    [Required] Competition? Competition,
    bool IsHome,
    [Range(0, 20)] int? GoalsBvB,
    [Range(0, 20)] int? GoalsOpponent);