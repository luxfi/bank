'use client';

import styled from 'styled-components';

export const Container = styled.div`
  transition: all 0.3s ease-in-out;

  .ant-tabs-tab.ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: ${(props) =>
        props.theme.textColor.layout.emphasized.value} !important;
      font-weight: 700;
      font-size: ${(props) => props.theme.fontSize.body_md.value};
      line-height: 24px;
      letter-spacing: 0.08px;
    }
  }

  .ant-tabs-tab-btn {
    color: ${(props) => props.theme.textColor.layout.secondary.value};
    font-weight: 500;
    font-size: ${(props) => props.theme.fontSize.body_md.value};
    line-height: 24px;
    letter-spacing: 0.08px;
  }
`;
