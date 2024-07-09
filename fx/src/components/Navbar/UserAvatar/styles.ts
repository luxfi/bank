import styled from 'styled-components';

export const Container = styled.div<{ $sidebarOpen: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.fontSize.body_sm.value};
  gap: 12px;
  color: ${(props) => props.theme.textColor.layout.secondary.value};
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  padding: 4px;
  padding-inline: ${(props) => (props.$sidebarOpen ? '8px' : '4px')};
  cursor: pointer;

  transition: all 0.3s ease-in-out;

  // ellipsis
  * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-emphasized'].value};
  }
`;

export const AvatarPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.theme.backgroundColor.interactive['primary-default'].value};

  font-size: ${(props) => props.theme.fontSize.body_sm.value};
`;
