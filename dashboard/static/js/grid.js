class Grid {
  constructor() {
    this.logoPrefix = window._SSOLogoPrefix || '';
  }

  buildTile(appItem) {
    const appTile = document.querySelector('#application-template');
    const clonedTile = appTile.content.cloneNode(true);
    const link = clonedTile.querySelector('.app-tile');
    link.onclick = (e) => {
      this.highlights.update(appItem);
    };
    link.setAttribute('href', appItem.url);
    link.setAttribute('id', appItem.name);
    const image = clonedTile.querySelector('.app-tile__logo');
    image.setAttribute('src', `${this.logoPrefix}${appItem.logo}`);
    image.setAttribute('alt', appItem.name);
    const label = clonedTile.querySelector('.app-tile__name');
    label.textContent = appItem.name;
    return clonedTile;
  }

  renderApps(containerClass, apps) {
    const container = document.querySelector(containerClass);
    if (!apps.length) {
      container.classList.add('empty');
    } else {
      container.classList.remove('empty');
    }
    const containerList = container.querySelector('.app-list');
    containerList.innerHTML = '';
    for (let i = 0, len = apps.length; i < len; i++) {
      containerList.append(this.buildTile(apps[i]));
    }
  }
}
