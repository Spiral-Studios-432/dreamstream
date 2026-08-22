import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { secrets } from 'base44:runtime';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const expectedToken = secrets.get('REFLECTION_REMINDER_TOKEN');

    let suppliedToken = req.headers.get('x-automation-token');
    if (!suppliedToken) {
      try {
        const body = await req.json();
        if (body && typeof body === 'object') suppliedToken = body.token;
      } catch { /* no JSON body — continue */ }
    }

    const tokenOk = expectedToken && suppliedToken && suppliedToken === expectedToken;
    let adminOk = false;
    if (!tokenOk) {
      try {
        const user = await base44.auth.me();
        adminOk = !!user && user.role === 'admin';
      } catch { /* not authenticated — not an admin run */ }
    }

    if (!tokenOk && !adminOk) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const today = new Date().toISOString().split('T')[0];
    const users = await base44.asServiceRole.entities.User.list();
    let sent = 0;
    let skipped = 0;
    for (const user of users) {
      if (!user.email) continue;
      const reflections = await base44.asServiceRole.entities.Reflection.filter({ reflection_date: today, created_by: user.email });
      if (reflections.length > 0) { skipped++; continue; }
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: user.email,
        from_name: 'DreamStream',
        subject: '🌙 Your daily reflection is waiting',
        body: `Hi ${user.full_name || 'Dreamer'},\n\nJust a gentle nudge — complete today's reflection to keep your streak alive!\n\nhttps://dreamstream.base44.app/Reflections\n\nWith care,\nThe DreamStream Team`,
      });
      sent++;
    }
    return Response.json({ success: true, sent, skipped });
  } catch (error) {
    console.error(error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});