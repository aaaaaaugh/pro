// JavaScript платформы SoundProject
const SRC = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

const BASE_TRACKS = [
  { id: 1, title: 'Ночной маршрут', artist: 'Lume', genre: 'electronic', genreLabel: 'Electronic', hue: 18, plays: 4812, duration: '3:42', bpm: '124 BPM', badge: 'ТРЕНД', desc: 'Атмосферный ночной бит с глубоким аналоговым басом и пульсирующими синтезаторами.', notes: 'Синтезатор · Саб-бас · Атмосфера', src: SRC(1) },
  { id: 2, title: 'Тёплый бетон', artist: 'Кора', genre: 'lofi', genreLabel: 'Lo-Fi', hue: 28, plays: 3204, duration: '2:54', bpm: '86 BPM', badge: 'НОВИНКА', desc: 'Мягкий виниловый треск, тёплое электропиано и расслабленный ритм для вечерних прогулок.', notes: 'Родес-пиано · Винил · Мягкий бит', src: SRC(2) },
  { id: 3, title: 'Сто вторая', artist: 'Дым и Ко', genre: 'hiphop', genreLabel: 'Hip-Hop', hue: 12, plays: 5631, duration: '3:18', bpm: '94 BPM', badge: 'ПОПУЛЯРНЫЙ', desc: 'Плотный андеграунд-инструментал с качающей ударной партией и индустриальным характером.', notes: '808 Бас · Сэмпл · Ударные', src: SRC(3) },
  { id: 4, title: 'Стекло', artist: 'Anya Vale', genre: 'pop', genreLabel: 'Pop', hue: 345, plays: 2988, duration: '3:10', bpm: '112 BPM', badge: 'ВЫБОР РЕДАКЦИИ', desc: 'Чистый вокал, прозрачные гитарные переборы и запоминающийся припев.', notes: 'Вокал · Гитара · Синт-поп', src: SRC(4) },
  { id: 5, title: 'Перегон', artist: 'Trans-Sib', genre: 'rock', genreLabel: 'Rock', hue: 6, plays: 1760, duration: '4:05', bpm: '138 BPM', badge: 'ИНДИ', desc: 'Энергичный гитарный рифф, живые барабаны и драйв ночной железной дороги.', notes: 'Электрогитара · Бас · Живые ударные', src: SRC(5) },
  { id: 6, title: 'Тихий лифт', artist: 'Lume', genre: 'ambient', genreLabel: 'Ambient', hue: 35, plays: 3321, duration: '4:48', bpm: '72 BPM', badge: 'АТМОСФЕРА', desc: 'Минималистичные эмбиент-пэды, создающие ощущение невесомости и спокойствия.', notes: 'Пэды · Реверберация · Текстуры', src: SRC(6) },
  { id: 7, title: 'Фонари', artist: 'Кора', genre: 'lofi', genreLabel: 'Lo-Fi', hue: 22, plays: 2104, duration: '2:40', bpm: '82 BPM', badge: 'ЧИЛЛ', desc: 'Лёгкая инструментальная зарисовка под шум дождя за окном.', notes: 'Пианино · Дождь · Лоу-фай', src: SRC(7) },
  { id: 8, title: 'Низкая вода', artist: 'Ostrov', genre: 'electronic', genreLabel: 'Electronic', hue: 16, plays: 4457, duration: '3:55', bpm: '128 BPM', badge: 'КЛУБНЫЙ', desc: 'Глубокий прогрессив-грув с нарастающей динамикой и плотной перкуссией.', notes: 'Перкуссия · Арпеджио · Бас', src: SRC(8) },
  { id: 9, title: 'Лето в метро', artist: 'Anya Vale', genre: 'pop', genreLabel: 'Pop', hue: 352, plays: 3879, duration: '3:02', bpm: '118 BPM', badge: 'ХИТ', desc: 'Солнечный инди-поп с лёгкой ностальгией по уходящему августу.', notes: 'Синты · Бэк-вокал · Грув', src: SRC(9) }
];

const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

function allTracks() {
  return BASE_TRACKS.concat(store.get('sp_uploads', []));
}

