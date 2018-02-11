export const Types =  {
  APP_SET_NAV_OPEN: 'APP_SET_NAV_OPEN'
};

export const AppSetNavOpen = ( open: boolean ) => {
  return {
    type: Types.APP_SET_NAV_OPEN,
    navOpen: open
  }
};

export const Creators =  {
  AppSetNavOpen
};
