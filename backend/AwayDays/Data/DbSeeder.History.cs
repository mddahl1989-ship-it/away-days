using AwayDays.Models;

namespace AwayDays.Data;

// Frühere Saisons 2022/23 bis 2025/26: alle Pflichtspiele des BVB mit Stadion und Ergebnis
// (Bundesliga, Champions League und DFB-Pokal), Quelle: DFB-Datencenter.
// Meine Stadionbesuche: jedes Heimspiel seit dem 2:2 gegen Bayern am 08.10.2022 für pauschal 35 €,
// dazu die Auswärtsfahrten aus PastAwayTrips.
public static partial class DbSeeder
{
    private const decimal FlatRateHomeGame = 35.00m;
    private static readonly DateTimeOffset FirstHomeGameWithMe = Local(2022, 10, 8, 18, 30);

    private const Competition BL = Competition.Bundesliga;
    private const Competition CL = Competition.ChampionsLeague;
    private const Competition Pokal = Competition.DfbPokal;

    // Anstoß in deutscher Ortszeit, Sommer- und Winterzeit ergeben sich aus der Zeitzone.
    private static DateTimeOffset Local(int year, int month, int day, int hour, int minute)
    {
        var berlin = TimeZoneInfo.FindSystemTimeZoneById("Europe/Berlin");
        var local = new DateTime(year, month, day, hour, minute, 0);
        return new DateTimeOffset(local, berlin.GetUtcOffset(local));
    }

    private sealed record PastGame(DateTimeOffset KickOff, string Opponent, string Venue, Competition Competition,
        bool IsHome, int GoalsBvB, int GoalsOpponent);

    // Heimspiel im Westfalenstadion
    private static PastGame H(DateTimeOffset kickOff, string opponent, Competition competition, int bvb, int opp) =>
        new(kickOff, opponent, Home, competition, true, bvb, opp);

    // Auswärtsspiel oder Spiel auf neutralem Platz
    private static PastGame A(DateTimeOffset kickOff, string opponent, string venue, Competition competition, int bvb, int opp) =>
        new(kickOff, opponent, venue, competition, false, bvb, opp);

