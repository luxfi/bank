export type Slide = (props: SlideProps) => React.ReactChild;

export interface SlideProps {
  goToSlide: (slide: Slide) => void,
  selectedSlide: number,
}
