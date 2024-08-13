import type { FC } from "react";

export interface TextCardProps {
  title: string;
  subTitle: string;
  detail: string;
  className?: string;
}

export const TextCard: FC<TextCardProps> = (props) => {
  const { title, subTitle, detail, className } = props;

  return (
    <div className={`flex-none w-[337px] h-[284px] px-[20px] py-8 flex flex-col justify-between items-start bg-[0D0D0D] border border-white-10 rounded-[14px] ${className}`}>
      <h3 className="uppercase text-base leading-normal text-white">
        {title}
      </h3>
      <div className="flex flex-col gap-8">
        <h3 className="text-base text-white">
          {subTitle}
        </h3>
        <p className="text-[14px] text-white-65 leading-normal">
          {detail}
        </p>
      </div>
    </div>
  );
};