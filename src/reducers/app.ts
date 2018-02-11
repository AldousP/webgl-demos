import { Types } from '@app/actions'

export type AppState = {
  navOpen: boolean
}

const INITIAL_STATE = {
  navOpen: false
};

const app = ( state: AppState = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case Types.APP_SET_NAV_OPEN:
      return {
        ...state,
        navOpen: action.navOpen
      };
    default:
      return state;
  }
};

export default app;