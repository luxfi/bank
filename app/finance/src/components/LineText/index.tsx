import type { FC } from "react";

export interface LineTextProps {
  text: string;
  direction: "left" | "right";
  top: string;
  left: string;
  textMaxWidth: string;
}

export const LineText: FC<LineTextProps> = (props) => {
  const { text, direction, top, left, textMaxWidth } = props;

  return (
    <div className={`absolute ${top} ${left} flex flex-row justify-center items-center gap-3`}>
      {
        direction === "left" && <img src={"assets/images/left.png"} alt="direct" />
      }
      <p className={`text-white ${textMaxWidth} text-${direction} text-base xl:text-[20px] leading-6`}>{text}</p>
      {
        direction === "right" && <img src={"assets/images/right.png"} alt="direct" />
      }
    </div>
  )
};
