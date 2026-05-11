const cinemas = [
  { name: 'جراند أوربت سينما', city: 'القاهرة', halls: 8, rating: 4.9, price: 1250, tag: 'الأكثر طلباً', image: 'ليزر • VIP • ضيافة', path: '/cinemas/grand-orbit' },
  { name: 'أزور سكرين', city: 'الإسكندرية', halls: 6, rating: 4.8, price: 980, tag: 'إطلالة بحرية', image: 'دولبي • عائلي • حفلات', path: '/cinemas/grand-orbit' },
  { name: 'نايل فيو سينما', city: 'الجيزة', halls: 5, rating: 4.7, price: 1050, tag: 'قاعات خاصة', image: 'شاشة بانوراما • مناسبات', path: '/cinemas/grand-orbit' },
  { name: 'لومينا بارك', city: 'العاصمة الإدارية', halls: 9, rating: 4.85, price: 1420, tag: 'شركات', image: 'مؤتمرات • عروض خاصة', path: '/cinemas/grand-orbit' },
  { name: 'رويال لايت', city: 'القاهرة', halls: 7, rating: 4.75, price: 1160, tag: 'فخم', image: 'مقاعد جلدية • استقبال', path: '/cinemas/grand-orbit' },
  { name: 'سي بريز موفيز', city: 'الإسكندرية', halls: 4, rating: 4.55, price: 850, tag: 'اقتصادي', image: 'عائلي • أعياد ميلاد', path: '/cinemas/grand-orbit' }
];

const halls = [
  { name: 'قاعة اللؤلؤة', type: 'VIP', capacity: 80, rating: 4.95, price: 1250, feature: 'مقاعد استرخاء وإضاءة محيطية' },
  { name: 'قاعة أطلس', type: 'شركات', capacity: 160, rating: 4.8, price: 2100, feature: 'منصة تقديم ونظام صوت مؤتمرات' },
  { name: 'قاعة العائلة', type: 'عائلية', capacity: 55, rating: 4.7, price: 900, feature: 'خصوصية كاملة ومقاعد أطفال' },
  { name: 'قاعة آيماكس برايم', type: 'IMAX', capacity: 180, rating: 4.9, price: 2600, feature: 'شاشة عملاقة وصوت غامر' },
  { name: 'قاعة روز', type: 'VIP', capacity: 64, rating: 4.78, price: 1180, feature: 'بوفيه خاص ومدخل مستقل' },
  { name: 'قاعة ستار', type: 'شركات', capacity: 120, rating: 4.6, price: 1750, feature: 'تجهيز عروض وميكروفونات' }
];

let bookings = [
  { customer: 'مريم حسن', cinema: 'جراند أوربت', date: '2026-02-12', guests: 58, amount: 18500, status: 'مؤكد' },
  { customer: 'شركة نوفا', cinema: 'لومينا بارك', date: '2026-02-15', guests: 140, amount: 46300, status: 'قيد المراجعة' },
  { customer: 'أحمد سامي', cinema: 'أزور سكرين', date: '2026-01-30', guests: 32, amount: 9900, status: 'مؤكد' },
  { customer: 'مدرسة المستقبل', cinema: 'نايل فيو', date: '2026-03-02', guests: 95, amount: 28700, status: 'قيد المراجعة' },
  { customer: 'ليلى كريم', cinema: 'رويال لايت', date: '2026-02-01', guests: 44, amount: 13400, status: 'ملغي' },
  { customer: 'فريق أركان', cinema: 'جراند أوربت', date: '2026-03-12', guests: 110, amount: 35200, status: 'مؤكد' }
];

const pageSize = 3;
const state = { cinemaPage: 1, hallPage: 1, bookingPage: 1 };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const formatMoney = (value) => new Intl.NumberFormat('ar-EG').format(value) + ' ج.م';

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function routeTo(path, replace = false) {
  const cleanPath = path.split('?')[0] || '/';
  if (replace) history.replaceState({}, '', path);
  else history.pushState({}, '', path);
  renderRoute(cleanPath);
}

function renderRoute(path = location.pathname) {
  const known = ['/', '/cinemas', '/cinemas/grand-orbit', '/halls', '/booking', '/dashboard/bookings', '/contact'];
  const target = known.includes(path) ? path : '/';
  $$('.page-section').forEach((section) => section.classList.toggle('page-active', section.dataset.page === target));
  $$('.nav-link').forEach((link) => link.classList.toggle('active', link.getAttribute('href') === target));
  const nav = $('#navLinks');
  nav?.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  requestAnimationFrame(() => $$('.page-active .reveal, .page-active .section-heading, .page-active .filter-panel').forEach((el) => el.classList.add('is-visible')));
}

