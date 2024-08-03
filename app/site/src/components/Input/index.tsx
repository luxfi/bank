"use client";
import { Input as AntInput } from "antd";
import TextArea from "antd/es/input/TextArea";
import styled from "styled-components";

export const CustomInput = styled(AntInput)`
  width: 100%;
  height: 4rem;
`;

interface IInput {
  title: string;
  value: string;
  error?: string;
  type?: string;
  onFocus?: () => void;
  onChange: (e: string) => void;
}

export default function Input({
  title,
  value,
  error,
  type = "text",
  onFocus,
  onChange,
}: IInput) {
  return (
    <div>
      <label style={{ fontSize: "1.8rem" }}>{title}</label>
      {type === "text" && (
        <CustomInput
          onFocus={onFocus}
          onChange={(e: any) => onChange(e.target.value)}
          value={value}
        />
      )}
      {type === "textarea" && (
        <TextArea
          value={value}
          onFocus={onFocus}
          onChange={(e: any) => onChange(e.target.value)}
          style={{ height: "15rem" }}
        />
      )}
      {error && (
        <p style={{ color: "red", fontSize: "1.3rem", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
    </div>
  );
}
