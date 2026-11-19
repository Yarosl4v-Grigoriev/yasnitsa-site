export const stories = [
  { id:'star', title:'Звезда, которая опоздала', badge:'К Новому году', duration:'41 сек', category:'newyear', description:'Маленькая звезда ищет своё место на празднике. Добрая история о том, что каждому найдётся время засиять.' },
  { id:'dragon', title:'Фонарик для дракона', badge:'День рождения и не только', duration:'40,5 сек', category:'birthday', description:'Иногда даже большому дракону нужна маленькая помощь. Тёплая история о дружбе и смелости.' },
  { id:'corporate', title:'Моя мама делает чудеса', badge:'Для компаний', duration:'30,75 сек', category:'corporate', description:'История о работе родителей глазами ребёнка. Подарок для семей сотрудников — по отдельному брифу.' },
];
export function validateBrief(data) {
  if (data.story !== 'custom' && !stories.slice(0, 2).some(story => story.id === data.story)) return 'Выберите историю.';
  if (data.story === 'custom' && (typeof data.idea !== 'string' || data.idea.trim().length < 4 || data.idea.length > 350)) return 'Опишите идею в нескольких словах, до 350 символов.';
  if (typeof data.name !== 'string' || data.name.length > 60) return 'Имя должно быть не длиннее 60 символов.';
  if (data.age && (!Number.isInteger(Number(data.age)) || Number(data.age) < 1 || Number(data.age) > 17)) return 'Укажите возраст от 1 до 17 лет или оставьте поле пустым.';
  if (typeof data.occasion!=='string' || data.occasion.trim().length<2 || data.occasion.length>100) return 'Укажите повод — от 2 до 100 символов.';
  for (const [key,max] of [['pronunciation',100],['greeting',250],['notes',500]]) if (typeof data[key]!=='string' || data[key].length>max) return 'Текст слишком длинный. Сократите пожелания.';
  if (data.date && (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0,10)!==data.date)) return 'Проверьте дату вручения.';
  if (data.consent!==true) return 'Подтвердите, что хотите передать указанные пожелания менеджеру.';
  return null;
}
export function formatBrief(data) {
  if (validateBrief(data)) throw new Error('Invalid brief');
  const story = stories.find(item => item.id === data.story);
  const lines = ['Здравствуйте! Хочу обсудить мультфильм «Ясницы».',
    story ? `История: ${story.title}` : `Моя идея: ${data.idea.trim()}`,
    `Повод: ${data.occasion.trim()}`];
  for (const [label, value] of [['Имя героя', data.name], ['Возраст', data.age],
    ['Произношение', data.pronunciation], ['Желаемая дата', data.date],
    ['Поздравление', data.greeting], ['Пожелания', data.notes]]) {
    if (String(value ?? '').trim()) lines.push(`${label}: ${String(value).trim()}`);
  }
  return [...lines, 'Подскажите, пожалуйста, стоимость и сроки.'].join('\n');
}
