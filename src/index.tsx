import Viewport from "./tsx/viewport";

let document = window.document;

import 'bootstrap/scss/bootstrap.scss';
import 'static/scss/app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './tsx/app';
import ToolPane from "./tsx/toolpane";

ReactDOM.render(
  <App>
    <Viewport className="col-xs-6" />
    <ToolPane className="col-xs-6" />
  </App>,
  document.getElementById('app-root')
);

import './demos/demo-3';
