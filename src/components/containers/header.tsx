import * as React from 'react';
import styled from 'styled-components';

import FaGithub = require("react-icons/lib/fa/github");
import MdMenu = require("react-icons/lib/md/menu");
import { shadowMixin } from '@app/util/styleMixins';
import { Creators } from '@app/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AppConfig from '@app/appConfig';

export type Props = {
  AppSetNavOpen: typeof Creators.AppSetNavOpen,
  navOpen: boolean
}
export type State = {}

class Header extends React.Component<Props, State > {
  render() {
    return (
      <HeaderContainer>
        <MenuWrapper>
          <MdMenu onClick={ () => this.props.AppSetNavOpen( !this.props.navOpen ) }/>
          <Title>{ AppConfig.title }</Title>
        </MenuWrapper>
        <LinkWrapper>
          <a target="_blank" href={ AppConfig.url }>
            <FaGithub/>
          </a>
        </LinkWrapper>
      </HeaderContainer>
    );
  }
}

const HeaderContainer = styled.div`
  max-width: 100vw;
  font-family: 'Noto', serif;
  display: grid;
  font-family: ${ props => props.theme.type.headerFont };
  grid-template-columns: 164px 64px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding-left: 8px;
  padding-right: 8px;
  z-index: 3;
  box-shadow: ${ shadowMixin( 1 ) };
`;

const LinkWrapper = styled.div`
  a {
    color: ${ props => props.theme.color };
    font-size: 24px;
    &:active {
      color: ${ props => props.theme.color };
    }
  } 
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: ${ props => props.theme.color };
`;

const Title = styled.div`
  margin-left: 8px;
`;

const mapStateToProps = ( state ) => {
  return {
    navOpen: state.app.navOpen
  }
};

const mapDispatchToProps = ( dispatch ) =>
  bindActionCreators( Creators, dispatch );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Header );