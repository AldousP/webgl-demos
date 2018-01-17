import * as React from 'react';
import styled from 'styled-components';

export type Props = {}
export type State = {}

import FaGithub = require("react-icons/lib/fa/github");

const HeaderContainer = styled.div`
  height: 50px;
  background-color: ${ props => props.theme.header_bg };
  display: grid;
  grid-template-columns: 25vw 64px;
  justify-content: space-between;
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

class Header extends React.Component<Props, State > {
  render() {
    return (
      <HeaderContainer>
        <Logo>
          Header
        </Logo>
        <Col>
          <FaGithub/>
        </Col>
      </HeaderContainer>
  );
  }
}

export default Header;