    private static readonly PastGame[] PastGames =
    [
        // Saison 2022/23
        A(Local(2022, 7, 29, 20, 45), "TSV 1860 München", "Grünwalder Stadion", Pokal, 3, 0),
        H(Local(2022, 8, 6, 18, 30), "Bayer 04 Leverkusen", BL, 1, 0),
        A(Local(2022, 8, 12, 20, 30), "SC Freiburg", "Europa-Park Stadion", BL, 3, 1),
        H(Local(2022, 8, 20, 15, 30), "Werder Bremen", BL, 2, 3),
        A(Local(2022, 8, 27, 15, 30), "Hertha BSC", "Olympiastadion Berlin", BL, 1, 0),
        H(Local(2022, 9, 2, 20, 30), "TSG Hoffenheim", BL, 1, 0),
        H(Local(2022, 9, 6, 18, 45), "FC Kopenhagen", CL, 3, 0),
        A(Local(2022, 9, 10, 15, 30), "RB Leipzig", "Red Bull Arena", BL, 0, 3),
        A(Local(2022, 9, 14, 21, 0), "Manchester City", "Etihad Stadium", CL, 1, 2),
        H(Local(2022, 9, 17, 15, 30), "FC Schalke 04", BL, 1, 0),
        A(Local(2022, 10, 1, 15, 30), "1. FC Köln", "RheinEnergieSTADION", BL, 2, 3),
        A(Local(2022, 10, 5, 21, 0), "FC Sevilla", "Estadio Ramón Sánchez-Pizjuán", CL, 4, 1),
        H(Local(2022, 10, 8, 18, 30), "FC Bayern München", BL, 2, 2),
        H(Local(2022, 10, 11, 21, 0), "FC Sevilla", CL, 1, 1),
        A(Local(2022, 10, 16, 17, 30), "1. FC Union Berlin", "Stadion An der Alten Försterei", BL, 0, 2),
        A(Local(2022, 10, 19, 18, 0), "Hannover 96", "Heinz von Heyden Arena", Pokal, 2, 0),
        H(Local(2022, 10, 22, 15, 30), "VfB Stuttgart", BL, 5, 0),
        H(Local(2022, 10, 25, 21, 0), "Manchester City", CL, 0, 0),
        A(Local(2022, 10, 29, 18, 30), "Eintracht Frankfurt", "Deutsche Bank Park", BL, 2, 1),
        A(Local(2022, 11, 2, 21, 0), "FC Kopenhagen", "Parken", CL, 1, 1),
        H(Local(2022, 11, 5, 15, 30), "VfL Bochum", BL, 3, 0),
        A(Local(2022, 11, 8, 18, 30), "VfL Wolfsburg", "Volkswagen Arena", BL, 0, 2),
        A(Local(2022, 11, 11, 20, 30), "Borussia Mönchengladbach", "Borussia-Park", BL, 2, 4),
        H(Local(2023, 1, 22, 15, 30), "FC Augsburg", BL, 4, 3),
        A(Local(2023, 1, 25, 18, 30), "1. FSV Mainz 05", "MEWA Arena", BL, 2, 1),
        A(Local(2023, 1, 29, 17, 30), "Bayer 04 Leverkusen", "BayArena", BL, 2, 0),
        H(Local(2023, 2, 4, 15, 30), "SC Freiburg", BL, 5, 1),
        A(Local(2023, 2, 8, 20, 45), "VfL Bochum", "Vonovia Ruhrstadion", Pokal, 2, 1),
        A(Local(2023, 2, 11, 15, 30), "Werder Bremen", "Weserstadion", BL, 2, 0),
        H(Local(2023, 2, 15, 21, 0), "FC Chelsea", CL, 1, 0),
        H(Local(2023, 2, 19, 17, 30), "Hertha BSC", BL, 4, 1),
        A(Local(2023, 2, 25, 15, 30), "TSG Hoffenheim", "PreZero Arena", BL, 1, 0),
        H(Local(2023, 3, 3, 20, 30), "RB Leipzig", BL, 2, 1),
        A(Local(2023, 3, 7, 21, 0), "FC Chelsea", "Stamford Bridge", CL, 0, 2),
        A(Local(2023, 3, 11, 18, 30), "FC Schalke 04", "Veltins-Arena", BL, 2, 2),
        H(Local(2023, 3, 18, 18, 30), "1. FC Köln", BL, 6, 1),
        A(Local(2023, 4, 1, 18, 30), "FC Bayern München", "Allianz Arena", BL, 2, 4),
        A(Local(2023, 4, 5, 20, 45), "RB Leipzig", "Red Bull Arena", Pokal, 0, 2),
        H(Local(2023, 4, 8, 15, 30), "1. FC Union Berlin", BL, 2, 1),
        A(Local(2023, 4, 15, 15, 30), "VfB Stuttgart", "Mercedes-Benz Arena", BL, 3, 3),
        H(Local(2023, 4, 22, 18, 30), "Eintracht Frankfurt", BL, 4, 0),
        A(Local(2023, 4, 28, 20, 30), "VfL Bochum", "Vonovia Ruhrstadion", BL, 1, 1),
        H(Local(2023, 5, 7, 17, 30), "VfL Wolfsburg", BL, 6, 0),
        H(Local(2023, 5, 13, 18, 30), "Borussia Mönchengladbach", BL, 5, 2),
        A(Local(2023, 5, 21, 17, 30), "FC Augsburg", "WWK Arena", BL, 3, 0),
        H(Local(2023, 5, 27, 15, 30), "1. FSV Mainz 05", BL, 2, 2),

        // Saison 2023/24
        A(Local(2023, 8, 12, 15, 30), "TSV Schott Mainz", "MEWA Arena", Pokal, 6, 1),
        H(Local(2023, 8, 19, 18, 30), "1. FC Köln", BL, 1, 0),
        A(Local(2023, 8, 26, 15, 30), "VfL Bochum", "Vonovia Ruhrstadion", BL, 1, 1),
        H(Local(2023, 9, 1, 20, 30), "1. FC Heidenheim", BL, 2, 2),
        A(Local(2023, 9, 16, 15, 30), "SC Freiburg", "Europa-Park Stadion", BL, 4, 2),
        A(Local(2023, 9, 19, 21, 0), "Paris Saint-Germain", "Parc des Princes", CL, 0, 2),
        H(Local(2023, 9, 23, 15, 30), "VfL Wolfsburg", BL, 1, 0),
        A(Local(2023, 9, 29, 20, 30), "TSG Hoffenheim", "PreZero Arena", BL, 3, 1),
        H(Local(2023, 10, 4, 21, 0), "AC Mailand", CL, 0, 0),
        H(Local(2023, 10, 7, 15, 30), "1. FC Union Berlin", BL, 4, 2),
        H(Local(2023, 10, 20, 20, 30), "Werder Bremen", BL, 1, 0),
        A(Local(2023, 10, 25, 21, 0), "Newcastle United", "St James' Park", CL, 1, 0),
        A(Local(2023, 10, 29, 15, 30), "Eintracht Frankfurt", "Deutsche Bank Park", BL, 3, 3),
        H(Local(2023, 11, 1, 18, 0), "TSG Hoffenheim", Pokal, 1, 0),
        H(Local(2023, 11, 4, 18, 30), "FC Bayern München", BL, 0, 4),
        H(Local(2023, 11, 7, 18, 45), "Newcastle United", CL, 2, 0),
        A(Local(2023, 11, 11, 15, 30), "VfB Stuttgart", "MHPArena", BL, 1, 2),
        H(Local(2023, 11, 25, 15, 30), "Borussia Mönchengladbach", BL, 4, 2),
        A(Local(2023, 11, 28, 21, 0), "AC Mailand", "San Siro", CL, 3, 1),
        A(Local(2023, 12, 3, 17, 30), "Bayer 04 Leverkusen", "BayArena", BL, 1, 1),
        A(Local(2023, 12, 6, 20, 45), "VfB Stuttgart", "MHPArena", Pokal, 0, 2),
        H(Local(2023, 12, 9, 18, 30), "RB Leipzig", BL, 2, 3),
        H(Local(2023, 12, 13, 21, 0), "Paris Saint-Germain", CL, 1, 1),
        A(Local(2023, 12, 16, 15, 30), "FC Augsburg", "WWK Arena", BL, 1, 1),
        H(Local(2023, 12, 19, 20, 30), "1. FSV Mainz 05", BL, 1, 1),
        A(Local(2024, 1, 13, 18, 30), "SV Darmstadt 98", "Merck-Stadion am Böllenfalltor", BL, 3, 0),
        A(Local(2024, 1, 20, 15, 30), "1. FC Köln", "RheinEnergieSTADION", BL, 4, 0),
        H(Local(2024, 1, 28, 17, 30), "VfL Bochum", BL, 3, 1),
        A(Local(2024, 2, 2, 20, 30), "1. FC Heidenheim", "Voith-Arena", BL, 0, 0),
        H(Local(2024, 2, 9, 20, 30), "SC Freiburg", BL, 3, 0),
        A(Local(2024, 2, 17, 15, 30), "VfL Wolfsburg", "Volkswagen Arena", BL, 1, 1),
        A(Local(2024, 2, 20, 21, 0), "PSV Eindhoven", "Philips Stadion", CL, 1, 1),
        H(Local(2024, 2, 25, 17, 30), "TSG Hoffenheim", BL, 2, 3),
        A(Local(2024, 3, 2, 15, 30), "1. FC Union Berlin", "Stadion An der Alten Försterei", BL, 2, 0),
        A(Local(2024, 3, 9, 18, 30), "Werder Bremen", "Weserstadion", BL, 2, 1),
        H(Local(2024, 3, 13, 21, 0), "PSV Eindhoven", CL, 2, 0),
        H(Local(2024, 3, 17, 17, 30), "Eintracht Frankfurt", BL, 3, 1),
        A(Local(2024, 3, 30, 18, 30), "FC Bayern München", "Allianz Arena", BL, 2, 0),
        H(Local(2024, 4, 6, 18, 30), "VfB Stuttgart", BL, 0, 1),
        A(Local(2024, 4, 10, 21, 0), "Atlético Madrid", "Estadio Metropolitano", CL, 1, 2),
        A(Local(2024, 4, 13, 15, 30), "Borussia Mönchengladbach", "Borussia-Park", BL, 2, 1),
        H(Local(2024, 4, 16, 21, 0), "Atlético Madrid", CL, 4, 2),
        H(Local(2024, 4, 21, 17, 30), "Bayer 04 Leverkusen", BL, 1, 1),
        A(Local(2024, 4, 27, 15, 30), "RB Leipzig", "Red Bull Arena", BL, 1, 4),
        H(Local(2024, 5, 1, 21, 0), "Paris Saint-Germain", CL, 1, 0),
        H(Local(2024, 5, 4, 15, 30), "FC Augsburg", BL, 5, 1),
        A(Local(2024, 5, 7, 21, 0), "Paris Saint-Germain", "Parc des Princes", CL, 1, 0),
        A(Local(2024, 5, 11, 18, 30), "1. FSV Mainz 05", "MEWA Arena", BL, 0, 3),
        H(Local(2024, 5, 18, 15, 30), "SV Darmstadt 98", BL, 4, 0),
        A(Local(2024, 6, 1, 21, 0), "Real Madrid", "Wembley-Stadion", CL, 0, 2),

        // Saison 2024/25
        A(Local(2024, 8, 17, 18, 0), "1. FC Phönix Lübeck", "Volksparkstadion", Pokal, 4, 1),
        H(Local(2024, 8, 24, 18, 30), "Eintracht Frankfurt", BL, 2, 0),
        A(Local(2024, 8, 31, 15, 30), "Werder Bremen", "Weserstadion", BL, 0, 0),
        H(Local(2024, 9, 13, 20, 30), "1. FC Heidenheim", BL, 4, 2),
        A(Local(2024, 9, 18, 21, 0), "FC Brügge", "Jan-Breydel-Stadion", CL, 3, 0),
        A(Local(2024, 9, 22, 17, 30), "VfB Stuttgart", "MHPArena", BL, 1, 5),
        H(Local(2024, 9, 27, 20, 30), "VfL Bochum", BL, 4, 2),
        H(Local(2024, 10, 1, 21, 0), "Celtic Glasgow", CL, 7, 1),
        A(Local(2024, 10, 5, 15, 30), "1. FC Union Berlin", "Stadion An der Alten Försterei", BL, 1, 2),
        H(Local(2024, 10, 18, 20, 30), "FC St. Pauli", BL, 2, 1),
        A(Local(2024, 10, 22, 21, 0), "Real Madrid", "Santiago Bernabéu", CL, 2, 5),
        A(Local(2024, 10, 26, 15, 30), "FC Augsburg", "WWK Arena", BL, 1, 2),
        A(Local(2024, 10, 29, 20, 45), "VfL Wolfsburg", "Volkswagen Arena", Pokal, 0, 1),
        H(Local(2024, 11, 2, 18, 30), "RB Leipzig", BL, 2, 1),
        H(Local(2024, 11, 5, 21, 0), "Sturm Graz", CL, 1, 0),
        A(Local(2024, 11, 9, 15, 30), "1. FSV Mainz 05", "MEWA Arena", BL, 1, 3),
        H(Local(2024, 11, 23, 15, 30), "SC Freiburg", BL, 4, 0),
        A(Local(2024, 11, 27, 21, 0), "Dinamo Zagreb", "Stadion Maksimir", CL, 3, 0),
        H(Local(2024, 11, 30, 18, 30), "FC Bayern München", BL, 1, 1),
        A(Local(2024, 12, 7, 18, 30), "Borussia Mönchengladbach", "Borussia-Park", BL, 1, 1),
        H(Local(2024, 12, 11, 21, 0), "FC Barcelona", CL, 2, 3),
        H(Local(2024, 12, 15, 17, 30), "TSG Hoffenheim", BL, 1, 1),
        A(Local(2024, 12, 22, 17, 30), "VfL Wolfsburg", "Volkswagen Arena", BL, 3, 1),
        H(Local(2025, 1, 10, 20, 30), "Bayer 04 Leverkusen", BL, 2, 3),
        A(Local(2025, 1, 14, 18, 30), "Holstein Kiel", "Holstein-Stadion", BL, 2, 4),
        A(Local(2025, 1, 17, 20, 30), "Eintracht Frankfurt", "Deutsche Bank Park", BL, 0, 2),
        A(Local(2025, 1, 21, 21, 0), "FC Bologna", "Stadio Renato Dall'Ara", CL, 1, 2),
        H(Local(2025, 1, 25, 15, 30), "Werder Bremen", BL, 2, 2),
        H(Local(2025, 1, 29, 21, 0), "Schachtar Donezk", CL, 3, 1),
        A(Local(2025, 2, 1, 15, 30), "1. FC Heidenheim", "Voith-Arena", BL, 2, 1),
        H(Local(2025, 2, 8, 15, 30), "VfB Stuttgart", BL, 1, 2),
        A(Local(2025, 2, 11, 21, 0), "Sporting Lissabon", "Estádio José Alvalade", CL, 3, 0),
        A(Local(2025, 2, 15, 15, 30), "VfL Bochum", "Vonovia Ruhrstadion", BL, 0, 2),
        H(Local(2025, 2, 19, 18, 45), "Sporting Lissabon", CL, 0, 0),
        H(Local(2025, 2, 22, 18, 30), "1. FC Union Berlin", BL, 6, 0),
        A(Local(2025, 3, 1, 15, 30), "FC St. Pauli", "Millerntor-Stadion", BL, 2, 0),
        H(Local(2025, 3, 4, 21, 0), "OSC Lille", CL, 1, 1),
        H(Local(2025, 3, 8, 15, 30), "FC Augsburg", BL, 0, 1),
        A(Local(2025, 3, 12, 18, 45), "OSC Lille", "Stade Pierre-Mauroy", CL, 2, 1),
        A(Local(2025, 3, 15, 18, 30), "RB Leipzig", "Red Bull Arena", BL, 0, 2),
        H(Local(2025, 3, 30, 17, 30), "1. FSV Mainz 05", BL, 3, 1),
        A(Local(2025, 4, 5, 15, 30), "SC Freiburg", "Europa-Park Stadion", BL, 4, 1),
        A(Local(2025, 4, 9, 21, 0), "FC Barcelona", "Estadi Olímpic Lluís Companys", CL, 0, 4),
        A(Local(2025, 4, 12, 18, 30), "FC Bayern München", "Allianz Arena", BL, 2, 2),
        H(Local(2025, 4, 15, 21, 0), "FC Barcelona", CL, 3, 1),
        H(Local(2025, 4, 20, 17, 30), "Borussia Mönchengladbach", BL, 3, 2),
        A(Local(2025, 4, 26, 15, 30), "TSG Hoffenheim", "PreZero Arena", BL, 3, 2),
        H(Local(2025, 5, 3, 18, 30), "VfL Wolfsburg", BL, 4, 0),
        A(Local(2025, 5, 11, 15, 30), "Bayer 04 Leverkusen", "BayArena", BL, 4, 2),
        H(Local(2025, 5, 17, 15, 30), "Holstein Kiel", BL, 3, 0),

        // Saison 2025/26
        A(Local(2025, 8, 18, 20, 45), "Rot-Weiss Essen", "Stadion an der Hafenstraße", Pokal, 1, 0),
        A(Local(2025, 8, 23, 18, 30), "FC St. Pauli", "Millerntor-Stadion", BL, 3, 3),
        H(Local(2025, 8, 31, 17, 30), "1. FC Union Berlin", BL, 3, 0),
        A(Local(2025, 9, 13, 15, 30), "1. FC Heidenheim", "Voith-Arena", BL, 2, 0),
        A(Local(2025, 9, 16, 21, 0), "Juventus Turin", "Allianz Stadium", CL, 4, 4),
        H(Local(2025, 9, 21, 19, 30), "VfL Wolfsburg", BL, 1, 0),
        A(Local(2025, 9, 27, 15, 30), "1. FSV Mainz 05", "MEWA Arena", BL, 2, 0),
        H(Local(2025, 10, 1, 21, 0), "Athletic Bilbao", CL, 4, 1),
        H(Local(2025, 10, 4, 15, 30), "RB Leipzig", BL, 1, 1),
        A(Local(2025, 10, 18, 18, 30), "FC Bayern München", "Allianz Arena", BL, 1, 2),
        A(Local(2025, 10, 21, 21, 0), "FC Kopenhagen", "Parken", CL, 4, 2),
        H(Local(2025, 10, 25, 18, 30), "1. FC Köln", BL, 1, 0),
        A(Local(2025, 10, 28, 18, 30), "Eintracht Frankfurt", "Deutsche Bank Park", Pokal, 1, 1),
        A(Local(2025, 10, 31, 20, 30), "FC Augsburg", "WWK Arena", BL, 1, 0),
        A(Local(2025, 11, 5, 21, 0), "Manchester City", "Etihad Stadium", CL, 1, 4),
        A(Local(2025, 11, 8, 15, 30), "Hamburger SV", "Volksparkstadion", BL, 1, 1),
        H(Local(2025, 11, 22, 15, 30), "VfB Stuttgart", BL, 3, 3),
        H(Local(2025, 11, 25, 21, 0), "FC Villarreal", CL, 4, 0),
        A(Local(2025, 11, 29, 18, 30), "Bayer 04 Leverkusen", "BayArena", BL, 2, 1),
        H(Local(2025, 12, 2, 21, 0), "Bayer 04 Leverkusen", Pokal, 0, 1),
        H(Local(2025, 12, 7, 17, 30), "TSG Hoffenheim", BL, 2, 0),
        H(Local(2025, 12, 10, 21, 0), "FK Bodø/Glimt", CL, 2, 2),
        A(Local(2025, 12, 14, 15, 30), "SC Freiburg", "Europa-Park Stadion", BL, 1, 1),
        H(Local(2025, 12, 19, 20, 30), "Borussia Mönchengladbach", BL, 2, 0),
        A(Local(2026, 1, 9, 20, 30), "Eintracht Frankfurt", "Deutsche Bank Park", BL, 3, 3),
        H(Local(2026, 1, 13, 20, 30), "Werder Bremen", BL, 3, 0),
        H(Local(2026, 1, 17, 15, 30), "FC St. Pauli", BL, 3, 2),
        A(Local(2026, 1, 20, 21, 0), "Tottenham Hotspur", "Tottenham Hotspur Stadium", CL, 0, 2),
        A(Local(2026, 1, 24, 18, 30), "1. FC Union Berlin", "Stadion An der Alten Försterei", BL, 3, 0),
        H(Local(2026, 1, 28, 21, 0), "Inter Mailand", CL, 0, 2),
        H(Local(2026, 2, 1, 17, 30), "1. FC Heidenheim", BL, 3, 2),
        A(Local(2026, 2, 7, 15, 30), "VfL Wolfsburg", "Volkswagen Arena", BL, 2, 1),
        H(Local(2026, 2, 13, 20, 30), "1. FSV Mainz 05", BL, 4, 0),
        H(Local(2026, 2, 17, 21, 0), "Atalanta Bergamo", CL, 2, 0),
        A(Local(2026, 2, 21, 18, 30), "RB Leipzig", "Red Bull Arena", BL, 2, 2),
        A(Local(2026, 2, 25, 21, 0), "Atalanta Bergamo", "Gewiss Stadium", CL, 1, 4),
        H(Local(2026, 2, 28, 18, 30), "FC Bayern München", BL, 2, 3),
        A(Local(2026, 3, 7, 18, 30), "1. FC Köln", "RheinEnergieSTADION", BL, 2, 1),
        H(Local(2026, 3, 14, 15, 30), "FC Augsburg", BL, 2, 0),
        H(Local(2026, 3, 21, 18, 30), "Hamburger SV", BL, 3, 2),
        A(Local(2026, 4, 4, 18, 30), "VfB Stuttgart", "MHPArena", BL, 2, 0),
        H(Local(2026, 4, 11, 15, 30), "Bayer 04 Leverkusen", BL, 0, 1),
        A(Local(2026, 4, 18, 15, 30), "TSG Hoffenheim", "PreZero Arena", BL, 1, 2),
        H(Local(2026, 4, 26, 17, 30), "SC Freiburg", BL, 4, 0),
        A(Local(2026, 5, 3, 17, 30), "Borussia Mönchengladbach", "Borussia-Park", BL, 0, 1),
        H(Local(2026, 5, 8, 20, 30), "Eintracht Frankfurt", BL, 3, 2),
        A(Local(2026, 5, 16, 15, 30), "Werder Bremen", "Weserstadion", BL, 2, 0),
    ];