const audio = new Audio();
audio.preload = 'none';
let currentTrackId = null;

function snack(msg) {
  let el = document.getElementById('spSnack');
  if (!el) {
    el = document.createElement('div');
    el.id = 'spSnack';
    el.className = 'snack';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

function playTrack(id) {
  id = Number(id);
  const t = allTracks().find((x) => x.id === id);
  if (!t) return;

  if (currentTrackId === id) {
    audio.paused ? audio.play() : audio.pause();
    return;
  }
  currentTrackId = id;
  audio.src = t.src || SRC(1);
  audio.play().catch(() => snack('Не удалось запустить аудио — проверьте интернет-соединение.'));

  const titleEl = document.getElementById('playerTitle');
  const artistEl = document.getElementById('playerArtist');
  if (titleEl) titleEl.textContent = t.title;
  if (artistEl) artistEl.textContent = `${t.artist} · ${t.genreLabel}`;
  store.set('sp_last', id);
  snack(`Сейчас играет: ${t.artist} — ${t.title}`);
}

function stepTrack(dir) {
  const list = allTracks();
  const idx = list.findIndex((t) => t.id === currentTrackId);
  if (idx < 0) {
    playTrack(list[0].id);
    return;
  }
  playTrack(list[(idx + dir + list.length) % list.length].id);
}

function refreshPlayerUI() {
  const playing = !audio.paused;
  document.body.classList.toggle('is-playing', playing);

  const pToggle = document.getElementById('pToggle');
  if (pToggle) {
    pToggle.innerHTML = playing ? '❚❚' : '▶';
  }

  document.querySelectorAll('[data-play-track]').forEach((btn) => {
    const isThis = playing && Number(btn.dataset.playTrack) === currentTrackId;
    btn.innerHTML = isThis ? '❚❚' : '▶';
  });
}

/* ---------- Эталонная переключалка темы ---------- */
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const KEY = 'sp-theme';

  const applyTheme = (theme) => {
    root.setAttribute('data-bs-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    if (btn) {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.title = isDark ? 'Включить светлую тему' : 'Включить тёмную тему';
    }
  };

  // 1. Проверяем текущее значение
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem(KEY) || root.getAttribute('data-bs-theme') || 'dark';
  } catch (e) {}
  applyTheme(savedTheme);

  if (!btn) return;

  // 2. Обработчик клика без тяжелых блокирующих вызовов
  btn.onclick = function (e) {
    e.preventDefault();
    const current = root.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';

    btn.classList.add('is-spinning');
    setTimeout(() => btn.classList.remove('is-spinning'), 500);

    applyTheme(next);
  };
}

// Запуск инициализации
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onInit);
} else {
  onInit();
}

function onInit() {
  initTheme();
  initWave();
  initPlayer();
  initCatalog();
  initProductPage();
  initForms();
  initUploadForm();
  initBackTop();
  initNumbers();
}

/* ---------- 2. Аудио-волна на главной ---------- */
function initWave() {
  const wave = document.getElementById('wave');
  if (wave) {
    wave.innerHTML = Array.from({ length: 44 }, (_, i) => {
      const h = 20 + Math.abs(Math.sin(i * 0.48) * 55 + Math.sin(i * 1.25) * 22);
      return `<span style="--h:${h}%;--d:${(i % 9) * 0.08}s"></span>`;
    }).join('');
  }
  const heroPlay = document.getElementById('heroPlay');
  if (heroPlay) {
    heroPlay.addEventListener('click', () => playTrack(1));
  }
}

/* ---------- 3. Нижний плеер ---------- */
function initPlayer() {
  const fmt = (s) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');
  const pToggle = document.getElementById('pToggle');
  const pPrev = document.getElementById('pPrev');
  const pNext = document.getElementById('pNext');
  const barTrack = document.getElementById('pBarTrack');
  const vol = document.getElementById('pVolume');

  pToggle?.addEventListener('click', () => {
    if (currentTrackId === null) playTrack(store.get('sp_last', 1));
    else audio.paused ? audio.play() : audio.pause();
  });
  pPrev?.addEventListener('click', () => stepTrack(-1));
  pNext?.addEventListener('click', () => stepTrack(1));

  barTrack?.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const r = barTrack.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

  vol?.addEventListener('input', () => { audio.volume = vol.value / 100; });

  audio.addEventListener('timeupdate', () => {
    const fill = document.getElementById('pBarFill');
    const tm = document.getElementById('pTime');
    if (fill && audio.duration) fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    if (tm) tm.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
  });

  ['play', 'pause', 'ended'].forEach((ev) => audio.addEventListener(ev, refreshPlayerUI));
  audio.addEventListener('ended', () => stepTrack(1));
}

