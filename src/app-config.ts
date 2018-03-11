import ColorInput from '@app/components/scene-containers/color-input';
import About from '@app/components/routes/about';
import SceneTwo from '@app/components/scene-containers/scene-2';
import * as React from 'react';

export type Module = {
  name: string,
  route: string,
  component: React.ComponentType<any>
}

export type AppConfig = {
  title: string,
  url: string,
  modules: [ Module ]
}

const AppConfig: AppConfig  = {
  title: 'WebGL Demos',
  url: 'https://github.com/AldousP/webgl-demos',
  modules: [
    {
      name: 'Color Input',
      route: 'color-input',
      component: ColorInput
    },
    {
      name: 'Scene 2',
      route: 'scene-2',
      component: SceneTwo
    },
    {
      route: 'about',
      name: 'About',
      component: About
    }
  ]
};

export default AppConfig;