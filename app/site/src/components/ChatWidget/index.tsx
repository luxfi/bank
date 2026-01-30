"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { LuxLogo } from "@/components/Logo";

const BRAND_COLOR = "#FFFFFF"; // Gold accent

// Page context for AI
const getPageContext = (pathname: string): string => {
  const contexts: Record<string, string> = {
    "/": "Lux Financial homepage - unified financial infrastructure platform",
    "/about": "About Lux Financial - company history and mission",
    "/products/orchestration": "Orchestration API - unified payment processing",
    "/products/wallets": "Multi-chain wallet infrastructure",
    "/products/cross-border": "Cross-border payment solutions",
    "/products/issuance": "Stablecoin issuance platform",
    "/insights": "Market insights and stablecoin analytics",
    "/learn": "Educational resources about stablecoins and payments",
    "/news": "Latest news and announcements",
    "/contact": "Contact information",
  };

  for (const [path, context] of Object.entries(contexts)) {
    if (pathname.startsWith(path) && path !== "/") {
      return context;
    }
  }

  return contexts[pathname] || `Lux Financial page: ${pathname}`;
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: "What is Lux?", prompt: "What is Lux Financial and what services do you offer?" },
  { label: "Stablecoins", prompt: "Which stablecoins does Lux support?" },
  { label: "Get Started", prompt: "How do I get started with Lux Financial?" },
  { label: "API Docs", prompt: "Where can I find the API documentation?" },
];

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pageContext = getPageContext(pathname);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hi! I'm here to help you learn about Lux Financial. You're currently viewing ${pageContext}. How can I assist you today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, pageContext, messages.length]);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.hanzo.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer hz_widget_public",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          messages: [
            {
              role: "system",
              content: `You are Lux AI, an assistant for Lux Financial (lux.financial). You help users understand stablecoin infrastructure, payment APIs, and financial services.

Key Information:
- Lux Financial is a technology services provider offering open-source enterprise crypto infrastructure for regulated financial institutions (github.com/luxfi)
- Products: Orchestration API, Multi-chain Wallets, Cross-border Payments, Stablecoin Issuance
- Supported stablecoins: USDC, USDT, PYUSD, EURC, USDY
- Supported chains: Ethereum, Polygon, Arbitrum, Optimism, Base, Solana, Stellar, Tron
- Payment rails: ACH, Wire, SEPA, SWIFT, PIX, SPEI, Faster Payments
- API docs at docs.lux.financial
- MPC custody and post-quantum security features

Current page context: ${pageContext}

Be helpful, concise, and professional. For technical questions, provide accurate information. For pricing or sales, direct users to /contact.`,
            },
            ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: messageText.trim() },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.choices[0].message.content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "I'm having trouble connecting. Please visit our docs at docs.lux.financial or contact us at /contact.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Connection issue. Please visit docs.lux.financial for documentation.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, pageContext, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <FloatingButton onClick={() => setIsOpen(true)}>
          <LuxLogo size={28} variant="white" />
          <PulseRing />
        </FloatingButton>
      )}

      {/* Chat window */}
      {isOpen && (
        <ChatWindow>
          <Header>
            <HeaderLeft>
              <LogoWrapper>
                <LuxLogo size={24} variant="white" />
              </LogoWrapper>
              <HeaderText>
                <HeaderTitle>Lux AI</HeaderTitle>
                <HeaderSubtitle>Ask anything</HeaderSubtitle>
              </HeaderText>
            </HeaderLeft>
            <CloseButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </CloseButton>
          </Header>

          <MessagesContainer>
            {messages.map((message) => (
              <MessageBubble key={message.id} $isUser={message.role === "user"}>
                {message.content}
              </MessageBubble>
            ))}
            {isLoading && (
              <MessageBubble $isUser={false}>
                <LoadingDots>
                  <Dot style={{ animationDelay: "0ms" }} />
                  <Dot style={{ animationDelay: "150ms" }} />
                  <Dot style={{ animationDelay: "300ms" }} />
                </LoadingDots>
              </MessageBubble>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          {messages.length <= 1 && (
            <QuickActions>
              {quickActions.map((action) => (
                <QuickAction key={action.label} onClick={() => handleSend(action.prompt)}>
                  {action.label}
                </QuickAction>
              ))}
            </QuickActions>
          )}

          <InputContainer>
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={isLoading}
            />
            <SendButton onClick={() => handleSend()} disabled={!input.trim() || isLoading} $hasInput={!!input.trim()}>
              <SendIcon />
            </SendButton>
          </InputContainer>
        </ChatWindow>
      )}
    </>
  );
}

// Icons
const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// Animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

// Styled components
const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #000000;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: scale(1.05);
    border-color: ${BRAND_COLOR};
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
  }
`;

const PulseRing = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: ${BRAND_COLOR};
  animation: ${pulse} 2s infinite;
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 520px;
  max-height: 80vh;
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  background: #0a0a0a;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderText = styled.div``;

const HeaderTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const HeaderSubtitle = styled.div`
  font-size: 11px;
  color: #666;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: #222;
    color: white;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  align-self: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  background: ${({ $isUser }) => ($isUser ? BRAND_COLOR : "#1a1a1a")};
  color: ${({ $isUser }) => ($isUser ? "black" : "#e5e5e5")};
  border-bottom-right-radius: ${({ $isUser }) => ($isUser ? "4px" : "16px")};
  border-bottom-left-radius: ${({ $isUser }) => ($isUser ? "16px" : "4px")};
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  background: #666;
  border-radius: 50%;
  animation: ${bounce} 0.6s infinite;
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px 12px;
`;

const QuickAction = styled.button`
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 16px;
  background: #1a1a1a;
  border: 1px solid #333;
  color: #999;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #222;
    border-color: #444;
    color: white;
  }
`;

const InputContainer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #333;
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 24px;
  padding: 10px 16px;
  font-size: 14px;
  color: white;
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: #666;
  }

  &:focus {
    border-color: #444;
  }
`;

const SendButton = styled.button<{ $hasInput: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${({ $hasInput }) => ($hasInput ? BRAND_COLOR : "transparent")};
  color: ${({ $hasInput }) => ($hasInput ? "black" : "#666")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