function makePagination(containerId, totalItems, currentPage, onPage) {
  const pages = Math.ceil(totalItems / pageSize);
  const container = $(containerId);
  container.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === currentPage ? 'active' : '';
    button.addEventListener('click', () => onPage(i));
    container.appendChild(button);
  }
}

function renderCinemas() {
  const search = ($('#cinemaSearch')?.value || '').trim();
  const city = $('#cinemaCity')?.value || 'all';
  const sort = $('#cinemaSort')?.value || 'rating';
  let data = cinemas.filter((item) => (city === 'all' || item.city === city) && `${item.name} ${item.city}`.includes(search));
  data.sort((a, b) => sort === 'price' ? a.price - b.price : b[sort] - a[sort]);
  const total = data.length;
  data = data.slice((state.cinemaPage - 1) * pageSize, state.cinemaPage * pageSize);
  $('#cinemaGrid').innerHTML = data.map((item) => `
    <article class="data-card">
      <div class="flex items-start justify-between gap-4"><div><span class="badge">${item.tag}</span><h3>${item.name}</h3><p>${item.image}</p></div><strong class="rating">★ ${item.rating}</strong></div>
      <div class="mt-6 grid grid-cols-3 gap-3 text-center"><span><b>${item.city}</b><small>المدينة</small></span><span><b>${item.halls}</b><small>قاعات</small></span><span><b>${formatMoney(item.price)}</b><small>من/ساعة</small></span></div>
      <div class="mt-6 flex gap-3"><a href="${item.path}" data-route class="card-action primary">عرض</a><a href="/booking?cinema=${encodeURIComponent(item.name)}" data-route class="card-action">حجز</a></div>
    </article>`).join('') || '<p class="empty-state">لا توجد سينمات مطابقة للتصفية الحالية.</p>';
  makePagination('#cinemaPagination', total, state.cinemaPage, (page) => { state.cinemaPage = page; renderCinemas(); });
}

function renderHalls() {
  const search = ($('#hallSearch')?.value || '').trim();
  const type = $('#hallType')?.value || 'all';
  const sort = $('#hallSort')?.value || 'capacity';
  let data = halls.filter((item) => (type === 'all' || item.type === type) && item.name.includes(search));
  data.sort((a, b) => sort === 'price' ? a.price - b.price : b[sort] - a[sort]);
  const total = data.length;
  data = data.slice((state.hallPage - 1) * pageSize, state.hallPage * pageSize);
  $('#hallGrid').innerHTML = data.map((item) => `
    <article class="data-card hall-card">
      <span class="badge">${item.type}</span><h3>${item.name}</h3><p>${item.feature}</p>
      <div class="mt-6 grid grid-cols-3 gap-3 text-center"><span><b>${item.capacity}</b><small>ضيف</small></span><span><b>★ ${item.rating}</b><small>تقييم</small></span><span><b>${formatMoney(item.price)}</b><small>من/ساعة</small></span></div>
      <div class="mt-6 flex gap-3"><a href="/booking?hall=${encodeURIComponent(item.name)}" data-route class="card-action primary">احجز القاعة</a><button class="card-action" onclick="showToast('تم فتح معاينة ${item.name}')">معاينة</button></div>
    </article>`).join('') || '<p class="empty-state">لا توجد قاعات مطابقة للتصفية الحالية.</p>';
  makePagination('#hallPagination', total, state.hallPage, (page) => { state.hallPage = page; renderHalls(); });
}

function renderBookings() {
  const search = ($('#bookingSearch')?.value || '').trim();
  const status = $('#bookingStatus')?.value || 'all';
  const sort = $('#bookingSort')?.value || 'date';
  let data = bookings.filter((item) => (status === 'all' || item.status === status) && `${item.customer} ${item.cinema}`.includes(search));
  data.sort((a, b) => sort === 'date' ? new Date(b.date) - new Date(a.date) : b[sort] - a[sort]);
  const total = data.length;
  data = data.slice((state.bookingPage - 1) * pageSize, state.bookingPage * pageSize);
  $('#bookingRows').innerHTML = data.map((item, index) => `
    <tr class="transition hover:bg-cream/40">
      <td class="px-5 py-4 font-semibold">${item.customer}</td><td class="px-5 py-4">${item.cinema}</td><td class="px-5 py-4">${item.date}</td><td class="px-5 py-4">${item.guests}</td><td class="px-5 py-4">${formatMoney(item.amount)}</td><td class="px-5 py-4"><span class="status ${item.status === 'مؤكد' ? 'confirmed' : item.status === 'ملغي' ? 'cancelled' : 'pending'}">${item.status}</span></td>
      <td class="px-5 py-4"><div class="flex min-w-max gap-2"><button onclick="showToast('عرض تفاصيل حجز ${item.customer}')">عرض</button><button onclick="showToast('تعديل حجز ${item.customer}')">تعديل</button><button onclick="cancelBooking(${index})">إلغاء</button><button onclick="deleteBooking(${index})">حذف</button></div></td>
    </tr>`).join('');
  makePagination('#bookingPagination', total, state.bookingPage, (page) => { state.bookingPage = page; renderBookings(); });
}