    private sealed record PastAwayTrip(DateTimeOffset KickOff, TravelMode TravelMode, int DistanceKm, decimal Cost, string Notes);

    // Meine Auswärtsfahrten in den früheren Saisons, Kosten pauschal. Die Kilometer sind Schätzwerte.
    private static readonly PastAwayTrip[] PastAwayTrips =
    [
        new(Local(2024, 6, 1, 21, 0), TravelMode.Plane, 1000, 300.00m, "Champions-League-Finale in Wembley."),
        new(Local(2025, 9, 13, 15, 30), TravelMode.Car, 940, 80.00m, "Auswärtssieg auf der Ostalb."),
        new(Local(2026, 1, 20, 21, 0), TravelMode.Plane, 1000, 300.00m, "Champions League in London."),
    ];

    // Legt alle früheren Spiele an und eine Fahrt für jedes Spiel, bei dem ich war.
    private static void AddPastSeasons(ApplicationDbContext db)
    {
        foreach (var game in PastGames)
        {
            var match = NewMatch(game.KickOff, game.Opponent, game.Venue, game.Competition, game.IsHome,
                game.GoalsBvB, game.GoalsOpponent);
            db.Matches.Add(match);

            if (game.IsHome && game.KickOff >= FirstHomeGameWithMe)
            {
                var notes = game.KickOff == FirstHomeGameWithMe ? "Modeste köpft in der letzten Minute zum 2:2." : null;
                db.Trips.Add(NewTrip(match, TravelMode.Car, 120, 2, notes,
                    (ExpenseCategory.Other, "Heimspiel pauschal (Fahrt, Ticket, Essen und Getränke)", FlatRateHomeGame)));
                continue;
            }

            var away = PastAwayTrips.FirstOrDefault(t => t.KickOff == game.KickOff);
            if (away is not null)
            {
                db.Trips.Add(NewTrip(match, away.TravelMode, away.DistanceKm, 2, away.Notes,
                    (ExpenseCategory.Other, "Auswärtsfahrt pauschal", away.Cost)));
            }
        }
    }
}
