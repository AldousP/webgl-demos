export interface AppTheme {
  'bg': string,
  'color': string,
  'trim-color': string
  'header_bg': string
}

const lightTheme: AppTheme = {
  'bg': 'white',
  'color': 'black',
  'trim-color': '#e3e3e3',
  'header_bg': '#fbfbfb'
};

const darkTheme: AppTheme = {
  'bg': '#27292d',
  'color': '#f9f9f9',
  'trim-color': '#595959',
  'header_bg': '#484d55'
};

export { lightTheme, darkTheme };