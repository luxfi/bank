import React from "react";
import { Slide } from "./slide-types";

export function useGoToSlide(slides: Slide[]): [number, ((slide: Slide) => void)] {
  const [selectedSlide, setSelectedSlide] = React.useState(0);

  const goToSlide = React.useCallback((slide: Slide) => {
    const idx = slides.findIndex(current => current === slide);
    if (idx >= 0) {
      setSelectedSlide(idx);
      window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
      console.error(`Slide "${typeof (slide)}" was not found.`);
    }
  }, [slides]);

  // const getIndex = React.useCallback((slide: Slide) => {
  //   const idx = slides.findIndex(current => current === slide);
  //   return idx;
  // }, [slides]);

  return [selectedSlide, goToSlide];
}
