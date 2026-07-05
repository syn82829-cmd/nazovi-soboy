export function openTelegramFullscreen() {
  const webApp = window.Telegram?.WebApp;

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
