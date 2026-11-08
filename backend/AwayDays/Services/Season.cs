namespace AwayDays.Services;

// Eine Saison läuft vom 1. Juli bis zum 30. Juni. Saison 2026 = 2026/27.
public static class Season
{
    public static DateTimeOffset Start(int year) => new(year, 7, 1, 0, 0, 0, TimeSpan.Zero);

    public static DateTimeOffset End(int year) => Start(year + 1);
}
