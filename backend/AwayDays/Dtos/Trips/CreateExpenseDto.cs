using System.ComponentModel.DataAnnotations;
using AwayDays.Models;

namespace AwayDays.Dtos.Trips;

public record CreateExpenseDto(
    [Required(ErrorMessage = "Bitte wähle eine Kategorie.")] ExpenseCategory? Category,
    [Required(ErrorMessage = "Wofür war die Ausgabe?"), StringLength(200, MinimumLength = 1, ErrorMessage = "Höchstens 200 Zeichen.")] string Description,
    [Range(0.01, 10_000, ErrorMessage = "Betrag: 0,01 bis 10.000 €.")] decimal Amount);
