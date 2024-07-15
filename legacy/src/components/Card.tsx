import React from 'react'
import styled from 'styled-components'
import {PropsWithChildren} from 'react'
import { device } from '../utils/media-query-helpers'

interface Props {
  type?: string;
}

const StyledContainer = styled.div<Props>`
  @media ${device.lg} {
    width: ${(props) => props.type === 'wide' ? '100%' : '48%'};
  }
  position: relative;
  border: 1px solid lightgray;
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
  width: 100%;
  margin-bottom: 15px;
`
const Title = styled.h2`
  color: #fff;
  background-color: #00569E;
  margin: 0;
  font-size: 14px;
  padding: 5px 15px;
  font-weight: 700;
  @media (max-width: 500px) {
    font-size: 1rem;
  }
`
const Content = styled.div`
  padding: 5px 0px;
  font-size: 14px;
`
interface CardProps {
    title?: string;
    type?: string;
    onEditClick?: any;
    style?: any;
}
export const Card = ({children, title, type, style} : PropsWithChildren<CardProps>) => (
  <StyledContainer type = {type} style = {style}>
    <Title>{title}</Title>
    <Content>{children}</Content>
  </StyledContainer>
)

export const FlexContainer = styled.div`
  @media ${device.lg} {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  display: flex;
  flex-direction: column;
`