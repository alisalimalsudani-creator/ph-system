// Cloudflare Pages Function — وسيط Anthropic Claude API
// يُنشر تلقائياً عند push إلى GitHub → Cloudflare Pages
// المتغيرات المطلوبة (أضفها من Cloudflare Dashboard → Settings → Environment variables):
//   ANTHROPIC_API_KEY  (Encrypted)
//   ANTHROPIC_MODEL    (اختياري, الافتراضي: claude-sonnet-4-5)

const SYSTEM_PROMPT = `أنت مساعد صيدلاني ذكي يساعد الصيدلي العراقي.

المبادئ:
1. الإجابة مختصرة، دقيقة، مهنية.
2. استخدم اللهجة العراقية عند السؤال باللهجة، والعربية الفصحى عند السؤال بالفصحى.
3. عند ذكر جرعة: اذكر الجرعة للبالغ والطفل إن أمكن، مع التحذيرات المهمة.
4. عند ذكر تضارب دوائي: اذكر الآلية بإيجاز + الشدة (خطير/متوسط/خفيف) + التوصية.
5. لا تقدم تشخيصاً قطعياً. دائماً ذكّر بمراجعة الطبيب للحالات المعقدة.
6. استخدم الأسماء العلمية والتجارية معاً لو ممكن.
7. اختصر عند البديهيات. وسّع عند السؤال المعقد.

لا تتحدث في مواضيع خارج الصيدلة والطب إلا بشكل موجز ثم ارجع للموضوع الصيدلاني.`;

export async function onRequestPost({ request, env }) {
  try {
    if (!env.ANTHROPIC_API_KEY) {
      return json({
        error: 'ANTHROPIC_API_KEY غير مضبوط. أضفه في Cloudflare Pages → Settings → Environment variables.'
      }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) return json({ error: 'لا توجد رسائل' }, 400);

    // Anthropic API يتوقع أن الرسالة الأولى = user، لذا نفلتر أي نص نظام نُرسله منفصلاً
    const apiMessages = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: String(m.content || '') }));

    if (apiMessages.length === 0 || apiMessages[0].role !== 'user') {
      return json({ error: 'أول رسالة لازم تكون من المستخدم' }, 400);
    }

    const model = env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: apiMessages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return json({ error: 'Anthropic API error: ' + errText.slice(0, 400) }, response.status);
    }

    const data = await response.json();
    const content = (data.content || []).map(c => c.text || '').join('\n').trim();
    return json({ content, model });
  } catch (err) {
    return json({ error: String(err?.message || err) }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type'
    }
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*'
    }
  });
}
