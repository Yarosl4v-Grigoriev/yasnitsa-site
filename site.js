const wishes = [
  ['Пусть сегодня найдётся повод улыбнуться.', 'May today give you a reason to smile.'],
  ['Пусть в обычном дне случится маленькое чудо.', 'May an ordinary day bring a little wonder.'],
  ['Пусть рядом будет тот, кому хочется рассказать всё самое хорошее.', 'May you have someone nearby to share the good things with.'],
  ['Пусть смелая мечта найдёт свой первый шаг.', 'May a brave dream find its first step.'],
  ['Пусть дома сегодня звучит смех.', 'May laughter fill your home today.'],
  ['Пусть для любимого дела найдётся чуть больше времени.', 'May there be a little more time for what you love.'],
  ['Пусть хорошая новость застанет вас врасплох.', 'May good news catch you by surprise.'],
  ['Пусть день закончится словами «а было здорово».', 'May you end the day thinking, “That was lovely.”'],
  ['Пусть у вас получится то, за что давно хотелось взяться.', 'May you make a start on something you’ve wanted to try.'],
  ['Пусть любимая песня заиграет в самый подходящий момент.', 'May your favourite song play at just the right moment.'],
  ['Пусть кто-нибудь порадует вас без повода.', 'May someone surprise you just because.'],
  ['Пусть планы оставят место для приятных неожиданностей.', 'May your plans leave room for good surprises.'],
  ['Пусть вечером будет что рассказать за чаем.', 'May you have a story to tell over tea tonight.'],
  ['Пусть путь к мечте окажется интереснее, чем вы думали.', 'May the road to your dream be even more interesting than you imagined.'],
  ['Пусть хватит сил на важное и времени на отдых.', 'May you have energy for what matters and time to rest.'],
  ['Пусть кто-то запомнит вашу доброту.', 'May someone remember your kindness.'],
  ['Пусть у каждого важного разговора будет тёплое начало.', 'May every important conversation begin warmly.'],
  ['Пусть прогулка без плана приведёт в хорошее место.', 'May an unplanned walk take you somewhere lovely.'],
  ['Пусть сегодняшний день захочется вспомнить.', 'May today be a day you’ll want to remember.'],
  ['Пусть любимые люди чаще оказываются рядом.', 'May the people you love be close more often.'],
  ['Пусть найдётся время посмеяться над семейными шутками.', 'May there be time to laugh at your family’s favourite jokes.'],
  ['Пусть строчка из детской книжки улыбнёт и взрослого.', 'May a line from a children’s book make a grown-up smile.'],
  ['Пусть вы заметите красивый свет по дороге домой.', 'May you notice the beautiful light on your way home.'],
  ['Пусть на вопрос «а что, если?» найдётся интересный ответ.', 'May “what if?” lead to an interesting answer.'],
  ['Пусть первая попытка окажется добрее к вам, чем ожидалось.', 'May the first try be kinder to you than you expected.'],
  ['Пусть хорошая история найдёт своего слушателя.', 'May a good story find someone who wants to hear it.'],
  ['Пусть близкие чаще слышат, как много они для вас значат.', 'May the people you love hear how much they mean to you.'],
  ['Пусть утром будет вкусный завтрак, а вечером — спокойствие.', 'May your morning bring a good breakfast and your evening bring peace.'],
  ['Пусть там, где ждали трудность, найдётся помощник.', 'May a helping hand appear where you expected a hurdle.'],
  ['Пусть в вашей истории будет больше любимых сцен.', 'May your story have more scenes you love.'],
  ['Пусть найдётся время позвонить тому, по кому скучаете.', 'May you find time to call someone you miss.'],
  ['Пусть у уставшего дня будет уютный финал.', 'May a tiring day have a cosy ending.'],
  ['Пусть новый маршрут покажет что-то красивое.', 'May a new route show you something beautiful.'],
  ['Пусть сегодня удастся кого-нибудь приятно удивить.', 'May you get to surprise someone in a lovely way today.'],
  ['Пусть в доме найдётся место для ещё одного смешного рисунка.', 'May there be room at home for one more funny drawing.'],
  ['Пусть получится встретиться без спешки.', 'May you get to see each other without having to rush.'],
  ['Пусть отложенное «когда-нибудь» станет хорошим планом.', 'May a long-postponed “someday” turn into a good plan.'],
  ['Пусть за окном будет хороший свет, а дома — вкусный чай.', 'May there be good light outside and a lovely cup of tea at home.'],
  ['Пусть чьё-то «спасибо» придётся кстати.', 'May someone’s “thank you” come at the right time.'],
  ['Пусть следующий кадр вашей истории будет тёплым.', 'May the next frame of your story be a warm one.'],
];

