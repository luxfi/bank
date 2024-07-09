"use client";
import React from "react";
import { useInView } from "react-intersection-observer";

import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  50% {
    opacity: 0.1;
  }
  80% {
    opacity: 0.2;
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedContainer = styled.div<{ $inView: boolean; $time: number }>`
  opacity: ${(props) => (props.$inView ? 1 : 0)};
  transform: ${(props) =>
    props.$inView ? "translateY(100%)" : "translateY(0)"};
  animation: ${(props) => (props.$inView ? fadeInUp : "none")}
    ${(props) => props.$time}s ease-out forwards;
`;

interface IAnimatedDivProps extends React.HTMLProps<HTMLDivElement> {
  time?: number;
  rootMargin?: number;
}

const AnimatedDiv: React.FC<IAnimatedDivProps> = ({
  children,
  time = 0.5,
  rootMargin = 10,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: `${rootMargin}px 0px`,
  });

  return (
    <AnimatedContainer ref={ref} $inView={inView} {...props} $time={time}>
      {children}
    </AnimatedContainer>
  );
};

export default AnimatedDiv;