/* ---------- 4. Каталог и поиск ---------- */
function initCatalog() {
  const grid = document.getElementById('trackGrid');
  if (!grid) return;

  const $ = (id) => document.getElementById(id);
  const filter = $('genreFilter');
  const search = $('catalogSearch');
  const clearBtn = $('searchClear');
  const sort = $('sortSelect');
  const favBtn = $('favFilter');
  const favCountEl = $('favCount');
  const randomBtn = $('randomPick');
  const countEl = $('catalogCount');
  const empty = $('emptyState');
  const emptyText = $('emptyText');
  const resetBtn = $('resetFilters');

  const FAV_KEY = 'sp-favs';
  let favs = new Set(store.get(FAV_KEY, []));
  const saveFavs = () => store.set(FAV_KEY, Array.from(favs));
  let favOnly = false;

  const norm = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е').trim();

  function renderGrid() {
    const tracks = allTracks();
    grid.innerHTML = tracks.map((t) => {
      const isFav = favs.has(t.id);
      return `
      <article class="col-12 col-md-6 col-lg-4 track-item" data-id="${t.id}" data-genre="${t.genre}" data-plays="${t.plays}">
        <div class="track-card h-100">
          <button class="fav-btn ${isFav ? 'is-active' : ''}" type="button" data-fav="${t.id}" aria-pressed="${isFav}" aria-label="В избранное">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
          </button>
          <div class="track-card__cover" style="--h:${t.hue}">
            <span class="badge badge-soft">${t.badge || 'РЕЛИЗ'}</span>
            <div class="cover-art-ring"></div>
            <button class="play-overlay-btn" type="button" data-play-track="${t.id}" aria-label="Слушать ${t.title}">▶</button>
          </div>
          <div class="track-card__body">
            <div class="track-genre">${t.genreLabel} · ${t.artist}</div>
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
            <div class="card-meta">
              <span>Длительность <b>${t.duration}</b></span>
              <span>Прослушиваний <b>${t.plays.toLocaleString('ru-RU')}</b></span>
            </div>
            <div class="card-actions">
              <a class="text-link" href="product.html?id=${t.id}">Подробнее ↗</a>
              <button class="link-btn" type="button" data-quickview="${t.id}">Быстрый просмотр</button>
            </div>
          </div>
        </div>
      </article>`;
    }).join('');
    refreshPlayerUI();
    updateFilters();
  }

  function updateFilters() {
    const items = Array.from(grid.querySelectorAll('.track-item'));
    const genreVal = filter ? filter.value : 'all';
    const words = search ? norm(search.value).split(' ').filter(Boolean) : [];
    let visible = 0;

    items.forEach((card) => {
      const id = Number(card.dataset.id);
      const t = allTracks().find((x) => x.id === id);
      const hay = norm(`${t.title} ${t.artist} ${t.genreLabel} ${t.notes} ${t.desc}`);
      const ok = (genreVal === 'all' || card.dataset.genre === genreVal)
        && words.every((w) => hay.includes(w))
        && (!favOnly || favs.has(id));
      card.classList.toggle('d-none', !ok);
      if (ok) visible += 1;
    });

    if (countEl) countEl.textContent = String(visible);
    if (empty) empty.classList.toggle('d-none', visible > 0);
    if (visible === 0 && emptyText) {
      emptyText.textContent = favOnly && favs.size === 0
        ? 'В избранном пока пусто — нажмите ♥ на карточке трека.'
        : 'По вашему запросу треки не найдены. Попробуйте изменить фильтры.';
    }
    if (clearBtn && search) clearBtn.classList.toggle('d-none', !search.value);
    if (favCountEl) favCountEl.textContent = String(favs.size);
    if (favBtn) {
      favBtn.classList.toggle('is-on', favOnly);
      favBtn.setAttribute('aria-pressed', String(favOnly));
    }
  }

  function applySort() {
    if (!sort) return;
    const v = sort.value;
    const items = Array.from(grid.querySelectorAll('.track-item'));
    if (v === 'name') {
      items.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent, 'ru'));
    } else if (v === 'plays') {
      items.sort((a, b) => Number(b.dataset.plays) - Number(a.dataset.plays));
    } else {
      items.sort((a, b) => Number(a.dataset.id) - Number(b.dataset.id));
    }
    items.forEach((card) => grid.appendChild(card));
  }

  // Quick View Modal
  const modalEl = $('quickView');
  const bsModal = modalEl && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(modalEl) : null;
  let qvTrackId = null;

  function openQuickView(id) {
    const t = allTracks().find((x) => x.id === Number(id));
    if (!t || !bsModal) return;
    qvTrackId = t.id;
    $('qvCover').style.setProperty('--h', t.hue);
    $('qvGenre').textContent = `${t.genreLabel} · ${t.artist}`;
    $('qvTitle').textContent = t.title;
    $('qvDesc').textContent = t.desc;
    $('qvNotes').textContent = t.notes;
    $('qvDuration').textContent = t.duration;
    $('qvPlays').textContent = t.plays.toLocaleString('ru-RU');
    $('qvLink').href = `product.html?id=${t.id}`;
    $('qvPlayBtn').dataset.playTrack = t.id;
    paintQvFav();
    bsModal.show();
  }

  function paintQvFav() {
    const b = $('qvFav');
    if (!b || !qvTrackId) return;
    const on = favs.has(qvTrackId);
    b.textContent = on ? '♥ В избранном' : '♡ В избранное';
    b.classList.toggle('is-on', on);
  }

  function toggleFav(id) {
    id = Number(id);
    if (favs.has(id)) favs.delete(id);
    else favs.add(id);
    saveFavs();
    const btn = grid.querySelector(`[data-fav="${id}"]`);
    if (btn) {
      btn.classList.toggle('is-active', favs.has(id));
      btn.classList.remove('pop');
      void btn.offsetWidth;
      btn.classList.add('pop');
    }
    snack(favs.has(id) ? 'Трек добавлен в избранное' : 'Трек убран из избранного');
    updateFilters();
    paintQvFav();
  }

  grid.addEventListener('click', (e) => {
    const fav = e.target.closest('[data-fav]');
    if (fav) { toggleFav(fav.dataset.fav); return; }
    const play = e.target.closest('[data-play-track]');
    if (play) { playTrack(play.dataset.playTrack); return; }
    const qv = e.target.closest('[data-quickview]');
    if (qv) openQuickView(qv.dataset.quickview);
  });

  $('qvFav')?.addEventListener('click', () => { if (qvTrackId) toggleFav(qvTrackId); });
  $('qvPlayBtn')?.addEventListener('click', (e) => playTrack(e.currentTarget.dataset.playTrack));

  randomBtn?.addEventListener('click', () => {
    const pool = Array.from(grid.querySelectorAll('.track-item:not(.d-none)'));
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const id = Number(pick.dataset.id);
    pick.scrollIntoView({ behavior: 'smooth', block: 'center' });
    playTrack(id);
    openQuickView(id);
  });

  search?.addEventListener('input', updateFilters);
  clearBtn?.addEventListener('click', () => { search.value = ''; updateFilters(); search.focus(); });
  filter?.addEventListener('change', updateFilters);
  sort?.addEventListener('change', applySort);
  favBtn?.addEventListener('click', () => { favOnly = !favOnly; updateFilters(); });
  resetBtn?.addEventListener('click', () => {
    if (filter) filter.value = 'all';
    if (search) search.value = '';
    if (sort) sort.value = 'default';
    favOnly = false;
    applySort();
    updateFilters();
  });

  const q = new URLSearchParams(window.location.search).get('q');
  if (q && search) search.value = q;

  document.addEventListener('tracks:changed', renderGrid);
  renderGrid();
}

