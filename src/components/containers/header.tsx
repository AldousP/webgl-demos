import * as React from 'react';
import styled from 'styled-components';

export type Props = {}
export type State = {}

import FaGithub = require("react-icons/lib/fa/github");

const HeaderContainer = styled.div`
  height: 50px;
  background-color: ${ props => props.theme.headerBackground};
  display: grid;
  grid-template-columns: 45vw 64px;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

const Col = styled.div`
  grid-row: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px;
`;

const Logo = Col.extend`
  margin-left: 16px;
  justify-content: flex-start;
`;

const Link = styled.a`
  font-size: 28px;
  color: white;
  text-decoration: none;
`;

class Header extends React.Component<Props, State > {
  render() {
    return (
      <HeaderContainer>
        <Logo>
          WebGL demos
        </Logo>
        <Col>
          <Link target="_blank" href="https://github.com/AldousP/webgl-demos">
            <FaGithub/>
          </Link>
        </Col>
      </HeaderContainer>
  );
  }
}

export default Header;