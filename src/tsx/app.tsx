import * as React from 'react';

export interface AppProps {}
export interface StateProps {}

class App extends React.Component<AppProps, {}> {
  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default App;