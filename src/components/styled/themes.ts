export type Layout = {

}

export interface AppTheme {
  layout: Layout,
  background: string,
  color: string,
  trimColor: string
  headerBackground: string
  headerHeight: string
  type: {
    bodySize: string,
    headerFont: string,
    navFont: string,
    contentFont: string,
    h1: string,
    h2: string,
    h3: string
  },
  editor: {
    valueBackground: string
  }
}

const type = {
  bodySize: '14px',
  headerFont: "sans-serif",
  navFont: "sans-serif",
  contentFont: "sans-serif",
  h1: '32px',
  h2: '28px',
  h3: '24px',
};

const headerHeight = '50px';
const layout = {

};

const lightTheme: AppTheme = {
  layout,
  background: '#f3f3f3',
  color: '#454545',
  trimColor: '#e3e3e3',
  headerBackground: '#fbfbfb',
  headerHeight,
  type,
  editor: {
    valueBackground: '#fbfbfb'
  }
};

const darkTheme: AppTheme = {
  layout,
  background: '#27292d',
  color: '#f9f9f9',
  trimColor: '#595959',
  headerBackground: '#484d55',
  headerHeight,
  type,
  editor: {
    valueBackground: '#484d55'
  }
};

export { lightTheme, darkTheme };