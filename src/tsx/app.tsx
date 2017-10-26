import * as React from 'react';

export interface AppProps {}
export interface StateProps {}

class App extends React.Component<AppProps, {}> {
  render() {
    return (
      <div className='row justify-content-center'>
        { this.props.children }
      </div>
    );
  }
}

export default App;