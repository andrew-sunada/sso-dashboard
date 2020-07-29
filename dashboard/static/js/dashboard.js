let searchQuery = '';
const buildTile = (appItem) => {
  const logoPrefix = window._SSOLogoPrefix;
  const appTile = document.querySelector('#application-template');
  const clonedTile = appTile.content.cloneNode(true);
  const link = clonedTile.querySelector('.app-tile');
  link.setAttribute('href', appItem.url);
  link.setAttribute('id', appItem.name);
  const image = clonedTile.querySelector('.app-tile__logo');
  image.setAttribute('src', `${logoPrefix}${appItem.logo}`);
  image.setAttribute('alt', appItem.name);
  const label = clonedTile.querySelector('.app-tile__name');
  label.textContent = appItem.name;
  return clonedTile;
};
const renderAppList = () => {
  const appLibrary = window._RawSSODashboardApps
    .map(({ application }) => application)
    .filter((app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const appList = document.querySelector('.app-list');
  appList.innerHTML = '';
  for (let i = 0, len = appLibrary.length; i < len; i++) {
    appList.append(buildTile(appLibrary[i]));
  }
};
const buildDashboard = () => {
  renderAppList();
  document
    .getElementsByTagName('moz-components-factor-header')[0]
    .addEventListener('factor:search:clear', (e) => {
      console.log('search cleared');
      searchQuery = '';
      renderAppList();
    });
  // TODO: Use local storage to create a list of "frequently clicked on apps"
  document
    .getElementsByTagName('moz-components-factor-header')[0]
    .addEventListener('factor:search:submitted', (e) => {
      console.log('search clicked: ', e);
      // searchQuery = e.details[0].
    });
  document
    .getElementsByTagName('moz-components-factor-header')[0]
    .addEventListener('factor:search:keyup', (e) => {
      const { event } = e.detail[0];
      searchQuery = event.target.value;
      renderAppList();
    });
};
window.onload = function () {
  buildDashboard();
};
