module.exports = {
  /**
   *
   * @param {string} day
   * @param {import("../lib/interface/Category.d.ts").Category|null} targetEventCategory
   */
  async getTheDayEvents(day, targetEventCategory = null) {
    /**
     * @type {import('../lib/interface/Event.d.ts').Event[]}
     */
    const events = await (await fetch('https://www.tokyo-dome.co.jp/resources/events.json')).json();
    return events.filter(
      (event) =>
        event.dates.includes(day) &&
        (targetEventCategory ? !!event.category.find((cat) => cat === targetEventCategory) : true)
    );
  },
};