/* ---------- 5. Страница одного трека (product.html) ---------- */
function initProductPage() {
  const titleEl = document.getElementById('trackDetailTitle');
  if (!titleEl) return;
  const id = Number(new URLSearchParams(window.location.search).get('id')) || 1;
  const t = allTracks().find((x) => x.id === id) || BASE_TRACKS[0];

  document.title = `${t.title} — ${t.artist} | SoundProject`;
  document.getElementById('trackBreadcrumb').textContent = t.title;
  document.getElementById('trackCoverBox').style.setProperty('--h', t.hue);
  document.getElementById('trackArtistLabel').textContent = `${t.artist.toUpperCase()} · ${t.genreLabel.toUpperCase()}`;
  titleEl.innerHTML = `${t.title}<br><em>${t.artist}</em>`;
  document.getElementById('trackLead').textContent = t.desc;
  document.getElementById('trackDuration').textContent = t.duration;
  document.getElementById('trackPlays').textContent = t.plays.toLocaleString('ru-RU');
  document.getElementById('trackBpm').textContent = t.bpm || '120 BPM';
  document.getElementById('trackNotes').textContent = t.notes;

  document.getElementById('trackPlayHero')?.addEventListener('click', () => playTrack(t.id));
}

/* ---------- 6. Валидация форм ---------- */
function initForms() {
  [
    { id: 'orderForm', alertId: 'orderAlert', showModal: true },
    { id: 'contactForm', alertId: 'contactAlert', showModal: false }
  ].forEach(({ id, alertId, showModal }) => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        form.querySelector(':invalid')?.focus();
        return;
      }
      const alertBox = document.getElementById(alertId);
      if (alertBox) {
        alertBox.classList.remove('d-none');
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (showModal && window.bootstrap) {
        const m = document.getElementById('successModal');
        if (m) window.bootstrap.Modal.getOrCreateInstance(m).show();
      }
      snack('Заявка успешно отправлена!');
      form.reset();
      form.classList.remove('was-validated');
    });
  });
}

