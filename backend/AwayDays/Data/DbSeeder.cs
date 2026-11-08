using AwayDays.Models;
using Microsoft.EntityFrameworkCore;

namespace AwayDays.Data;

// Startdaten für die Entwicklung: die echten BVB-Pflichtspiele der Saison 2026/27
// bis zum 07.11.2026 (mit Ergebnis) und die nächsten fünf Spiele (ohne Ergebnis).
// Die Fahrten sind meine Stadionbesuche mit meinen Kosten. Die Kilometer sind Schätzwerte.
public static class DbSeeder
{
    private const string Home = "Westfalenstadion";

    public static async Task SeedAsync(ApplicationDbContext db)
    {
        // Nur eine leere Datenbank füllen, damit beim Neustart nichts doppelt entsteht.
        if (await db.Matches.AnyAsync())
        {
            return;
        }

        // Bis zum 25.10.2026 gilt Sommerzeit (+02:00), danach Winterzeit (+01:00).
        var summer = TimeSpan.FromHours(2);
        var winter = TimeSpan.FromHours(1);

        var hsv = NewMatch(new(2026, 8, 29, 18, 30, 0, summer), "Hamburger SV", Home, Competition.Bundesliga, true, 2, 0);
        var hebc = NewMatch(new(2026, 9, 1, 20, 45, 0, summer), "HEBC Hamburg", "Volksparkstadion", Competition.DfbPokal, false, 5, 0);
        var hoffenheim = NewMatch(new(2026, 9, 5, 15, 30, 0, summer), "TSG Hoffenheim", "PreZero Arena", Competition.Bundesliga, false, 3, 2);
        var villarreal = NewMatch(new(2026, 9, 8, 21, 0, 0, summer), "FC Villarreal", Home, Competition.ChampionsLeague, true, 3, 2);
        var paderborn = NewMatch(new(2026, 9, 12, 15, 30, 0, summer), "SC Paderborn 07", Home, Competition.Bundesliga, true, 3, 0);
        var stuttgart = NewMatch(new(2026, 9, 19, 18, 30, 0, summer), "VfB Stuttgart", "MHPArena", Competition.Bundesliga, false, 1, 0);
        var bremen = NewMatch(new(2026, 10, 9, 20, 30, 0, summer), "Werder Bremen", Home, Competition.Bundesliga, true, 2, 2);
        var bodo = NewMatch(new(2026, 10, 14, 21, 0, 0, summer), "FK Bodø/Glimt", "Aspmyra Stadion", Competition.ChampionsLeague, false, 1, 0);
        var union = NewMatch(new(2026, 10, 17, 15, 30, 0, summer), "1. FC Union Berlin", "Stadion An der Alten Försterei", Competition.Bundesliga, false, 0, 0);
        var sabah = NewMatch(new(2026, 10, 20, 18, 45, 0, summer), "Sabah FC", "Olympiastadion Baku", Competition.ChampionsLeague, false, 2, 1);
        var frankfurt = NewMatch(new(2026, 10, 24, 18, 30, 0, summer), "Eintracht Frankfurt", Home, Competition.Bundesliga, true, 1, 0);
        var bremenCup = NewMatch(new(2026, 10, 27, 20, 45, 0, winter), "Werder Bremen", Home, Competition.DfbPokal, true, 3, 2);
        var bayern = NewMatch(new(2026, 10, 31, 18, 30, 0, winter), "FC Bayern München", "Allianz Arena", Competition.Bundesliga, false, 2, 2);
        var betis = NewMatch(new(2026, 11, 4, 21, 0, 0, winter), "Real Betis", Home, Competition.ChampionsLeague, true, 2, 1);
        var elversberg = NewMatch(new(2026, 11, 7, 15, 30, 0, winter), "SV Elversberg", Home, Competition.Bundesliga, true, 2, 1);

        var gladbach = NewMatch(new(2026, 11, 21, 15, 30, 0, winter), "Borussia Mönchengladbach", "Borussia-Park", Competition.Bundesliga, false, null, null);
        var arsenal = NewMatch(new(2026, 11, 24, 21, 0, 0, winter), "FC Arsenal", "Emirates Stadium", Competition.ChampionsLeague, false, null, null);
        var leverkusen = NewMatch(new(2026, 11, 29, 19, 30, 0, winter), "Bayer 04 Leverkusen", Home, Competition.Bundesliga, true, null, null);
        var schalke = NewMatch(new(2026, 12, 6, 15, 30, 0, winter), "FC Schalke 04", "Veltins-Arena", Competition.Bundesliga, false, null, null);
        var inter = NewMatch(new(2026, 12, 9, 21, 0, 0, winter), "Inter Mailand", Home, Competition.ChampionsLeague, true, null, null);

        db.Matches.AddRange(
            hsv, hebc, hoffenheim, villarreal, paderborn, stuttgart, bremen, bodo, union, sabah,
            frankfurt, bremenCup, bayern, betis, elversberg, gladbach, arsenal, leverkusen, schalke, inter);

        // Meine Stadionbesuche: alle Heimspiele außer Frankfurt, dazu Hoffenheim und München.
        // Heimspiele: Bulli 25 € und Essen/Getränke 25 €, dazu der Anteil der Dauerkarte.
        db.Trips.AddRange(
            HomeTrip(hsv, "Saisonauftakt."),
            NewTrip(hoffenheim, TravelMode.Car, 660, 3, "Auswärtssieg in Sinsheim.",
                (ExpenseCategory.Tickets, "Gästeblock", 17.50m),
                (ExpenseCategory.Travel, "Sprit, geteilt", 38.00m),
                (ExpenseCategory.Food, "Essen und Getränke", 14.50m)),
            HomeTrip(villarreal, "Erstes Champions-League-Spiel der Saison."),
            HomeTrip(paderborn, null),
            HomeTrip(bremen, "Freitagabendspiel."),
            HomeTrip(bremenCup, "Last-Minute-Sieg, weiter im Pokal."),
            NewTrip(bayern, TravelMode.Car, 1220, 3, "2:2 in München.",
                (ExpenseCategory.Tickets, "Gästeblock", 21.00m),
                (ExpenseCategory.Travel, "Sprit, geteilt", 52.00m),
                (ExpenseCategory.Food, "Essen und Getränke", 27.00m)),
            HomeTrip(betis, "Mittwochabend unter Flutlicht."),
            HomeTrip(elversberg, null));

        // Alles mit einem einzigen SaveChangesAsync speichern.
        await db.SaveChangesAsync();
    }

