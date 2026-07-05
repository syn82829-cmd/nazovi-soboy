export function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

export function openTelegramFullscreen() {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return;
  }

  webApp.ready();
  webApp.expand();

  if (typeof webApp.requestFullscreen === 'function') {
    webApp.requestFullscreen();
  }

  if (typeof webApp.disableVerticalSwipes === 'function') {
    webApp.disableVerticalSwipes();
  }
}

export function confirmSearch() {
  const webApp = getTelegramWebApp();
  const text = 'Вы уверены, что хотите искать?';

  if (webApp && typeof webApp.showConfirm === 'function') {
    webApp.showConfirm(text);
    return;
  }

  window.confirm(text);
}
