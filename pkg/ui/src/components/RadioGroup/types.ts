export type TRadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
  id?: string;
};

export interface IRadioGroupProps {
  value: string;
  options: Array<TRadioOption>;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}
