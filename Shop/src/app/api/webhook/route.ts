export async function POST(request: Request) {
  const payload = await request.text();

  return Response.json({ received: true, payloadLength: payload.length, status: "ok" });
}
