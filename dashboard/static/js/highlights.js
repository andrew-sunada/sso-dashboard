/**
 * Class to manage highlight section of dashboard
 * -  As apps are clicked on the main dashboard,
 *    we will want to keep track of those and show an aggregrate of
 *    "frequently used" apps
 * -  The highlights are a set of the topo 5 apps clicked where the
 *    most recent click was sometime this month
 */
const differenceInDays = (timestamp1, timestamp2) =>
  Math.floor((timestamp1 - timestamp2) / 1000 / 60 / 60 / 24);
class Highlights {
  static STORAGE_KEY = 'sso-highlights';
  static MONTH_VALUE = 30;
  static TIMESTAMP_TO_DAY = 1000 / 60 / 60 / 24;
  static MAX_HIGHLIGHTS = 5;
  static CONTAINER_CLASS = '.highlight-apps';
  constructor(apps) {
    this.grid = new Grid();
    this.appLibrary = apps;
    this.setup();
  }

  /**
   * Curate the local storage cache making sure there are only ever MAX_HIGHLIGHTS number of apps
   */
  setup() {
    if (!localStorage.getItem(Highlights.STORAGE_KEY)) {
      localStorage.clear();
      localStorage.setItem(Highlights.STORAGE_KEY, JSON.stringify({}));
    }
    const highlights = JSON.parse(localStorage.getItem(Highlights.STORAGE_KEY));
    const updatedHighlightKeys = Object.keys(highlights)
      .filter((highlightKey) => {
        const highlight = highlights[highlightKey];
        const recentClick = new Date(highlight.lastClick);
        const daysDifference = differenceInDays(
          new Date().getTime(),
          recentClick.getTime()
        );
        if (daysDifference > Highlights.MONTH_VALUE) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aTime = new Date(a.lastClick).getTime();
        const bTime = new Date(b.lastClick).getTime();
        if (aTime > bTime) {
          return 1;
        } else if (aTime < bTime) {
          return -1;
        } else {
          return 0;
        }
      })
      .slice(0, Highlights.MAX_HIGHLIGHTS);
    const updatedHighlights = updatedHighlightKeys.reduce((acc, curr) => {
      acc[curr] = highlights[curr];
      return acc;
    }, {});
    localStorage.setItem(
      Highlights.STORAGE_KEY,
      JSON.stringify(updatedHighlights)
    );
  }
  /**
   * Name: updateHighlights
   * Keep track of the last click, and how many times this has been clicked overall
   * @param {*} appItem
   */
  update(item) {
    const highlights = JSON.parse(localStorage.getItem(Highlights.STORAGE_KEY));
    if (highlights[item.name] === undefined) {
      highlights[item.name] = {
        count: 1,
        lastClick: new Date().getTime(),
      };
    } else {
      highlights[item.name] = {
        count: highlights[item.name].count + 1,
        lastClick: new Date().getTime(),
      };
    }
    localStorage.setItem(Highlights.STORAGE_KEY, JSON.stringify(highlights));
  }

  render(searchQuery) {
    const highlightKeys = this.getHighlightKeys();
    // TODO: add highlight sorting based on last clicked
    const apps = this.appLibrary
      .filter((app) => highlightKeys.indexOf(app.name) !== -1)
      .filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    this.grid.renderApps(Highlights.CONTAINER_CLASS, apps);
  }
  getHighlightKeys = () =>
    Object.keys(JSON.parse(localStorage.getItem(Highlights.STORAGE_KEY)));
}
