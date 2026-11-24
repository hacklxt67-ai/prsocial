// Initialize app
(async () => {
  // Load translations first
  await I18N.init();
  // Try to restore session
  await API.getMe();
  I18N.report();
  // Start router
  Router.init();
})();
