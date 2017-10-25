require('immutability-helper');

export default class Scene {
  appState: Object = {};

  updateAppState ( data: Object ) {
    Object.keys(data).forEach(key => this.appState[key] = Number.parseFloat(data[key]));
  }
}