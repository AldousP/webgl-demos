import * as React from 'react';
import styled from "styled-components";
import breakpoints from "@app/components/styled/breakpoints";

export type Props = {}
export type State = {}

class AppContent extends React.Component<Props, State > {
  render() {
    return (
      <ContentContainer>
        { this.props.children }
      </ContentContainer>
  );
  }
}

const ContentContainer = styled.div`
  padding: 16px;
  display: grid;
  justify-content: center;
  border: thin solid #ff8cb9;
  overflow-y: auto;
 
  margin-top: ${ props => props.theme.headerHeight };

  @media (max-width: ${ breakpoints.small }px) {
    padding: 16px;
  }
`;

export default AppContent;