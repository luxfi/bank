/// <reference types="react" />
export type TMultiSelectRoundness = 'none' | 'rounded' | 'pill';
export type TMultiSelectOption = {
    value: string;
    label: string;
};
export type TMultiSelectedItems = {
    [key: string]: TMultiSelectOption;
};
export interface IMultiSelectProps {
    disabled?: boolean;
    errorText?: string;
    helperText?: string;
    id: string;
    label?: string;
    options: TMultiSelectOption[];
    placeholder?: string;
    roundness?: TMultiSelectRoundness;
    onChange: (selectedItems: TMultiSelectOption[]) => void;
    style?: React.CSSProperties;
}
//# sourceMappingURL=types.d.ts.map