const OWNER_WHATSAPP = "201040707531";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqxS66JOGQjJxuTDB9nB0oIJwZCmznlvF2FN2CWwsOo8PP4mup02IAHBi_ZyiHvWEPlQ/exec";

const COURSES = [
  { id: "de-b1", title: " كورس لغة ألمانية B1(متميز)", desc: "تدريب عملي مع محادثات واقعية بشكل متميز جدا.", price: "3,500 EGP", duration: "8 أسابيع", level: "B1", mode: "مسجل/أونلاين مباشر", image: "img_de-b1.svg", sample: "https://www.youtube.com/watch?v=ypGJlVy5luo" },
  { id: "en-conv", title: "لغة إنجليزية — محادثة عملية", desc: "تحسين الطلاقة والنطق عبر محادثات وتمارين استماع.", price: "2,200 EGP", duration: "6 أسابيع", level: "All levels", mode: "أونلاين / مسجل", image: "img_en-conv.svg", sample: "https://www.youtube.com/watch?v=ypGJlVy5luo"},
  { id: "pmp-prep", title: "إعداد لاختبار PMP®", desc: "تغطية كاملة للمحتوى مع بنك أسئلة ومشاريع مصغّرة.", price: "6,900 EGP", duration: "10 أسابيع", level: "Advanced", mode: "أونلاين مباشر", image: "img_pmp-prep.svg", sample: "https://www.youtube.com/watch?v=ypGJlVy5luo"},
  { id: "digital-marketing", title: "تسويق رقمي عملي", desc: "من الحملات الإعلانية للتحليلات. تطبيق على مشاريع حقيقية.", price: "4,500 EGP", duration: "7 أسابيع", level: "Intermediate", mode: "أونلاين مباشر", image: "img_digital-marketing.svg", sample: "https://www.youtube.com/watch?v=ypGJlVy5luo"},
  { id: "python-beginner", title: "برمجة بايثون للمبتدئين", desc: "أساسيات البرمجة + مشاريع صغيرة.", price: "2,800 EGP", duration: "6 أسابيع", level: "Beginner", mode: "أونلاين / مسجل", image: "img_python-beginner.svg", sample: "https://www.youtube.com/watch?v=ypGJlVy5luo"},
  { id: "interview-prep", title: "إعداد لمقابلات العمل", desc: "تمارين أسئلة + محاكاة مقابلة وتغذية راجعة.", price: "1,500 EGP", duration: "3 أسابيع", level: "All levels", mode: "أونلاين مباشر", image: "img_interview-prep.svg", sample: "https://www.youtube.com/watch?v=ypGJlVy5luo"}
];

const grid = document.getElementById('course-grid');
const courseSelect = document.getElementById('course-select');
const yearEl = document.getElementById('year');
const enrollModal = document.getElementById('enroll-modal');
const enrollForm = document.getElementById('enroll-form');
const statusEl = document.getElementById('form-status');
yearEl.textContent = new Date().getFullYear();

const whatsappDirect = document.getElementById('whatsapp-direct');
if (OWNER_WHATSAPP) {
  whatsappDirect.href = 'https://wa.me/' + OWNER_WHATSAPP + '?text=' + encodeURIComponent('مرحباً، لدي استفسار بخصوص الخدمات.');
} else {
  whatsappDirect.removeAttribute('href');
  whatsappDirect.style.opacity = 0.6;
}

function renderCourses() {
  grid.innerHTML = '';
  COURSES.forEach(course => {
    const card = document.createElement('article');
    card.className = 'card tilt';
    card.innerHTML = `
  <figure class="card-media">
    <img src="${course.image}" alt="${course.title}" loading="lazy" />
  </figure>
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
    <div class="actions">
      ${course.sample ? `<a class="btn btn-ghost" href="${course.sample}" target="_blank" rel="noopener">شاهد عينة</a>` : ''}
      <a class="btn btn-primary" data-enroll="${course.id}" href="#">سجّل</a>
    </div>
  </div>`;
    grid.appendChild(card);
  });
  courseSelect.innerHTML = COURSES.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
}
renderCourses();

function addTilt(el){
  const damp = 24;
  el.addEventListener('mousemove', (e)=>{
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rotateY = (px - 0.5) * damp;
    const rotateX = (0.5 - py) * damp;
    el.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  el.addEventListener('mouseleave', ()=>{
    el.style.transform = '';
  });
}
// القديم:
// document.querySelectorAll('.tilt').forEach(addTilt);

// الجديد: فعِّل الـ tilt بس على الماوس (مش اللمس)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.tilt').forEach(addTilt);
}

function openModal(courseId) { if (courseId) courseSelect.value = courseId; enrollModal.setAttribute('aria-hidden', 'false'); }
function closeModal() { enrollModal.setAttribute('aria-hidden', 'true'); statusEl.textContent=''; statusEl.className='status'; }
document.addEventListener('click', (e) => {
  const enrollBtn = e.target.closest('[data-enroll]');
  if (enrollBtn) { e.preventDefault(); openModal(enrollBtn.getAttribute('data-enroll')); }
  if (e.target.matches('[data-close]')) { closeModal(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

async function submitToSheet(payload){
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('PUT_YOUR_DEPLOYED')) {
    throw new Error('ضع رابط Web App الصحيح في APPS_SCRIPT_URL داخل app.js');
  }
  const res = await fetch(APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) });
  if (res.ok || res.type === 'opaque') return { ok: true };
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
    await submitToSheet(payload);
    statusEl.textContent = 'تم حفظ طلبك بنجاح!';
    statusEl.className = 'status ok';
    if (OWNER_WHATSAPP){
      const msg = `طلب تسجيل: ${payload.courseTitle}%0Aالاسم: ${encodeURIComponent(name)}%0Aالهاتف: ${encodeURIComponent(phone)}%0A${note ? 'ملاحظات: '+encodeURIComponent(note): ''}`;
      window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${msg}`, '_blank');
    }
    setTimeout(() => { closeModal(); enrollForm.reset(); }, 900);
  } catch (err) {
    statusEl.textContent = err.message || 'حدث خطأ أثناء الإرسال.';
    statusEl.className = 'status err';
  }
});