const ruText = new WeakMap();
const translated = [...document.querySelectorAll('[data-en], [data-en-label], [data-en-placeholder]')];
for (const el of translated) {
  ruText.set(el, {
    text: el.textContent,
    label: el.getAttribute('aria-label'),
    placeholder: el.getAttribute('placeholder'),
  });
}

function read(key) {
  try { return localStorage.getItem('yasnitsa-' + key); }
  catch { return null; }
}
function save(key, value) {
  try { localStorage.setItem('yasnitsa-' + key, value); }
  catch { /* The page still works when browser storage is disabled. */ }
}

const root = document.documentElement;
const languageButton = document.querySelector('#language');
const themeButton = document.querySelector('#theme');
const wishLine = document.querySelector('#wish');
const orderDialog = document.querySelector('#order-dialog');
const videoDialog = document.querySelector('#video-dialog');
const video = videoDialog.querySelector('video');
const brief = document.querySelector('#brief');
const orderFormats = {
  family: {
    title: ['Расскажите о будущем мультфильме', 'Tell us about your film'],
    topic: ['заказной мультфильм', 'a custom animated film'],
  },
  business: {
    title: ['Расскажите о задаче компании', 'Tell us about your project'],
    topic: ['ролик для компании', 'an animated film for our company'],
    placeholder: ['Например: ролик о первом дне сотрудника', 'For example: a film about an employee’s first day'],
  },
  advertising: {
    title: ['Расскажите о продукте', 'Tell us about your product'],
    topic: ['рекламный ролик', 'an animated ad'],
    placeholder: ['Что рекламируем, кто зритель и где выйдет ролик?', 'What are we promoting, who is it for, and where will it run?'],
  },
  wedding: {
    title: ['Расскажите о вашей свадьбе', 'Tell us about your wedding'],
    topic: ['свадебный мультфильм', 'a wedding film'],
    placeholder: ['Дата свадьбы, история пары и когда хотите показать ролик', 'Wedding date, your story and when you want to show the film'],
  },
  events: {
    title: ['Расскажите о мероприятии', 'Tell us about your event'],
    topic: ['анимационный ролик для мероприятия', 'an animated film for an event'],
    placeholder: ['Дата, площадка, аудитория и место ролика в программе', 'Date, venue, audience and where the film fits in the programme'],
  },
};
const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4m0-13.4-1.4 1.4M6.7 17.3l-1.4 1.4"/></svg>';
const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M20.4 14.4A8.6 8.6 0 0 1 9.6 3.6a8.7 8.7 0 1 0 10.8 10.8Z"/></svg>';
let lang = read('lang') === 'en' ? 'en' : 'ru';
let wishIndex;
let orderKind = 'family';
const notesByFormat = new Map();
let currentVideo;
let opener;
const pick = (ru, en) => lang === 'en' ? en : ru;

function drawControls() {
  const dark = root.dataset.theme === 'dark';
  themeButton.innerHTML = dark ? sun : moon;
  themeButton.setAttribute('aria-label', dark
    ? pick('Включить светлую тему', 'Switch to light theme')
    : pick('Включить тёмную тему', 'Switch to dark theme'));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#111e19' : '#f7f7ee';
  languageButton.textContent = pick('EN', 'RU');
  languageButton.setAttribute('aria-label', pick('Switch to English', 'Переключить на русский'));
}

