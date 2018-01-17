import * as React from 'react';
import styled from "styled-components";
import breakpoints from "@app/components/styled/breakpoints";

export type Props = {}
export type State = {}

const ContentContainer = styled.div`
  padding: 16px;
  display: grid;
  justify-content: center;
  @media (max-width: ${ breakpoints.small }px) {
    padding: 16px;
  }
`;

class AppContent extends React.Component<Props, State > {
  render() {
    return (
      <ContentContainer>
        { this.props.children }
      </ContentContainer>
  );
  }
}

export default AppContent;