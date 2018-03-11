import * as React from 'react';

import { bindActionCreators } from 'redux';
import { Creators } from '@app/actions';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, Link, withRouter } from 'react-router-dom';
import * as classNames from 'classnames';

import styled, { ThemeProvider, injectGlobal } from 'styled-components';

import { darkTheme, lightTheme } from '@app/components/styled/themes';
import Header from '@app/components/containers/header';
import NotFound from '@app/components/routes/404';
import { shadowMixin } from '@app/util/style-mixins';

import config from '@app/app-config';

const { modules } = config;

export interface Props {
  navOpen: boolean,
  AppSetNavOpen: typeof Creators.AppSetNavOpen,
  location: Object
}

export type State = {

}


class App extends React.Component<Props, State> {
  constructor( props ) {
    super( props );
  }

  componentDidMount () {

  }

  componentDidUpdate ( prevProps ) {
    if ( this.props.location !== prevProps.location ) {
      this.props.AppSetNavOpen( false );
    }
  }

  contentLayerClicked = ( ) => {
    if ( this.props.navOpen ) {
      this.props.AppSetNavOpen( false );
    }
  };

  render() {
    return (
      <ThemeProvider theme={ darkTheme }>
        <Container>
          <Header />
          <BodyContainer>

            <SliderLayer className='nav-layer'>
              <SideNav className={ this.props.navOpen ? '' : 'hidden'} >

                {
                  modules.map( ( module, i )=> (
                    <Link key={ i }
                          to={ `/${ module.route }` }
                          // @ts-ignore
                          replace={ module.route === this.props.location.pathname.split( '/' )[ 1 ] }
                    >
                      <NavLink> { module.name } </NavLink>
                    </Link>
                  ) )
                }

              </SideNav>
            </SliderLayer>

            <ContentLayer
              onClick={ this.contentLayerClicked }
              className={ classNames(
              'content-layer',
              { faded: this.props.navOpen }
              ) }>
              <BodyContent>
                <Switch>
                  {
                    modules.map( ( module, i ) => (
                      <Route key={ i } path={ `/${ module.route }` } component={ module.component } />
                    ) )
                  }
                  <Route path='/' exact={ true } component={ () => (
                    <Redirect to={ `/${ modules[ 0 ].route }` } />
                  ) } />
                  <Route path='' component={ NotFound }/>
                  <Redirect to={ '/404' } />
                </Switch>
              </BodyContent>
            </ContentLayer>
          </BodyContainer>
        </Container>
      </ThemeProvider>
    );
  }
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: grid;  
  grid-template-rows: ${ props => props.theme.headerHeight } auto;  
  box-sizing: border-box;
  color: ${ props => props.theme.color };
  background-color: ${ props => props.theme.background };
  
  h1 {
    font-weight: lighter;
    font-family: "Helvetica Neue", sans-serif;
    font-size: ${ props => props.theme.type.h1 };
  } 
  
  h2 {
    font-weight: lighter;
    font-family: "Helvetica Neue", sans-serif;
    font-size: ${ props => props.theme.type.h2 };
  }
  
  h3 {
    font-weight: lighter;
    font-family: "Helvetica Neue", sans-serif;
    font-size: ${ props => props.theme.type.h3 };
  }
`;

injectGlobal`
  @font-face {
     font-family: 'Noto';
     src: url( 'static/fonts/NotoSerif-Regular.ttf' );
  }
`;

const BodyContainer = styled.div`
  z-index: 0;
  display: grid;
`;

const width = 124;
const transitionLength = '400ms';
const SideNav = styled.div`
  padding: 0;
  margin: 0;
  height: 100%;
  width: ${ width }px;
  z-index: 2;
  width: ${ width }px;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  box-sizing: border-box;
  font-family: ${ props => props.theme.type.navFont };
  color: ${ props => props.theme.color };
  background-color: ${ props => props.theme.background };
  left: 0;
  box-shadow: ${ shadowMixin( 1 ) };
  transition: left ${ transitionLength } cubic-bezier(0.165, 0.84, 0.44, 1);
  &.hidden {
    left: -${ width + 1 }px;
  }
  
  a {
    text-decoration: none;
    color: ${ props => props.theme.color };
  } 
`;

const NavLink = styled.div`
  font-weight: 100;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: capitalize;
  font-size: 12px;
  padding-left: 8px;
  font-family: ${ props => props.theme.type.navFont };
  border-top: thin solid ${ props => props.theme.trimColor };
  border-bottom: thin solid ${ props => props.theme.trimColor };
`;

const SliderLayer = styled.div`
  position: fixed;
  z-index: 2;
  height: 100%;
  justify-content: flex-start;
`;

const ContentLayer = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  transition: opacity ${ transitionLength } cubic-bezier(0.165, 0.84, 0.44, 1);
   &.faded {
    opacity: .35;
  }
`;

const BodyContent = styled.div`
  height: 100%;
  font-size: ${ props => props.theme.type.bodySize };
  max-width: 1444px;
`;
const mapStateToProps = ( state ) => {
  return {
    navOpen: state.app.navOpen
  }
};

const mapDispatchToProps = ( dispatch ) =>
  bindActionCreators( Creators, dispatch );

export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)( App ) );