/* ---------- 7. Загрузка трека (Модалка) ---------- */
function initUploadForm() {
  const form = document.getElementById('uploadForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    const genreSelect = document.getElementById('upGenre');
    const genreLabel = genreSelect.options[genreSelect.selectedIndex].text;
    const uploads = store.get('sp_uploads', []);
    uploads.push({
      id: Date.now(),
      title: document.getElementById('upTitle').value.trim(),
      artist: document.getElementById('upArtist').value.trim(),
      genre: genreSelect.value,
      genreLabel: genreLabel,
      hue: Math.floor(Math.random() * 35) + 8,
      plays: 1,
      duration: '3:15',
      bpm: '120 BPM',
      badge: 'НОВЫЙ РЕЛИЗ',
      desc: 'Новый независимый релиз, загруженный пользователем на платформу SoundProject.',
      notes: `${genreLabel} · Независимый релиз`,
      src: SRC(1)
    });
    store.set('sp_uploads', uploads);

    if (window.bootstrap) {
      window.bootstrap.Modal.getInstance(document.getElementById('uploadModal'))?.hide();
    }
    form.reset();
    form.classList.remove('was-validated');
    snack('Трек успешно опубликован в каталоге!');
    document.dispatchEvent(new CustomEvent('tracks:changed'));
  });
}

/* ---------- 8. Кнопка «Наверх» и анимация чисел ---------- */
function initBackTop() {
  const bt = document.getElementById('backTop');
  if (!bt) return;
  window.addEventListener('scroll', () => bt.classList.toggle('visible', window.scrollY > 280));
  bt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initNumbers() {
  const items = document.querySelectorAll('.advantage-number, .stat-box strong, .catalog-count, .hero-note__count');
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('number-visible');
        o.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });
  items.forEach((el) => {
    el.classList.add('number-animate');
    obs.observe(el);
  });
}

document.addEventListener('click', (e) => {
  const p = e.target.closest('[data-play-track]');
  if (p && !p.closest('#trackGrid')) playTrack(p.dataset.playTrack);
});
