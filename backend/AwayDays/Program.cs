using System.Text.Json.Serialization;
using AwayDays.Data;
using AwayDays.Endpoints;
using AwayDays.Errors;
using AwayDays.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

//Datenbank 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))); 

// Validierung und Fehler als ProblemDetails zurückgeben
builder.Services.AddValidation();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>(); 

// Services: scoped, weil sie den DbContext benutzen (der ist auch scoped)
builder.Services.AddScoped<IMatchService, MatchService>();
builder.Services.AddScoped<ITripService, TripService>();
builder.Services.AddScoped<IReportService, ReportService>();

//Enums als Text
builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

//Api-Doku
builder.Services.AddOpenApi(options => options.AddDocumentTransformer((document, context, cancellationToken) =>
{
    document.Info.Title = "AwayDays API";
    document.Info.Description = "Spiele, Fahrten und Ausgaben eines BVB-Fans, dazu die Saisonbilanz.";
    return Task.CompletedTask;
}));

// Frontend (Vite) darf auf die API zugreifen
builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors("Frontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => options.WithTitle("AwayDays API"));

    // Datenbank beim Start automatisch auf den neuesten Stand bringen
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();

    // Beispieldaten, falls die Datenbank leer ist
    await DbSeeder.SeedAsync(db);
}

app.MapMatchEndpoints();
app.MapTripEndpoints();
app.MapReportEndpoints();

app.Run();