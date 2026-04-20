# نظام الصيدلية الذكي — النسخة الجاهزة للنشر

مجلد جاهز للرفع المباشر على GitHub ثم Cloudflare Pages. **لا يحتاج بناء** (`npm install` غير مطلوب).

## البنية

```
pharmacy-deploy/
├── index.html                # التطبيق كاملاً (React + Tailwind + Dexie عبر CDN)
├── functions/
│   └── api/
│       └── chat.js           # Cloudflare Pages Function — وسيط Claude
└── README.md
```

## النشر (خطوة بخطوة)

### 1) ارفع على GitHub

1. ادخل https://github.com/new
2. اسم المستودع: `pharmacy`
3. اضغط **Create repository**
4. في الصفحة التالية اضغط الرابط **uploading an existing file**
5. اسحب المحتويات الثلاث (index.html + functions + README.md) من المجلد
6. اضغط **Commit changes**

### 2) اربط Cloudflare Pages

1. https://dash.cloudflare.com → **Workers & Pages**
2. **Create** → **Pages** → **Connect to Git**
3. اختر المستودع `pharmacy`
4. **إعدادات البناء:**
   - Framework preset: **None**
   - Build command: اتركه فارغاً
   - Build output directory: `/`
5. **Save and Deploy**

خلال ~30 ثانية ستحصل على رابط مثل `https://pharmacy.pages.dev`.

### 3) فعّل المساعد الذكي

1. Cloudflare Pages → مشروعك → **Settings** → **Environment variables**
2. أضف في بيئة **Production**:
   - `ANTHROPIC_API_KEY` = مفتاحك من https://console.anthropic.com (اضغط **Encrypt**)
   - `ANTHROPIC_MODEL` = `claude-sonnet-4-5` (اختياري)
3. **Deployments** → **Retry deployment**

بعد دقيقة يصير المساعد الذكي شغّال في التبويب 🤖 داخل التطبيق.

## التحديث لاحقاً

عدّل `index.html` على GitHub أو ارفع نسخة جديدة → Cloudflare ينشر تلقائياً.

## إخلاء مسؤولية طبي

هذا النظام أداة مساعدة فقط. القرار الصيدلاني النهائي دائماً مسؤولية الصيدلي المرخّص.
