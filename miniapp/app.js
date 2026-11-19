import { stories, validateBrief, formatBrief, faq, priceRows } from './domain.js?v=prices-20261119';
const app = document.querySelector('#app');
const tg = window.Telegram?.WebApp;
let filter = 'all', selected = 'custom', draft = {}, reviewing = false;
let currentPage = 'home';
const initialPage = new URLSearchParams(location.search).get('view') === 'brief' ? 'brief' : 'home';
const returnPages = {brief: 'home', corporate: 'home', about: 'home', prices: 'home'};
let faqTopic = faq[0].id;
const e = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const manager='https://t.me/manageryas';
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.style.display='none',4000);}
function managerURL(message = '') {
  const url = new URL(manager);
  if (message) url.searchParams.set('text', message);
  return url.href;
}

function openManager(event) {
  if (event?.currentTarget?.tagName === 'A' &&
      (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
  const href = event?.currentTarget?.href || manager;
  try {
    if (tg?.initData && tg.openTelegramLink) {
      tg.openTelegramLink(href);
      event?.preventDefault();
      return;
    }
  } catch {
    // The browser link also works when Telegram cannot handle the request.
  }
  if (event?.currentTarget?.tagName !== 'A') location.href = href;
}

function theme() {
  document.documentElement.dataset.theme = tg?.colorScheme === 'dark' ? 'dark' : 'light';
}
if (tg) {
  tg.ready();
  tg.expand();
  theme();
  tg.onEvent('themeChanged', theme);
  tg.BackButton?.onClick(back);
}

const player = document.querySelector('#player');
const video = player.querySelector('video');
const playerError = player.querySelector('.player-error');
video.addEventListener('error', () => {
  if (player.open && video.hasAttribute('src')) playerError.hidden = false;
});
let expandedApp = false;

function syncBackButton() {
  if (player.open || currentPage !== 'home') tg?.BackButton?.show();
  else tg?.BackButton?.hide();
}

function play(id) {
  const story = stories.find(item => item.id === id);
  if (!story) return;
  const media = `../assets/${id}.mp4`;
  playerError.hidden = true;
  video.preload = 'metadata';
  video.src = media;
  video.poster = `../assets/${id}.jpg`;
  player.querySelector('.player-link').href = media;
  player.querySelector('h2').textContent = story.title;
  player.querySelector('h2 + p').textContent = 'Демонстрационный ролик. Визуальные материалы созданы с помощью ИИ.';
  player.showModal();
  syncBackButton();
  video.play().catch(() => {});
}

async function fullscreenVideo() {
  if (video.webkitSupportsFullscreen && typeof video.webkitEnterFullscreen === 'function') {
    try { video.webkitEnterFullscreen(); return; } catch {}
  }
  if (video.requestFullscreen) {
    try { await video.requestFullscreen(); return; } catch {}
  }
  player.classList.add('player-expanded');
  if (!tg?.isFullscreen && tg?.isVersionAtLeast?.('8.0') && tg.requestFullscreen) {
    try {
      tg.requestFullscreen();
      expandedApp = true;
    } catch {}
  }
}

player.querySelector('.player-back').onclick = () => player.close();
document.querySelector('#fullscreen-video').onclick = fullscreenVideo;
player.addEventListener('close', () => {
  video.pause();
  video.removeAttribute('src');
  video.load();
  player.classList.remove('player-expanded');
  if (expandedApp) {
    expandedApp = false;
    if (tg?.isFullscreen) tg.exitFullscreen?.();
  }
  syncBackButton();
});
player.addEventListener('click', event => {
  if (event.target !== player) return;
  const rect = player.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top ||
      event.clientY > rect.bottom) player.close();
});

function pick(id) {
  selected = id;
  draft.story = id;
  reviewing = false;
  if (location.hash === '#brief') render();
  else location.hash = 'brief';
}

function card(s){return `<article class="story"><button class="poster" data-play="${s.id}" aria-label="Смотреть демо: ${e(s.title)}"><img src="../assets/${s.id}.jpg" alt="Кадр из мультфильма «${e(s.title)}»" loading="lazy"><span class="play" aria-hidden="true">▶</span><span class="duration">Демо · ${s.duration}</span></button><div class="story-body"><span class="badge ${s.id==='dragon'?'gold':''}">${s.badge}</span><h3>${s.title}</h3><p>${s.description}</p><div class="story-bottom"><small>${s.id==='corporate'?'Отдельный бриф':'Имя · образ · поздравление'}</small><button class="text-button" data-pick="${s.id}">${s.id==='corporate'?'Обсудить идею':'Выбрать историю'} ↗</button></div></div></article>`;}
function bind(){app.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>play(b.dataset.play));app.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>b.dataset.pick==='corporate'?location.hash='corporate':pick(b.dataset.pick));}
function home(){app.innerHTML=`<section class="hero"><div><div class="eyebrow">Маленький герой. Большая история.</div><h1>Сказка, в которой<br>главный герой —<br><em>ваш ребёнок.</em></h1><p>Знакомое имя, любимый образ и история, которую захочется пересмотреть всей семьёй.</p><div class="actions"><a href="#brief" class="btn sun">Заказать свою историю</a><a href="#stories" class="btn outline">Смотреть примеры</a></div></div><div class="hero-art"><img class="hero-photo" src="../assets/dragon.jpg" alt="Маленький герой помогает дракону"><div class="sun-disc" aria-hidden="true">✦</div><div class="little-note"><strong>Для самого важного зрителя</strong>С теплом, от вашей семьи</div></div></section><section class="section"><div class="section-head"><h2>С чего начнётся сказка?</h2><a href="#stories">Все истории ↗</a></div><div class="stories">${stories.slice(0,2).map(card).join('')}</div></section><section class="section"><div class="section-head"><h2>От идеи до «ещё раз!»</h2></div><div class="steps"><div class="step"><b>01 /</b><strong>Выбираем историю</strong><p>Вы рассказываете о ребёнке и поводе. Мы уточняем пожелания.</p></div><div class="step"><b>02 /</b><strong>Согласуем детали</strong><p>Образ, имя и поздравление — до производства мультфильма.</p></div><div class="step"><b>03 /</b><strong>Создаём и проверяем</strong><p>Собираем сцены в историю и проверяем фильм перед выдачей.</p></div></div></section><section class="section corporate"><img src="../assets/corporate.jpg" alt="Семья в корпоративном мультфильме" loading="lazy"><div><div class="eyebrow section-label">Для компаний</div><h2>Когда работа родителей<br>становится чудом</h2><p class="muted">Персональная история для семей ваших сотрудников. Начнём с идеи и небольшого пилота.</p><a href="#corporate" class="text-button">Обсудить корпоративную историю ↗</a></div></section><p class="footer-note">Ясница · истории, которые становятся вашими</p>`;bind();}
function catalogue(){app.innerHTML=`<div class="page-intro"><div class="eyebrow section-label">Библиотека маленьких чудес</div><h1>Найдём вашу историю</h1><p class="muted">Выберите готовую основу или расскажите менеджеру свой сюжет.</p></div><a class="btn sun" href="#brief" id="custom-story">Рассказать свою историю</a><div class="filters" aria-label="Фильтр историй">${[['all','Все истории'],['newyear','Новый год'],['birthday','День рождения'],['corporate','Для компаний']].map(([id,t])=>`<button class="chip ${filter===id?'active':''}" data-filter="${id}" aria-pressed="${filter===id}">${t}</button>`).join('')}</div><div class="stories">${stories.filter(s=>filter==='all'||s.category===filter).map(card).join('')}</div>`;bind();app.querySelector('#custom-story').onclick = event => { event.preventDefault(); pick('custom'); };app.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;catalogue();});}
function brief() {
  if (reviewing) {
    review();
    return;
  }
  const value = name => e(draft[name] || '');
  const kind = draft.story || selected;
  const options = [{id: 'custom', title: 'Своя история'}, ...stories.slice(0, 2)];
  app.innerHTML = `
    <div class="brief-wrap">
      <div class="page-intro">
        <h1>Заказать мультфильм</h1>
        <p class="muted">Расскажите идею и повод. Здесь вы подготовите черновик. Фото для первого сообщения не нужны. <a href="#prices" class="text-button">Посмотреть цены</a></p>
      </div>
      <form class="form-card" id="brief-form">
        <div class="form-grid">
          <label class="field wide">Как к вам обращаться?
            <input name="clientName" autocomplete="name" maxlength="60" value="${value('clientName')}" placeholder="Например, Анна">
          </label>
          <label class="field wide">Сюжет
            <select name="story">${options.map(item => `<option value="${item.id}" ${kind === item.id ? 'selected' : ''}>${item.title}</option>`).join('')}</select>
          </label>
          <label class="field wide" id="idea-field">О чём будет ваша история?
            <textarea name="idea" maxlength="350" placeholder="Например, юная исследовательница находит город под водой">${value('idea')}</textarea>
          </label>
          <label class="field">Повод<input name="occasion" maxlength="100" minlength="2" required value="${value('occasion')}" placeholder="День рождения, подарок, семейный праздник"></label>
          <label class="field">Желаемая дата<input name="date" type="date" value="${value('date')}"></label>
        </div>
        <details class="optional-details" ${draft.name || draft.age || draft.greeting || draft.notes || draft.pronunciation ? 'open' : ''}>
          <summary>Добавить детали о герое и поздравлении</summary>
          <div class="form-grid">
            <label class="field">Имя героя<input name="name" autocomplete="off" maxlength="60" value="${value('name')}"></label>
            <label class="field">Возраст ребёнка<input name="age" type="number" inputmode="numeric" min="1" max="17" value="${value('age')}"></label>
            <label class="field wide">Как произносить имя<input name="pronunciation" maxlength="100" value="${value('pronunciation')}"></label>
            <label class="field wide">Поздравление<textarea name="greeting" maxlength="250">${value('greeting')}</textarea></label>
            <label class="field wide">Другие пожелания<textarea name="notes" maxlength="500">${value('notes')}</textarea></label>
          </div>
        </details>
        <label class="check">
          <input name="consent" type="checkbox" required ${draft.consent ? 'checked' : ''}>
          <span>Я хочу передать пожелания менеджеру. Если я указал данные ребёнка, у меня есть право их передать.</span>
        </label>
        <p class="error" role="alert" id="form-error" hidden></p>
        <button class="btn full" type="submit">Проверить заявку</button>
      </form>
    </div>`;
  const form = app.querySelector('form');
  const idea = app.querySelector('#idea-field');
  function updateIdeaField() {
    const ownStory = form.elements.story.value === 'custom';
    idea.hidden = !ownStory;
    form.elements.idea.required = ownStory;
  }
  function capture() {
    draft = Object.fromEntries(new FormData(form));
    draft.consent = form.elements.consent.checked;
    updateIdeaField();
  }
  updateIdeaField();
  form.oninput = capture;
  form.onsubmit = event => {
    event.preventDefault();
    capture();
    const error = validateBrief(draft);
    if (error) {
      const note = app.querySelector('#form-error');
      note.textContent = error;
      note.hidden = false;
      return;
    }
    reviewing = true;
    render();
  };
}