function drawWish() {
  wishLine.textContent = pick(...wishes[wishIndex]);
}
function newWish() {
  const previous = read('wish');
  const old = wishIndex ?? (previous === null ? -1 : Number(previous));
  const index = Math.floor(Math.random() * (wishes.length - 1));
  wishIndex = old >= 0 && old < wishes.length ? index + Number(index >= old) : Math.floor(Math.random() * wishes.length);
  save('wish', String(wishIndex));
  drawWish();
}

function updateDraft() {
  const note = brief.value.trim();
  const {title, topic} = orderFormats[orderKind];
  const subject = pick(...title);
  const intro = pick(`Здравствуйте! Хочу обсудить ${topic[0]}.`, `Hello! I’d like to discuss ${topic[1]}.`);
  const body = note ? intro + '\n\n' + note : intro;
  document.querySelector('#telegram-draft').href =
    'https://t.me/manageryas?text=' + encodeURIComponent(body);
  document.querySelector('#email-draft').href =
    'mailto:yasnitsa4@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

function applyLanguage() {
  root.lang = lang;
  for (const el of translated) {
    const ru = ruText.get(el);
    if (el.hasAttribute('data-en')) el.textContent = pick(ru.text, el.dataset.en);
    if (el.hasAttribute('data-en-label')) el.setAttribute('aria-label', pick(ru.label, el.dataset.enLabel));
    if (el.hasAttribute('data-en-placeholder')) el.setAttribute('placeholder', pick(ru.placeholder, el.dataset.enPlaceholder));
  }
  const {title, placeholder} = orderFormats[orderKind];
  document.querySelector('#order-title').textContent = pick(...title);
  brief.placeholder = placeholder
    ? pick(...placeholder)
    : pick(ruText.get(brief).placeholder, brief.dataset.enPlaceholder);
  if (currentVideo) {
    document.querySelector('#video-title').textContent = pick(currentVideo.dataset.titleRu, currentVideo.dataset.titleEn);
  }
  drawControls();
  drawWish();
  updateDraft();
}

languageButton.addEventListener('click', () => {
  lang = lang === 'ru' ? 'en' : 'ru';
  save('lang', lang);
  applyLanguage();
});
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  save('theme', root.dataset.theme);
  drawControls();
});
document.querySelector('#wish-next').addEventListener('click', newWish);
brief.addEventListener('input', updateDraft);
document.querySelector('#order-form').addEventListener('submit', event => event.preventDefault());

function normalClick(event) {
  return event.button === 0 && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey;
}
const videoStatus = videoDialog.querySelector('.video-status');
video.addEventListener('error', () => {
  if (videoDialog.open && video.hasAttribute('src')) videoStatus.hidden = false;
});
for (const link of document.querySelectorAll('[data-video]')) {
  link.addEventListener('click', event => {
    if (!normalClick(event) || !videoDialog.showModal) return;
    event.preventDefault();
    opener = link;
    currentVideo = link;
    document.querySelector('#video-title').textContent = pick(link.dataset.titleRu, link.dataset.titleEn);
    videoStatus.hidden = true;
    videoStatus.querySelector('a').href = link.href;
    video.poster = link.querySelector('img')?.currentSrc || '';
    video.preload = 'metadata';
    video.src = link.href;
    videoDialog.showModal();
    video.play().catch(() => {});
  });
}
for (const link of document.querySelectorAll('[data-order]')) {
  link.addEventListener('click', event => {
    if (!normalClick(event) || !orderDialog.showModal) return;
    event.preventDefault();
    opener = link;
    notesByFormat.set(orderKind, brief.value);
    orderKind = link.dataset.order;
    brief.value = notesByFormat.get(orderKind) || '';
    applyLanguage();
    orderDialog.showModal();
    brief.focus();
  });
}
for (const dialog of [videoDialog, orderDialog]) {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog === videoDialog) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    opener?.focus({preventScroll: true});
    opener = null;
  });
}

newWish();
applyLanguage();
