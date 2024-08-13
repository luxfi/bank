import type { FC } from "react";

interface Props {
  list: string[];
  selectedTabIndex: number;
  onSelectTab: (value: number) => void;
}

export const IndustryTab: FC<Props> = (props) => {
  const { list, selectedTabIndex, onSelectTab } = props;

  return (
    <div className="hidden lg:flex flex-row justify-between items-center w-full max-w-[700px] mt-[74px]">
      {list.map((item, index) =>
        <div
          key={index}
          className={`text-[18px] leading-[22px] py-2 px-[10px] rounded-[5px] text-white-65 cursor-pointer ${selectedTabIndex === index && "!text-white bg-[#0D0D0D] border border-solid border-opacity-10 border-[#FFF]"}`}
          onClick={() => onSelectTab(index)}
        >
          {item}
        </div>
      )}
    </div>
  )
}