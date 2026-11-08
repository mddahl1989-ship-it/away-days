using System.ComponentModel.DataAnnotations;
using AwayDays.Models;

namespace AwayDays.Dtos.Matches;

public record UpdateMatchDto(
    [Required(ErrorMessage = "Bitte gib den Anstoß an.")] DateTimeOffset? KickOff,
    [Required(ErrorMessage = "Bitte gib den Gegner an."), StringLength(100, MinimumLength = 1, ErrorMessage = "Der Gegner darf höchstens 100 Zeichen lang sein.")] string Opponent,
    [Required(ErrorMessage = "Bitte gib das Stadion an."), StringLength(100, MinimumLength = 1, ErrorMessage = "Das Stadion darf höchstens 100 Zeichen lang sein.")] string Venue,
    [Required(ErrorMessage = "Bitte wähle einen Wettbewerb.")] Competition? Competition,
    bool IsHome,
    [Range(0, 20, ErrorMessage = "Tore: bitte eine Zahl von 0 bis 20.")] int? GoalsBvB,
    [Range(0, 20, ErrorMessage = "Tore: bitte eine Zahl von 0 bis 20.")] int? GoalsOpponent);
