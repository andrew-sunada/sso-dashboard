// TODO: Move highlight functionality into a different file
class Dashboard {
  static CONTAINER_CLASS = '.app-grid';
  constructor() {
    this.appLibrary = (window._RawSSODashboardApps || []).map(
      ({ application }) => application
    );
    this.$headerElement = document.getElementsByTagName(
      'moz-components-factor-header'
    )[0];
    this.highlights = new Highlights(this.appLibrary);
    this.grid = new Grid();
    this.searchQuery = '';
    this.setup();
  }
  setup() {
    const updateDashboard = (e) => {
      if (!e.detail.length) {
        return;
      }
      const { event } = e.detail[0];
      this.searchQuery = event.target.value;
      this.render();
    };
    this.$headerElement.addEventListener('factor:search:clear', (e) => {
      this.searchQuery = '';
      this.render();
    });
    this.$headerElement.addEventListener('factor:search:submitted', (e) => {
      updateDashboard(e);
    });
    this.$headerElement.addEventListener('factor:search:keyup', (e) => {
      updateDashboard(e);
    });
  }
  renderApps() {
    const appLibrary = this.appLibrary
      .filter(
        (app) => this.highlights.getHighlightKeys().indexOf(app.name) === -1
      )
      .filter((app) =>
        app.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

    this.grid.renderApps(Dashboard.CONTAINER_CLASS, appLibrary);
  }
  render() {
    this.renderApps();
    this.highlights.render(this.searchQuery);
  }
}
window.onload = function () {
  const dashboard = new Dashboard();
  dashboard.render();
};
