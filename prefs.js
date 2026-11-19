(() => {
  const aliases = ['www.yasnitsa.ru', 'xn--80apop1a4c.xn--p1ai', 'www.xn--80apop1a4c.xn--p1ai', 'ясница.рф', 'www.ясница.рф'];
  if (aliases.includes(location.hostname.toLowerCase())) {
    location.replace('https://yasnitsa.ru' + location.pathname + location.search + location.hash);
  }
  try {
    const theme = localStorage.getItem('yasnitsa-theme');
    document.documentElement.dataset.theme = ['light', 'dark'].includes(theme)
      ? theme : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
})();
