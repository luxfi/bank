"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import HamburgerMenu from "@/components/Hamburguer";
import { LuxLogo } from "@/components/Logo";
import CommandPalette from "@/components/CommandPalette";
import NavDropdown from "@/components/NavDropdown";
import { useThemeMode } from "@/context/ThemeContext";

import { CustomButton, SecondaryButton } from "../Button";
import {
  ItemsContainer,
  MainContainer,
  MenuContainer,
  MenuItem,
  SearchButton,
  SearchText,
  SearchShortcut,
  DesktopNav,
  RightSection,
  ThemeToggle,
} from "./styles";
import { usePathname } from "next/navigation";

// Search icon SVG
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Sun icon for light mode
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

// Moon icon for dark mode
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Menu() {
  const [openMenu, setOpenMenu] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const activePath = usePathname();
  const { mode, toggleTheme } = useThemeMode();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true);
  }, []);

  const handleCloseCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
  }, []);

  return (
    <>
      <MainContainer>
        <MenuContainer>
          {/* Left: Hamburger + Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
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
              <LuxLogo
                size={40}
                variant={mode === "dark" ? "white" : "color"}
                style={{
                  cursor: "pointer",
                }}
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <DesktopNav>
            <NavDropdown
              label="Platform"
              type="platform"
              active={activePath === "/account"}
            />
            <NavDropdown
              label="Solutions"
              type="solutions"
              active={activePath === "/online-platform"}
            />
            <MenuItem
              $active={activePath === "/about"}
              href="/about"
            >
              About
            </MenuItem>
            <MenuItem
              $active={activePath === "/news"}
              href="/news"
            >
              News
            </MenuItem>
            <MenuItem
              $active={activePath === "/help"}
              href="/help"
            >
              Help
            </MenuItem>
            <MenuItem
              $active={false}
              href="https://docs.lux.financial"
              target="_blank"
            >
              Docs
            </MenuItem>
          </DesktopNav>

          {/* Mobile Navigation */}
          <ItemsContainer $open={openMenu}>
            <MenuItem
              $active={activePath === "/account"}
              href="/account"
              onClick={() => setOpenMenu(false)}
            >
              Platform
            </MenuItem>
            <MenuItem
              $active={activePath === "/online-platform"}
              href="/online-platform"
              onClick={() => setOpenMenu(false)}
            >
              Solutions
            </MenuItem>
            <MenuItem
              $active={activePath === "/about"}
              href="/about"
              onClick={() => setOpenMenu(false)}
            >
              About
            </MenuItem>
            <MenuItem
              $active={activePath === "/news"}
              href="/news"
              onClick={() => setOpenMenu(false)}
            >
              News
            </MenuItem>
            <MenuItem
              $active={activePath === "/help"}
              href="/help"
              onClick={() => setOpenMenu(false)}
            >
              Help
            </MenuItem>
            <MenuItem
              $active={false}
              href="https://docs.lux.financial"
              target="_blank"
              onClick={() => setOpenMenu(false)}
            >
              Docs
            </MenuItem>
            <MenuItem
              $active={false}
              href="https://app.lux.financial/login"
              target="_blank"
              onClick={() => setOpenMenu(false)}
            >
              Login
            </MenuItem>
          </ItemsContainer>

          {/* Right: Theme Toggle + Search + CTA */}
          <RightSection>
            {mounted && (
              <ThemeToggle
                onClick={toggleTheme}
                aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
              >
                {mode === "dark" ? <SunIcon /> : <MoonIcon />}
              </ThemeToggle>
            )}

            <SearchButton onClick={handleOpenCommandPalette} aria-label="Search (⌘K)">
              <SearchIcon />
              <SearchText>Search...</SearchText>
              <SearchShortcut>
                <span>⌘</span>K
              </SearchShortcut>
            </SearchButton>

            <Link
              target="_blank"
              href={"https://app.lux.financial"}
              onClick={() => {
                setOpenMenu(false);
              }}
            >
              <SecondaryButton>Login</SecondaryButton>
            </Link>
            <Link
              target="_blank"
              href={"https://cal.com/luxfi"}
              onClick={() => {
                setOpenMenu(false);
              }}
            >
              <CustomButton>Talk to Sales</CustomButton>
            </Link>
          </RightSection>
        </MenuContainer>
      </MainContainer>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={handleCloseCommandPalette}
      />
    </>
  );
}