function review() {
  const text = formatBrief(draft);
  app.innerHTML = `
    <div class="brief-wrap">
      <div class="page-intro">
        <h1>Проверьте заявку</h1>
        <p class="muted">Заявка откроется черновиком у @manageryas. Нажмите «Отправить» в Telegram, чтобы менеджер её получил.</p>
      </div>
      <section class="form-card">
        <div class="summary" id="summary"></div>
        <div class="actions">
          <a class="btn" id="send-request" href="${e(managerURL(text))}" target="_blank" rel="noopener noreferrer">Открыть черновик в Telegram</a>
          <button class="btn outline" id="copy" type="button">Скопировать текст</button>
        </div>
        <div id="copy-fallback" hidden>
          <p class="hint">Выделите и скопируйте текст ниже.</p>
          <textarea readonly aria-label="Текст заявки"></textarea>
        </div>
      </section>
    </div>`;
  app.querySelector('#summary').textContent = text;
  app.querySelector('#send-request').onclick = openManager;
  app.querySelector('#copy').onclick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Текст заявки скопирован.');
    } catch {
      const box = app.querySelector('#copy-fallback');
      box.hidden = false;
      const field = box.querySelector('textarea');
      field.value = text;
      field.select();
    }
  };
}

function about() {
  app.innerHTML = `
    <div class="narrow faq-page">
      <div class="faq-hero">
        <h1>Частые вопросы</h1>
        <p>Как придумать свою историю, отправить заявку и получить фильм.</p>
      </div>
      <div class="faq-topics" role="group" aria-label="Темы вопросов">
        ${faq.map(topic => `<button type="button" class="faq-topic" data-faq="${topic.id}"
          aria-controls="faq-${topic.id}" aria-pressed="${topic.id === faqTopic}">${topic.title}</button>`).join('')}
      </div>
      ${faq.map(topic => `
        <section class="faq-panel" id="faq-${topic.id}" aria-label="${topic.title}" ${topic.id === faqTopic ? '' : 'hidden'}>
          ${topic.questions.map(([question, answer]) => `
            <details>
              <summary><span>${e(question)}</span><span class="faq-plus" aria-hidden="true"></span></summary>
              <p>${e(answer)}${question === 'Сколько стоит мультфильм?' ? ' <a href="#prices" class="text-button">Открыть прайс</a>.' : ''}</p>
            </details>`).join('')}
        </section>`).join('')}
      <aside class="faq-contact">
        <div><h2>Остался вопрос?</h2><p>Менеджер поможет подобрать формат и ответит по вашей истории.</p></div>
        <button class="btn" type="button" id="chat">Написать менеджеру</button>
      </aside>
    </div>`;
  app.querySelectorAll('[data-faq]').forEach(button => {
    button.onclick = () => {
      faqTopic = button.dataset.faq;
      app.querySelectorAll('[data-faq]').forEach(item => {
        const active = item.dataset.faq === faqTopic;
        item.setAttribute('aria-pressed', String(active));
        document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
      });
    };
  });
  app.querySelector('#chat').onclick = openManager;
}

