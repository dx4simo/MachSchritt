# Landing Page (No-Backend, Google Sheets Save)

لغة الواجهة: عربي/RTL — ملفات منفصلة في الجذر: `index.html`, `style.css`, `app.js`

## الميزات
- بطاقات كورسات مع الأسعار والتفاصيل
- مودال فورم يسجل (الاسم/رقم واتساب/الكورس/ملاحظات)
- يحفظ البيانات في Google Sheet عبر Google Apps Script
- فتح رسالة واتساب جاهزة بعد الحفظ (اختياري)
- تصميم احترافي بألوان متدرجة

## طريقة الإعداد (Google Sheets + Apps Script)
1) أنشئ Google Sheet جديدة وسَمِّ التاب باسم `Submissions` (أو غيّر الاسم في `Code.gs`).
2) افتح **Extensions → Apps Script** وأنشئ مشروع جديد.
3) الصق محتوى `Code.gs` في المشروع.
4) غيّر `SHEET_ID` داخل `Code.gs` إلى معرف الجدول (من رابط الشيت).
5) من **Deploy → Manage deployments → New Deployment**:
   - النوع: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone with the link**
   - انسخ رابط الـ Web App الناتج.
6) في `app.js` غيّر المتغير `APPS_SCRIPT_URL` إلى رابط النشر اللي نسخته.
7) (اختياري) عدّل `OWNER_WHATSAPP` لرقمك بدون علامة `+` لفتح رسالة مباشرة بعد الحفظ.

> ملاحظة: أول إرسال قد يطلب سماحيات عند التشغيل لأول مرة. وافِق على الأذونات.

## النشر على GitHub Pages
- ارفع الملفات الثلاثة: `index.html`, `style.css`, `app.js` (وجانبهم `README.md` لو تحب).
- فعّل GitHub Pages من الإعدادات على فرع `main` وجذر المشروع.
- افتح رابط الصفحة الناتج.

## تعديل الكورسات
داخل `app.js`، حرّر المصفوفة `COURSES` كما تشاء.

## أمان وخصوصية
- هذه الطريقة مناسبة للنماذج البسيطة. لو عندك بيانات حساسة أو حجم كبير، استخدم باك-إند حقيقي مع تحقق/Rate Limit.
