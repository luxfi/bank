import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
`;

const CardHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  gap: 16px;
  border-radius: 8px 8px 0 0;
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L2'].value};

  border-radius: 0 0 8px 8px;
`;

const CardSection = styled.div`
  display: flex;
  width: 100%;
  padding-block: ${(props) => props.theme.padding.sm.value};
  gap: ${(props) => props.theme.inline.md.value};
  border-bottom: 1px dashed
    ${(props) => props.theme.borderColor.layout['border-subtle'].value};
`;

const root = {
  Container,
  CardHeader,
  CardBody,
  CardSection,
};

export { root as DetailsCardTemplate };