function corporate(){app.innerHTML=`<div class="narrow"><div class="page-intro"><div class="eyebrow section-label">Ясница для компаний</div><h1>Работа родителей.<br>Волшебство для детей.</h1><p class="muted">Начните с демо «Моя мама делает чудеса». Затем обсудим вашу компанию, профессию родителей и возможную персонализацию.</p></div>${card(stories[2])}<section class="section form-card"><h2>Расскажите о вашей идее</h2><p class="muted">В чате укажите компанию, повод, число семей и желаемую дату. Мы отдельно оценим сюжет, объём персонализации и небольшой пилот.</p><button class="btn" id="chat">Обсудить с Ясницей ↗</button></section></div>`;app.querySelector('[data-play]').onclick=()=>play('corporate');app.querySelector('[data-pick]').onclick=()=>app.querySelector('#chat').focus();app.querySelector('#chat').onclick=openManager;}
function prices() {
  const rubles = new Intl.NumberFormat('ru-RU');
  app.innerHTML = `
    <section class="narrow">
      <div class="page-intro">
        <h1 id="price-title">Цены на мультфильмы</h1>
        <p class="muted">Для историй с одним главным героем. Итоговую цену фиксируем до начала работы.</p>
      </div>
      <div class="price-sheet">
        <table aria-labelledby="price-title">
          <thead><tr><th scope="col">Длительность</th><th scope="col">Стоимость</th></tr></thead>
          <tbody>${priceRows.map(([duration, amount]) => `
            <tr><th scope="row">${e(duration)}</th><td>${rubles.format(amount)} ₽</td></tr>`).join('')}</tbody>
        </table>
      </div>
      <p class="muted">С 61-й по 180-ю секунду добавляем 60 ₽ за секунду. С 181-й по 300-ю секунду добавляем 70 ₽ за секунду. Истории дольше 5 минут и дополнительные герои считаем отдельно.</p>
      <h2>Что входит</h2>
      <p class="muted">Сюжет, образ героя по фото, пробная сцена, озвучка, музыка, до двух точечных правок и готовый MP4.</p>
      <div class="actions"><a href="#brief" class="btn sun">Заполнить заявку</a><a href="https://vk.com/studyyasnitsa" class="btn outline" target="_blank" rel="noopener">Ясница ВКонтакте</a></div>
    </section>`;
}

const screens = {home, stories: catalogue, brief, about, corporate, prices};

function render() {
  const next = location.hash.slice(1);
  const page = Object.hasOwn(screens, next) ? next : initialPage;
  if (page !== currentPage && Object.hasOwn(returnPages, page)) {
    returnPages[page] = page === 'prices' && ['brief', 'about'].includes(currentPage)
      ? currentPage
      : currentPage === 'stories' ? 'stories' : 'home';
  }
  currentPage = page;
  document.querySelectorAll('[data-nav]').forEach(link => {
    const active = link.dataset.nav === page;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  screens[page]();
  if (page !== 'home') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-back';
    button.textContent = reviewing && page === 'brief' ? 'Назад к заявке' : 'Назад';
    button.onclick = back;
    app.prepend(button);
  }
  syncBackButton();
  window.scrollTo(0, 0);
}

function back() {
  if (player.open) {
    player.close();
  } else if (reviewing && currentPage === 'brief') {
    reviewing = false;
    render();
  } else {
    location.hash = returnPages[currentPage] || 'home';
  }
}

document.querySelector('#help').onclick = () => location.hash = 'about';
window.addEventListener('hashchange', render);
render();
