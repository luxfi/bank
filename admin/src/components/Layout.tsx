import { PropsWithChildren, ReactNode } from "react";
import Body from "./Body";
import NavBar from "./NavBar";

export default function Layout({
    children,
    navigationButtons,
}: PropsWithChildren<LayoutProps>) {
    return (
        <Body>
            {navigationButtons ? <NavBar children={navigationButtons} /> : null}
            {children}
        </Body>
    );
}

export interface LayoutProps {
    navigationButtons?: ReactNode | undefined;
}
