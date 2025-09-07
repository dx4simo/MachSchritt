/* =========================
   إعدادات قابلة للتعديل
========================= */
// ضع رقم واتساب الخاص بك للزر المباشر في قسم "تواصل معنا"
const OWNER_WHATSAPP = "201040707531"; // مثال: 201012345678 لمصر (من غير +)

// رابط تطبيق Google Apps Script (Web App) الذي سيستقبل البيانات ويحفظها في Google Sheet
// بعد ما تجهّز السكربت وتنشره، ضع الرابط هنا:
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzzB5JnVh8uVyWAtD-AsOZHqzjXMBuAgCf5ddRXtT6kX8A7M4_jf8eCJTqJW0Jr2AlvUw/exec";

/* =========================
   بيانات الكورسات
========================= */
const COURSES = [
  { id: "de-b1", title: "لغة ألمانية B1 (تحضير جوتة)", desc: "تدريب عملي مع محادثات واقعية ونماذج امتحان.", price: "3,500 EGP", duration: "8 أسابيع", level: "B1", mode: "أونلاين مباشر" },
  { id: "en-conv", title: "لغة إنجليزية — محادثة عملية", desc: "تحسين الطلاقة والنطق عبر محادثات وتمارين استماع.", price: "2,200 EGP", duration: "6 أسابيع", level: "All levels", mode: "أونلاين / مسجل" },
  { id: "pmp-prep", title: "إعداد لاختبار PMP®", desc: "تغطية كاملة للمحتوى مع بنك أسئلة ومشاريع مصغّرة.", price: "6,900 EGP", duration: "10 أسابيع", level: "Advanced", mode: "أونلاين مباشر" },
  { id: "digital-marketing", title: "تسويق رقمي عملي", desc: "من الحملات الإعلانية للتحليلات. تطبيق على مشاريع حقيقية.", price: "4,500 EGP", duration: "7 أسابيع", level: "Intermediate", mode: "أونلاين مباشر" },
  { id: "python-beginner", title: "برمجة بايثون للمبتدئين", desc: "أساسيات البرمجة + مشاريع صغيرة لبناء السيرة الذاتية.", price: "2,800 EGP", duration: "6 أسابيع", level: "Beginner", mode: "أونلاين / مسجل" },
  { id: "interview-prep", title: "إعداد لمقابلات العمل", desc: "تمارين أسئلة + محاكاة مقابلة وتغذية راجعة.", price: "1,500 EGP", duration: "3 أسابيع", level: "All levels", mode: "أونلاين مباشر" }
];

/* =========================
   DOM
========================= */
const grid = document.getElementById('course-grid');
const courseSelect = document.getElementById('course-select');
const yearEl = document.getElementById('year');
const enrollModal = document.getElementById('enroll-modal');
const enrollForm = document.getElementById('enroll-form');
const statusEl = document.getElementById('form-status');
yearEl.textContent = new Date().getFullYear();

const whatsappDirect = document.getElementById('whatsapp-direct');
if (OWNER_WHATSAPP) {
  whatsappDirect.href = 'https://wa.me/' + OWNER_WHATSAPP + '?text=' + encodeURIComponent('مرحباً، لدي استفسار بخصوص الكورسات.');
} else {
  whatsappDirect.removeAttribute('href');
  whatsappDirect.style.opacity = 0.6;
}

/* =========================
   Render
========================= */
function renderCourses() {
  grid.innerHTML = '';
  COURSES.forEach(course => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-body">
        <span class="badge">${course.mode}</span>
        <h3>${course.title}</h3>
        <p>${course.desc}</p>
        <div class="meta">
          <span>المدة: ${course.duration}</span>
          <span>المستوى: ${course.level}</span>
        </div>
      </div>
      <div class="card-footer">
        <span class="price">${course.price}</span>
        <a class="btn btn-primary" data-enroll="${course.id}" href="#">سجّل</a>
      </div>`;
    grid.appendChild(card);
  });
  courseSelect.innerHTML = COURSES.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
}
renderCourses();

/* =========================
   Modal
========================= */
function openModal(courseId) { if (courseId) courseSelect.value = courseId; enrollModal.setAttribute('aria-hidden', 'false'); }
function closeModal() { enrollModal.setAttribute('aria-hidden', 'true'); statusEl.textContent=''; statusEl.className='status'; }
document.addEventListener('click', (e) => {
  const enrollBtn = e.target.closest('[data-enroll]');
  if (enrollBtn) { e.preventDefault(); openModal(enrollBtn.getAttribute('data-enroll')); }
  if (e.target.matches('[data-close]')) { closeModal(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* =========================
   Submit to Google Sheets
========================= */
async function submitToSheet(payload){
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('PUT_YOUR_DEPLOYED')) {
    throw new Error('من فضلك ضع رابط نشر الويب لتطبيق Google Apps Script في APPS_SCRIPT_URL داخل app.js');
  }
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    // لا تضيف أي headers هنا؛ خليه يبعث text/plain لتفادي preflight
    body: JSON.stringify(payload)
  });

  // لو السيرفر سمح بالقراءة هتبقى res.ok، ولو المتصفح عامل no-cors هتبقى opaque
  if (res.ok || res.type === 'opaque') {
    return { ok: true };
  }
  throw new Error('فشل الاتصال بالخادم (Apps Script)');
}


enrollForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(enrollForm);
  const name = (formData.get('name')||'').trim();
  const phone = (formData.get('phone')||'').trim();
  const courseId = formData.get('course');
  const note = (formData.get('note')||'').trim();
  if (!name || !phone || !courseId) {
    statusEl.textContent = 'من فضلك املأ كل البيانات المطلوبة.';
    statusEl.className = 'status err';
    return;
  }
  const course = COURSES.find(c => c.id === courseId);
  const payload = {
    timestamp: new Date().toISOString(),
    name, phone,
    courseId,
    courseTitle: course ? course.title : courseId,
    note,
    source: 'landing-page'
  };
  try {
    statusEl.textContent = 'جارٍ الإرسال…';
    statusEl.className = 'status';
    const json = await submitToSheet(payload);
    statusEl.textContent = 'تم حفظ طلبك بنجاح! سنتواصل معك على واتساب.';
    statusEl.className = 'status ok';
    // افتح رسالة واتساب اختيارية بعد الحفظ
    if (OWNER_WHATSAPP){
      const msg = `طلب تسجيل اهتمام بكورس: ${payload.courseTitle}%0Aالاسم: ${name}%0Aهاتف (واتساب): ${phone}%0A${note ? 'ملاحظات: '+encodeURIComponent(note): ''}`;
      window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${msg}`, '_blank');
    }
    setTimeout(() => { closeModal(); enrollForm.reset(); }, 1200);
  } catch (err) {
    statusEl.textContent = err.message || 'حدث خطأ أثناء الإرسال.';
    statusEl.className = 'status err';
  }
});
