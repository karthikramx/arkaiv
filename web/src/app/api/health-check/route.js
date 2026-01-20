
export async function GET() {
    const currentDate = new Date().toISOString();
    const funFact = "Did you know? The first computer bug was an actual bug!";

    return Response.json({
        project: "atrium",
        version: "1.0.0",
        status: "ok",
        timestamp: currentDate,
        funFact: funFact,
        nodeVersion: process.version,
        uptime: process.uptime(),
    });
}
