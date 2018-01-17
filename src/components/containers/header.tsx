import * as React from 'react';
import styled from 'styled-components';

export type Props = {}
export type State = {}

import FaBeer from "react-icons/fa/beer"

const HeaderContainer = styled.div`
  height: 50px;
  background-color: ${ props => props.theme.header_bg };
  display: grid;
  grid-template-columns: repeat(2, 0fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
`;

const Col = styled.div`
  background-color: lightcoral;
  width: 50px;
  height: 50px;
  grid-auto-columns: 200px;
  grid-row: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const Icon = styled( FaBeer )`
//   color: pink
// `;

class Header extends React.Component<Props, State > {
  render() {
    return (
      <HeaderContainer>
        <Col>
          Header
        </Col>

        <Col>
          <FaBeer/>
        </Col>
      </HeaderContainer>
  );
  }
}

export default Header;