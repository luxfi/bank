import styled from 'styled-components';

export const AddClientButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 25%;
  height: 122px;
  border: 1px solid
    ${(props) => props.theme.borderColor.layout['border-subtle'].value};
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};

  transition:
    background-color 0.3s ease-in-out,
    opacity 0.9s,
    transform 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L2'].value};
    opacity: 0.9;

    transform: translateY(-3px);
    transition: transform 0.3s ease;
  }
`;
