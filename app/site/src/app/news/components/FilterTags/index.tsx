import { TTags, Tags } from "@/models/ghost";

import { Container, TagButton } from "./styles";

interface IProps {
  onClick(value: TTags): void;
  activeTag: string;
}

export default function FilterTag({ activeTag, onClick }: IProps) {
  return (
    <Container>
      {Object.entries(Tags).map(([key, value], i) => (
        <TagButton
          onClick={() => {
            onClick(value);
          }}
          $isActive={value === activeTag}
          key={i}
        >
          {key}
        </TagButton>
      ))}
    </Container>
  );
}
