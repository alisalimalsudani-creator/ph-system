# نظام الصيدلية الذكي — النسخة الجاهزة للنشر

مجلد جاهز للرفع المباشر على GitHub ثم Cloudflare Pages. **لا يحتاج بناء** (`npm install` غير مطلوب).

## المميزات

- ✅ نقطة بيع (POS) مع فاحص تضارب دوائي تلقائي (28 تفاعل مدمج)
- ✅ إدارة الأدوية مع **استيراد جماعي CSV حتى 10,000 دواء** (chunked bulkAdd + progress bar)
- ✅ متابعة الصلاحية والمخزون المنخفض
- ✅ **مساعد ChatGPT مجاني** عبر Puter.js — بلا مفتاح API ولا إعدادات
- ✅ مساعد Claude (اختياري، بمفتاحك الخاص)
- ✅ نسخ احتياطي JSON + CSV
- ✅ يعمل أوفلاين (IndexedDB)

## البنية

```
pharmacy-deploy/
├── index.html                # التطبيق كاملاً (React + Tailwind + Dexie + Puter عبر CDN)
├── functions/
│   └── api/
│       └── chat.js           # Cloudflare Pages Function — وسيط Claude (اختياري)
└── README.md
```

## النشر (خطوة بخطوة)

### 1) ارفع على GitHub

1. ادخل https://github.com/new
2. اسم المستودع: `ph-system` (أو أي اسم)
3. اضغط **Create repository**
4. في الصفحة التالية اضغط الرابط **uploading an existing file**
5. اسحب المحتويات الثلاث (index.html + functions + README.md) من المجلد
6. اضغط **Commit changes**

### 2) اربط Cloudflare Pages

1. https://dash.cloudflare.com → **Workers & Pages**
2. **Create** → **Pages** → **Connect to Git**
3. اختر المستودع `ph-system`
4. **إعدادات البناء:**
   - Framework preset: **None**
   - Build command: اتركه فارغاً
   - Build output directory: `/`
5. **Save and Deploy**

خلال ~30 ثانية ستحصل على رابط مثل `https://ph-system.pages.dev`.

### 3) (اختياري) تفعيل Claude بمفتاحك الخاص

المساعد المجاني (ChatGPT عبر Puter) يعمل فوراً بلا إعدادات. إذا أردت استعمال Claude بمفتاحك:

1. Cloudflare Pages → مشروعك → **Settings** → **Environment variables**
2. أضف في بيئة **Production**:
   - `ANTHROPIC_API_KEY` = مفتاحك من https://console.anthropic.com (اضغط **Encrypt**)
   - `ANTHROPIC_MODEL` = `claude-sonnet-4-5` (اختياري)
3. **Deployments** → **Retry deployment**
4. من تبويب "المساعد الذكي" في التطبيق، بدّل الموفّر إلى "Claude".

## الاستيراد الجماعي للأدوية (حتى 10,000 دواء)

من **الإعدادات** → قسم **استيراد جماعي للأدوية (CSV)**:

1. اضغط **⬇ تنزيل القالب** لتحصل على `medicines-template.csv`.
2. افتحه في Excel أو Google Sheets، املأ الصفوف، احفظ كـ **CSV UTF-8**.
3. ارجع للتطبيق واضغط **📥 استيراد CSV**.
4. اختر:
   - **OK** → إضافة/تحديث (Merge حسب الباركود أو الاسم)
   - **Cancel** → مسح الجدول وإعادة الملء بالكامل (Replace)

الأعمدة المطلوبة:
```
nameAr, name, activeIngredient, category, form, strength, barcode,
purchasePrice, sellingPrice, quantity, expiry
```

- `expiry` بصيغة `YYYY-MM-DD` مثل `2027-06-30`.
- الأسعار والكميات أرقام فقط (بدون عملة أو فواصل).
- الاستيراد يتم على دفعات 500 سجل مع شريط تقدم — 10,000 دواء خلال ثوانٍ.

## التحديث لاحقاً

عدّل `index.html` على GitHub أو ارفع نسخة جديدة → Cloudflare ينشر تلقائياً.

## إخلاء مسؤولية طبي

هذا النظام أداة مساعدة فقط. القرار الصيدلاني النهائي دائماً مسؤولية الصيدلي المرخّص.
