require('immutability-helper');

export default class Scene {
  /**
   * Used to indicate program values that will be interacted with
   * via the app toolpane.
   */
  appState: Object = {};

  /**
   * Configuration for the pane.
   *
   * Each key must match a value in the appState.
   *
   * Available keys
   * min: min slider range
   * max: max slider range
   * step: slider step
   */
  // Example:
  // paneConfig = {
  //   zNear: {
  //     min: 0,
  //     max: 10,
  //     step: 1
  //   }
  // )
  paneConfig: Object = {};

  updateAppState ( data: Object ) {
    Object.keys(data).forEach(key => this.appState[key] = Number.parseFloat(data[key]));
  }
}

