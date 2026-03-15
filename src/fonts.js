export function injectFonts() {
  if (document.getElementById('google-fonts-link')) return;

  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);

  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect2);

  const link = document.createElement('link');
  link.id = 'google-fonts-link';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Roboto+Mono:wght@400;500&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap';
  document.head.appendChild(link);
}
