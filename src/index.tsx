import Viewport from "./tsx/viewport";

let document = window.document;

import 'bootstrap/scss/bootstrap.scss';
import 'static/scss/app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './tsx/app';
import ToolPane from "./tsx/toolpane";
import Scene1 from "./tsx/scenes/Scene1";
import Scene from "./tsx/scene";

let scene: Scene1 = new Scene1();

let canvas_ID = 'app-canvas';

ReactDOM.render(
  <App>
    <Viewport className="col-xs-6"
              canvas_ID={ canvas_ID }
              canvas_w={ 300 }
              canvas_h={ 300 }
              mounted={ () => scene.setup( canvas_ID ) }/>
    <ToolPane className="col-xs-6"
              scene={ scene } />
  </App>,
  document.getElementById('app-root')
);





