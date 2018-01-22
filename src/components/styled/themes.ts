export interface AppTheme {
  background: string,
  color: string,
  trimColor: string
  headerBackground: string
  editor: {
    valueBackground: string
  }
}

const lightTheme: AppTheme = {
  background: '#f3f3f3',
  color: 'black',
  trimColor: '#e3e3e3',
  headerBackground: '#fbfbfb',
  editor: {
    valueBackground: '#fbfbfb'
  }
};

const darkTheme: AppTheme = {
  background: '#27292d',
  color: '#f9f9f9',
  trimColor: '#595959',
  headerBackground: '#484d55',
  editor: {
    valueBackground: '#484d55'
  }
};

export { lightTheme, darkTheme };