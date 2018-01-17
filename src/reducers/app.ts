import { Types } from '@app/actions'

export type AppState = {
  exampleSwitch: boolean
}

const INITIAL_STATE = {
  exampleSwitch: false
};

const app = ( state: AppState = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case Types.APP_EXAMPLE_ACTION:
      return {
        ...state,
        exampleSwitch: !state.exampleSwitch
      };
    default:
      return state;
  }
};

export default app;