function cancelBooking(index) {
  const visible = getVisibleBookings();
  const item = visible[index];
  const original = bookings.find((booking) => booking.customer === item.customer && booking.date === item.date);
  if (original) original.status = 'ملغي';
  renderBookings();
  showToast('تم إلغاء الحجز بنجاح');
}

function deleteBooking(index) {
  const visible = getVisibleBookings();
  const item = visible[index];
  bookings = bookings.filter((booking) => !(booking.customer === item.customer && booking.date === item.date));
  renderBookings();
  showToast('تم حذف الحجز من الجدول');
}

function getVisibleBookings() {
  const search = ($('#bookingSearch')?.value || '').trim();
  const status = $('#bookingStatus')?.value || 'all';
  const sort = $('#bookingSort')?.value || 'date';
  let data = bookings.filter((item) => (status === 'all' || item.status === status) && `${item.customer} ${item.cinema}`.includes(search));
  data.sort((a, b) => sort === 'date' ? new Date(b.date) - new Date(a.date) : b[sort] - a[sort]);
  return data.slice((state.bookingPage - 1) * pageSize, state.bookingPage * pageSize);
}

function updateSummary() {
  const guests = Number($('#guestCount')?.value || 45);
  const packagePrice = Number($('#packageSelect')?.value || 0);
  const base = 1250 * 3;
  const guestsCost = guests * 75;
  const total = base + guestsCost + packagePrice;
  $('#bookingSummary').innerHTML = `<div><span>ملخص تقديري</span><strong>${formatMoney(total)}</strong></div><p>يشمل 3 ساعات قاعة، خدمة تنسيق، ورسوم تشغيل. السعر النهائي يؤكد بعد مراجعة السينما.</p><div class="summary-row"><span>عدد الضيوف</span><b>${guests}</b></div><div class="summary-row"><span>الضيافة</span><b>${formatMoney(packagePrice)}</b></div>`;
}

function initHeroSeats() {
  const container = $('#heroSeats');
  if (!container) return;
  container.innerHTML = Array.from({ length: 50 }, (_, i) => `<span class="seat ${[3, 7, 14, 28, 33, 41].includes(i) ? 'taken' : ''}"></span>`).join('');
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const route = event.target.closest('[data-route]');
    if (!route) return;
    event.preventDefault();
    routeTo(route.getAttribute('href'));
  });
  $('#menuToggle')?.addEventListener('click', () => {
    const nav = $('#navLinks');
    nav.classList.toggle('hidden');
    $('#menuToggle').setAttribute('aria-expanded', String(!nav.classList.contains('hidden')));
  });
  ['#cinemaSearch', '#cinemaCity', '#cinemaSort'].forEach((selector) => $(selector)?.addEventListener('input', () => { state.cinemaPage = 1; renderCinemas(); }));
  ['#hallSearch', '#hallType', '#hallSort'].forEach((selector) => $(selector)?.addEventListener('input', () => { state.hallPage = 1; renderHalls(); }));
  ['#bookingSearch', '#bookingStatus', '#bookingSort'].forEach((selector) => $(selector)?.addEventListener('input', () => { state.bookingPage = 1; renderBookings(); }));
  ['#guestCount', '#packageSelect'].forEach((selector) => $(selector)?.addEventListener('input', updateSummary));
  $('#bookingForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    bookings.unshift({ customer: data.get('name'), cinema: String(data.get('cinema')).split(' - ')[0], date: data.get('date'), guests: Number(data.get('guests')), amount: 12500 + Number(data.get('package')), status: 'قيد المراجعة' });
    renderBookings();
    showToast('تم إرسال طلب الحجز وإضافته للوحة الحجوزات');
    routeTo('/dashboard/bookings');
  });
  window.addEventListener('popstate', () => renderRoute(location.pathname));
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSeats();
  renderCinemas();
  renderHalls();
  renderBookings();
  updateSummary();
  bindEvents();
  renderRoute(location.pathname);
  console.log('Cinema Now platform initialized');
});
