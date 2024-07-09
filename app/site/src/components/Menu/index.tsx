"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import HamburgerMenu from "@/components/Hamburguer";

import { CustomButton } from "../Button";
import {
  ItemsContainer,
  MainContainer,
  MenuContainer,
  MenuItem,
} from "./styles";
import { usePathname } from "next/navigation";

interface IMenuLink {
  label: string;
  path: string;
}

const menuLinks: Array<IMenuLink> = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Account",
    path: "/account",
  },
  {
    label: "Online Platform",
    path: "/online-platform",
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "News",
    path: "/news",
  },
  {
    label: "Contact Us",
    path: "/contact",
  },
  {
    label: "Login",
    path: "https://app.cdaxforex.com/login",
  },
];

export default function Menu() {
  const [openMenu, setOpenMenu] = useState(false);
  const activePath = usePathname();

  return (
    <MainContainer>
      <MenuContainer>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <HamburgerMenu
            open={openMenu}
            onClick={() => setOpenMenu(!openMenu)}
          />
          <Link
            href="/"
            onClick={() => {
              setOpenMenu(false);
            }}
          >
            <Image
              src="/images/cdax-logo.svg"
              alt="logo"
              width={191}
              height={45}
              style={{
                cursor: "pointer",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Link>
        </div>
        <ItemsContainer $open={openMenu}>
          {menuLinks.map(({ label, path }, index) => (
            <MenuItem
              $active={activePath === path}
              target={path.startsWith("http") ? "_blank" : "_self"}
              key={index}
              href={path}
              onClick={() => {
                setOpenMenu(false);
              }}
            >
              {label}
            </MenuItem>
          ))}
        </ItemsContainer>
        <Link
          target="_blank"
          href={"https://app.cdaxforex.com/registration"}
          onClick={() => {
            setOpenMenu(false);
          }}
        >
          <CustomButton>Register</CustomButton>
        </Link>
      </MenuContainer>
    </MainContainer>
  );
}
