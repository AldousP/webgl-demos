import * as React from 'react';

export type Props = {}
export type State = {}

class AppContent extends React.Component<Props, State > {
  render() {
    return (
      <div>
        { this.props.children }
      </div>
  );
  }
}

export default AppContent;