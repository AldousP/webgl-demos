import * as React from 'react';
import Header from '@app/components/containers/header';
import AppContent from '@app/components/containers/app-content';

import styled, { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '@app/components/styled/themes';
import Scene6 from '@app/scenes/Scene6';

export interface AppProps {}
export interface StateProps {}

const Container = styled.div`
  background-color: ${ props => props.theme.bg };
  color: ${ props => props.theme.color };
  background-color: ${ props => props.theme.bg };
  height: 100%;
`;

class AppWrapper extends React.Component<AppProps, {}> {
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