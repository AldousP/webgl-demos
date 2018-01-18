import * as React from 'react';
import Header from '@app/components/containers/header';
import AppContent from '@app/components/containers/app-content';

import styled, { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '@app/components/styled/themes';
import Scene6 from '@app/scenes/scene-6';


export type Props = {

}

export type State = {
}

const Container = styled.div`
  background-color: ${ props => props.theme.background };
  color: ${ props => props.theme.color };
  height: 100%;
  overflow-y: scroll;
`;

class AppWrapper extends React.Component<Props, State> {
  render() {
    return (
      <ThemeProvider theme={ darkTheme }>
        <Container>
          <Header/>
          <AppContent>
            <Scene6/>
          </AppContent>
        </Container>
      </ThemeProvider>
    );
  }
}

export default AppWrapper;