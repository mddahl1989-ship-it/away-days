using System.ComponentModel.DataAnnotations;
using AwayDays.Models;

namespace AwayDays.Dto.Models;

public record CreateMatchDto(
    [Required] DateTimeOffset? Kickoff,
    [Required, StringLength(100, MinimumLength = 1)] string Opponent,
    [Required, StringLength(100, MinimumLength = 1)] string Venue,
    [Required] Competition?  Competition,
    bool IsHome,
    [Range(0, 20)] int? GoalsBvB,
    [Range(0, 20)] int? GoalsOpponent);