    private static Match NewMatch(DateTimeOffset kickOff, string opponent, string venue, Competition competition,
        bool isHome, int? goalsBvB, int? goalsOpponent) =>
        new()
        {
            Id = Guid.NewGuid(),
            KickOff = kickOff,
            Opponent = opponent,
            Venue = venue,
            Competition = competition,
            IsHome = isHome,
            GoalsBvB = goalsBvB,
            GoalsOpponent = goalsOpponent
        };

    // Die Dauerkarte kostet 310 € und gilt für 21 Heimspiele: 17 in der Bundesliga, 4 in der Champions League.
    // Pro Spiel sind das 14,76 €. Pokalspiele sind nicht enthalten.
    private const decimal SeasonTicketPrice = 310.00m;
    private const int SeasonTicketGames = 17 + 4;
    private static readonly decimal SeasonTicketShare = Math.Round(SeasonTicketPrice / SeasonTicketGames, 2);

    // Heimspiel mit dem Bulli: 25 € Fahrt, 25 € Essen und Getränke, dazu der Dauerkarten-Anteil,
    // wenn das Spiel zur Dauerkarte gehört.
    private static Trip HomeTrip(Match match, string? notes)
    {
        var trip = NewTrip(match, TravelMode.Car, 120, 2, notes,
            (ExpenseCategory.Travel, "Bulli", 25.00m),
            (ExpenseCategory.Food, "Essen und Getränke", 25.00m));

        if (match.Competition is Competition.Bundesliga or Competition.ChampionsLeague)
        {
            trip.Expenses.Add(new Expense
            {
                Id = Guid.NewGuid(),
                Category = ExpenseCategory.Tickets,
                Description = "Dauerkarte, Anteil pro Spiel (310 € / 21)",
                Amount = SeasonTicketShare
            });
        }

        return trip;
    }

    private static Trip NewTrip(Match match, TravelMode travelMode, int distanceKm, int friends, string? notes,
        params (ExpenseCategory Category, string Description, decimal Amount)[] expenses) =>
        new()
        {
            Id = Guid.NewGuid(),
            Match = match,
            TravelMode = travelMode,
            DistanceKm = distanceKm,
            Friends = friends,
            Notes = notes,
            CreatedAt = match.KickOff.AddHours(6),
            Expenses = expenses
                .Select(e => new Expense
                {
                    Id = Guid.NewGuid(),
                    Category = e.Category,
                    Description = e.Description,
                    Amount = e.Amount
                })
                .ToList()
        };
}
