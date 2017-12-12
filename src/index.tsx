import Viewport from "./tsx/viewport";

let document = window.document;

import 'bootstrap/scss/bootstrap.scss';
import 'static/scss/app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './tsx/app';
import ToolPane from "./tsx/toolpane";
import Scene from "./ts/scenes/Scene5";

import './ts/component-type';

let scene: Scene = new Scene();
let canvas_ID = 'app-canvas';

ReactDOM.render(
  <App>
    <Viewport className="col-xs-12 col-sm-8 order-3 pane"
              canvas_ID={ canvas_ID }
              width={ 712 }
              height={ 1280 }
              mounted={ () => scene.setup( canvas_ID ) }/>
    <ToolPane className="col-xs-12 order-4 col-sm-4 pane"
              sceneState={ scene.appState }
              scene={ scene } />
  </App>,
  document.getElementById('app-root')
);





