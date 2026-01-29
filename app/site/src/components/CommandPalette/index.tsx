"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PaletteOverlay,
  PaletteContainer,
  SearchInputContainer,
  SearchIcon,
  SearchInput,
  EscKey,
  ResultsContainer,
  CategoryTitle,
  ResultItem,
  ResultIconContainer,
  ResultContent,
  ResultTitle,
  ResultDescription,
  ArrowIcon,
  NoResults,
  PaletteFooter,
  KeyHint,
  KeyboardKey,
} from "./styles";

// Icons as inline SVGs
const SearchSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ArrowRightSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const ExternalLinkSvg = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </svg>
);

// Platform icons
const AccountIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const FxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
);

const NewspaperIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const ApiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
  </svg>
);

const LoginIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
  </svg>
);

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  href: string;
  icon: React.FC;
  category: string;
  external?: boolean;
  keywords?: string[];
}

const commands: CommandItem[] = [
  // Platform
  { id: "accounts", title: "White-Label Accounts", description: "Branded account infrastructure", href: "/account", icon: AccountIcon, category: "Platform", keywords: ["account", "wallet", "iban"] },
  { id: "fx", title: "Real-time FX API", description: "Interbank rates via API", href: "/account", icon: FxIcon, category: "Platform", keywords: ["fx", "forex", "currency", "exchange"] },
  { id: "multicurrency", title: "Multi-Currency Wallets", description: "34+ currencies supported", href: "/account", icon: GlobeIcon, category: "Platform", keywords: ["currency", "wallet", "multi"] },
  { id: "treasury", title: "Treasury & Hedging", description: "FX risk management tools", href: "/account", icon: ShieldIcon, category: "Platform", keywords: ["treasury", "hedge", "forward"] },
  { id: "solutions", title: "Solutions", description: "Online platform features", href: "/online-platform", icon: GlobeIcon, category: "Platform", keywords: ["platform", "solution", "feature"] },
  { id: "security", title: "Enterprise Security", description: "SOC 2 Type II compliant", href: "/account", icon: ShieldIcon, category: "Platform", keywords: ["security", "soc", "compliance"] },

  // Company
  { id: "about", title: "About Us", description: "About Lux Financial", href: "/about", icon: BuildingIcon, category: "Company", keywords: ["about", "company", "mission"] },
  { id: "news", title: "News", description: "Latest updates", href: "/news", icon: NewspaperIcon, category: "Company", keywords: ["news", "blog", "updates"] },
  { id: "contact", title: "Contact", description: "Get in touch", href: "/contact", icon: UsersIcon, category: "Company", keywords: ["contact", "support", "help"] },

  // Resources
  { id: "docs", title: "API Documentation", description: "Developer docs", href: "https://docs.lux.financial", icon: ApiIcon, category: "Resources", external: true, keywords: ["api", "docs", "documentation"] },
  { id: "status", title: "System Status", description: "Platform status", href: "https://status.lux.financial", icon: ShieldIcon, category: "Resources", external: true, keywords: ["status", "uptime"] },
  { id: "privacy", title: "Privacy Policy", description: "Privacy information", href: "/privacy-policy", icon: FileTextIcon, category: "Resources", keywords: ["privacy", "policy"] },
  { id: "terms", title: "Terms & Conditions", description: "Terms of service", href: "/terms-and-conditions", icon: FileTextIcon, category: "Resources", keywords: ["terms", "conditions", "legal"] },

  // Actions
  { id: "login", title: "Login", description: "Sign in to your account", href: "https://app.lux.financial/login", icon: LoginIcon, category: "Actions", external: true, keywords: ["login", "signin", "account"] },
  { id: "register", title: "Register", description: "Create an account", href: "https://app.lux.financial/registration", icon: UsersIcon, category: "Actions", external: true, keywords: ["register", "signup", "create"] },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter commands based on search
  const filteredCommands = search
    ? commands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(search.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(search.toLowerCase()) ||
          cmd.keywords?.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      )
    : commands;

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Flatten for keyboard navigation
  const flatCommands = Object.values(groupedCommands).flat();

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
          break;
        case "Enter":
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            handleSelect(flatCommands[selectedIndex]);
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    },
    [flatCommands, selectedIndex, onClose]
  );

  const handleSelect = (cmd: CommandItem) => {
    if (cmd.external) {
      window.open(cmd.href, "_blank");
    } else {
      router.push(cmd.href);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <PaletteOverlay onClick={onClose} />
      <PaletteContainer>
        <SearchInputContainer>
          <SearchIcon>
            <SearchSvg />
          </SearchIcon>
          <SearchInput
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, features, resources..."
          />
          <EscKey>ESC</EscKey>
        </SearchInputContainer>

        <ResultsContainer>
          {Object.keys(groupedCommands).length === 0 ? (
            <NoResults>No results found for &quot;{search}&quot;</NoResults>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category}>
                <CategoryTitle>{category}</CategoryTitle>
                {items.map((cmd) => {
                  const Icon = cmd.icon;
                  const index = flatCommands.findIndex((c) => c.id === cmd.id);
                  const isSelected = index === selectedIndex;

                  return (
                    <ResultItem
                      key={cmd.id}
                      $selected={isSelected}
                      onClick={() => handleSelect(cmd)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <ResultIconContainer $selected={isSelected}>
                        <Icon />
                      </ResultIconContainer>
                      <ResultContent>
                        <ResultTitle>
                          {cmd.title}
                          {cmd.external && <ExternalLinkSvg />}
                        </ResultTitle>
                        {cmd.description && (
                          <ResultDescription>{cmd.description}</ResultDescription>
                        )}
                      </ResultContent>
                      {isSelected && (
                        <ArrowIcon>
                          <ArrowRightSvg />
                        </ArrowIcon>
                      )}
                    </ResultItem>
                  );
                })}
              </div>
            ))
          )}
        </ResultsContainer>

        <PaletteFooter>
          <KeyHint>
            <KeyboardKey>↑</KeyboardKey>
            <KeyboardKey>↓</KeyboardKey>
            Navigate
          </KeyHint>
          <KeyHint>
            <KeyboardKey>↵</KeyboardKey>
            Select
          </KeyHint>
          <KeyHint style={{ marginLeft: "auto" }}>
            <KeyboardKey>⌘</KeyboardKey>
            <KeyboardKey>K</KeyboardKey>
            to toggle
          </KeyHint>
        </PaletteFooter>
      </PaletteContainer>
    </>
  );
}
