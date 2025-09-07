/* =========================
   إعدادات قابلة للتعديل
========================= */
// ضع بيانات التواصل الخاصة بك هنا:
const OWNER_WHATSAPP = "201040707531"; // رقم واتساب بدون + (مثال: 201012345678 لمصر)
const OWNER_EMAIL = "nursego25@gmail.com"; // بريدك الإلكتروني لاستقبال الطلبات

// قائمة الكورسات — حرّر كما تحب
const COURSES = [
  {
    id: "de-b1",
    title: "كورس B1 Netzwerk حديث",
    desc: "تدريب عملي مع محادثات واقعية بطريقة حديثة.",
    price: "3,500 EGP",
    duration: "8 أسابيع",
    level: "B1",
    mode: "أونلاين مباشر / مسجل"
  },
  {
    id: "en-conv",
    title: "تخليص اجراءات بيشايد",
    desc: "تخليص المعادلة في وقت قليل جدا وبسعر مميز",
    price: "السعر يختلف من ولاية لولاية",
    duration: "6 أسابيع",
    level: "All levels",
    mode: "أونلاين / مسجل"
  },
  {
    id: "pmp-prep",
    title: "إعداد لاختبار PMP®",
    desc: "تغطية كاملة للمحتوى مع بنك أسئلة ومشاريع مصغّرة.",
    price: "6,900 EGP",
    duration: "10 أسابيع",
    level: "Advanced",
    mode: "أونلاين مباشر"
  },
  {
    id: "digital-marketing",
    title: "تسويق رقمي عملي",
    desc: "من الحملات الإعلانية للتحليلات. تطبيق على مشاريع حقيقية.",
    price: "4,500 EGP",
    duration: "7 أسابيع",
    level: "Intermediate",
    mode: "أونلاين مباشر"
  },
  {
    id: "python-beginner",
    title: "برمجة بايثون للمبتدئين",
    desc: "أساسيات البرمجة + مشاريع صغيرة لبناء السيرة الذاتية.",
    price: "2,800 EGP",
    duration: "6 أسابيع",
    level: "Beginner",
    mode: "أونلاين / مسجل"
  },
  {
    id: "interview-prep",
    title: "إعداد لمقابلات العمل",
    desc: "تمارين أسئلة شائعة + محاكاة مقابلة وتغذية راجعة.",
    price: "1,500 EGP",
    duration: "3 أسابيع",
    level: "All levels",
    mode: "أونلاين مباشر"
  }
];

/* =========================
   وظائف الصفحة
========================= */
const grid = document.getElementById('course-grid');
const courseSelect = document.getElementById('course-select');
const yearEl = document.getElementById('year');
const enrollModal = document.getElementById('enroll-modal');
const enrollForm = document.getElementById('enroll-form');

yearEl.textContent = new Date().getFullYear();

// روابط تواصل مباشرة في قسم "تواصل معنا"
const whatsappDirect = document.getElementById('whatsapp-direct');
const emailDirect = document.getElementById('email-direct');
if (OWNER_WHATSAPP) {
  whatsappDirect.href = 'https://wa.me/' + OWNER_WHATSAPP + '?text=' + encodeURIComponent('مرحباً، لدي استفسار بخصوص الكورسات.');
} else {
  whatsappDirect.removeAttribute('href');
  whatsappDirect.style.opacity = 0.6;
}
if (OWNER_EMAIL) {
  emailDirect.href = 'mailto:' + OWNER_EMAIL + '?subject=' + encodeURIComponent('استفسار عن الكورسات');
} else {
  emailDirect.removeAttribute('href');
  emailDirect.style.opacity = 0.6;
}

// بناء الكروت
function renderCourses() {
  grid.innerHTML = '';
  COURSES.forEach(course => {
    // كارت
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
      </div>
    `;
    grid.appendChild(card);
  });

  // ملء قائمة الاختيار في الفورم
  courseSelect.innerHTML = COURSES.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
}
renderCourses();

// فتح/إغلاق المودال
function openModal(courseId) {
  if (courseId) {
    courseSelect.value = courseId;
  }
  enrollModal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  enrollModal.setAttribute('aria-hidden', 'true');
}
document.addEventListener('click', (e) => {
  const enrollBtn = e.target.closest('[data-enroll]');
  if (enrollBtn) {
    e.preventDefault();
    openModal(enrollBtn.getAttribute('data-enroll'));
  }
  if (e.target.matches('[data-close]')) {
    closeModal();
  }
});

// إرسال الطلب (واتساب أو إيميل)
enrollForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(enrollForm);
  const name = (formData.get('name') || '').trim();
  const phone = (formData.get('phone') || '').trim();
  const email = (formData.get('email') || '').trim();
  const courseId = formData.get('course');
  const contact = formData.get('contact');
  const note = (formData.get('note') || '').trim();

  // تحقّق بسيط
  if (!name || !phone || !email || !courseId) {
    alert('من فضلك املأ كل البيانات المطلوبة.');
    return;
  }

  const course = COURSES.find(c => c.id === courseId);
  const msg = [
    `طلب تسجيل اهتمام بكورس: ${course ? course.title : courseId}`,
    `الاسم: ${name}`,
    `هاتف (واتساب): ${phone}`,
    `إيميل: ${email}`,
    note ? `ملاحظات: ${note}` : null
  ].filter(Boolean).join('\n');

  if (contact === 'whatsapp') {
    if (!OWNER_WHATSAPP) {
      alert('لم يتم ضبط رقم واتساب المستلم. حرّر OWNER_WHATSAPP في assets/app.js');
      return;
    }
    const wa = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(wa, '_blank');
  } else {
    if (!OWNER_EMAIL) {
      alert('لم يتم ضبط الإيميل المستلم. حرّر OWNER_EMAIL في assets/app.js');
      return;
    }
    const mail = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent('طلب تسجيل كورس')}&body=${encodeURIComponent(msg)}`;
    window.location.href = mail;
  }

  closeModal();
  enrollForm.reset();
});

// إغلاق بالمفتاح Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
