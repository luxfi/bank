/// <reference types="react" />
import { TIconVariants } from '../Icon/types';
export type TSelectRoundness = 'none' | 'rounded' | 'pill';
export type TSelectOptions = {
    value: string;
    label: string;
    extraText?: string;
    icon?: TIconVariants;
    image?: string;
};
export interface ISelectProps {
    disabled?: boolean;
    errorText?: string;
    helperText?: string;
    id?: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: TSelectOptions[];
    placeholder?: string;
    roundness?: TSelectRoundness;
    style?: React.CSSProperties;
}
//# sourceMappingURL=types.d.ts.map