import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .css-dev-only-do-not-override-2i2tap.ant-input:hover,
  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }

  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:focus,
  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:focus-within,
  .css-dev-only-do-not-override-2i2tap.ant-input:focus,
  .css-dev-only-do-not-override-2i2tap.ant-input:focus-within {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
`;

export const LabelError = styled.span`
  font-size: 500;
  font-size: ${(props) => props.theme.size['16px']};
  margin-top: ${(props) => props.theme.size['8px']};
  margin-left: ${(props) => props.theme.size['16px']};
  color: ${(props) => props.theme.colors.danger};
`;

export const LabelHelper = styled.span`
  font-size: 400;
  font-size: ${(props) => props.theme.size['12px']};
  margin-top: ${(props) => props.theme.size['8px']};
  margin-left: ${(props) => props.theme.size['16px']};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
`;

const ContainerLabelError = styled.div`
  display: flex;
  align-items: center;

  span {
    font-size: 16px;
    width: fit-content;
    height: fit-content;
    color: ${(props) => props.theme.colors.label};
  }

  p {
    font-size: 12px;
    margin-left: 4px;
    color: ${(props) => props.theme.colors.danger};
  }
`;

const Label = styled.label`
  font-weight: ${({ theme }) =>
    theme.typography.caption.regular.value.fontWeight};
  font-size: ${({ theme }) => theme.typography.caption.regular.value.fontSize};
  margin-bottom: ${(props) => props.theme.size['8px']};
  color: ${({ theme }) => theme.textColor.interactive.enabled.value};
`;

export { Label, Container, ContainerLabelError };
