"use client";
import Link from "next/link";
import styled from "styled-components";
import { CustomButton, SecondaryButton } from "@/components/Button";
import {
  PageContainer,
  HeroSection,
  HeroContent,
  ProductBadge,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  TwoColumnSection,
  ContentBlock,
  BlockTitle,
  BlockText,
  FeatureList,
  FeatureItem,
  FeatureCheck,
  FeatureText,
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  CardGrid,
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
  CTASection,
  CTATitle,
  CTASubtitle,
} from "../styles";
import { DeviceSize } from "@/styles/theme/default";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SmartphoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const FingerprintIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
    <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
    <path d="M2 16h.01" />
    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
    <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
  </svg>
);

const QrCodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="3" height="3" />
    <rect x="18" y="14" width="3" height="3" />
    <rect x="14" y="18" width="3" height="3" />
    <rect x="18" y="18" width="3" height="3" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const features = [
  {
    icon: WalletIcon,
    title: "Multi-Asset Wallet",
    description: "Hold fiat, crypto, stablecoins, and securities in one app. 50+ chains and 10,000+ tokens supported.",
    color: "#22C55E",
  },
  {
    icon: FingerprintIcon,
    title: "Biometric Security",
    description: "Face ID, Touch ID, and hardware security keys. MPC-backed signing for maximum protection.",
    color: "#8B5CF6",
  },
  {
    icon: SendIcon,
    title: "Instant Transfers",
    description: "Send money anywhere instantly. Pay friends, businesses, or transfer globally in seconds.",
    color: "#3B82F6",
  },
  {
    icon: QrCodeIcon,
    title: "QR Payments",
    description: "Scan to pay or receive. Generate payment codes for merchants and P2P transactions.",
    color: "#FFFFFF",
  },
  {
    icon: BellIcon,
    title: "Real-Time Alerts",
    description: "Instant notifications for all transactions. Custom alerts for price movements and account activity.",
    color: "#EC4899",
  },
  {
    icon: GlobeIcon,
    title: "200+ Countries",
    description: "Send and receive from anywhere. Local payment methods and competitive FX rates.",
    color: "#22D3EE",
  },
];

export default function Mobile() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#22C55E">Mobile App</ProductBadge>
          <HeroTitle>
            Your bank in your pocket
          </HeroTitle>
          <HeroSubtitle>
            The complete mobile banking experience. Fiat, crypto, stablecoins, and
            securities—all in one beautiful, secure app.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Get the App</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial/guides/mobile" target="_blank">
              <SecondaryButton>View Documentation</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Phone Mockups */}
      <MockupSection>
        <MockupContainer>
          <PhoneMockup $position="left">
            <PhoneFrame>
              <PhoneNotch />
              <PhoneScreen>
                <MockScreen $variant="home">
                  <MockHeader>
                    <MockAvatar>JD</MockAvatar>
                    <MockGreeting>
                      <span>Good morning</span>
                      <strong>John</strong>
                    </MockGreeting>
                    <MockNotification>
                      <BellIcon />
                    </MockNotification>
                  </MockHeader>
                  <MockBalance>
                    <MockBalanceLabel>Total Balance</MockBalanceLabel>
                    <MockBalanceValue>$124,582.45</MockBalanceValue>
                    <MockBalanceChange $positive>+2.4% today</MockBalanceChange>
                  </MockBalance>
                  <MockAssets>
                    <MockAssetRow>
                      <MockAssetIcon $color="#627EEA">Ξ</MockAssetIcon>
                      <MockAssetInfo>
                        <MockAssetName>Ethereum</MockAssetName>
                        <MockAssetAmount>12.5 ETH</MockAssetAmount>
                      </MockAssetInfo>
                      <MockAssetValue>$31,250.00</MockAssetValue>
                    </MockAssetRow>
                    <MockAssetRow>
                      <MockAssetIcon $color="#2775CA">$</MockAssetIcon>
                      <MockAssetInfo>
                        <MockAssetName>USDC</MockAssetName>
                        <MockAssetAmount>50,000 USDC</MockAssetAmount>
                      </MockAssetInfo>
                      <MockAssetValue>$50,000.00</MockAssetValue>
                    </MockAssetRow>
                    <MockAssetRow>
                      <MockAssetIcon $color="#F7931A">₿</MockAssetIcon>
                      <MockAssetInfo>
                        <MockAssetName>Bitcoin</MockAssetName>
                        <MockAssetAmount>0.85 BTC</MockAssetAmount>
                      </MockAssetInfo>
                      <MockAssetValue>$36,125.00</MockAssetValue>
                    </MockAssetRow>
                  </MockAssets>
                  <MockNav>
                    <MockNavItem $active>Home</MockNavItem>
                    <MockNavItem>Send</MockNavItem>
                    <MockNavItem>Scan</MockNavItem>
                    <MockNavItem>Cards</MockNavItem>
                  </MockNav>
                </MockScreen>
              </PhoneScreen>
            </PhoneFrame>
          </PhoneMockup>

          <PhoneMockup $position="center">
            <PhoneFrame $featured>
              <PhoneNotch />
              <PhoneScreen>
                <MockScreen $variant="send">
                  <MockSendHeader>
                    <MockBackBtn>←</MockBackBtn>
                    <span>Send Money</span>
                    <div />
                  </MockSendHeader>
                  <MockRecipient>
                    <MockRecipientAvatar>MG</MockRecipientAvatar>
                    <MockRecipientInfo>
                      <MockRecipientName>Maria Garcia</MockRecipientName>
                      <MockRecipientAccount>Mexico • SPEI</MockRecipientAccount>
                    </MockRecipientInfo>
                  </MockRecipient>
                  <MockAmountInput>
                    <MockAmountValue>$5,000</MockAmountValue>
                    <MockAmountCurrency>USD</MockAmountCurrency>
                  </MockAmountInput>
                  <MockConversion>
                    <MockConversionArrow>↓</MockConversionArrow>
                    <MockConversionRate>
                      <span>Recipient gets</span>
                      <strong>87,250.00 MXN</strong>
                      <small>Rate: 17.45 • Fee: $5.00</small>
                    </MockConversionRate>
                  </MockConversion>
                  <MockSendButton>
                    <FingerprintIcon />
                    Confirm with Face ID
                  </MockSendButton>
                </MockScreen>
              </PhoneScreen>
            </PhoneFrame>
          </PhoneMockup>

          <PhoneMockup $position="right">
            <PhoneFrame>
              <PhoneNotch />
              <PhoneScreen>
                <MockScreen $variant="activity">
                  <MockActivityHeader>Activity</MockActivityHeader>
                  <MockActivityList>
                    <MockActivityItem>
                      <MockActivityIcon $type="receive">↓</MockActivityIcon>
                      <MockActivityInfo>
                        <MockActivityTitle>Received USDC</MockActivityTitle>
                        <MockActivityTime>Today, 2:45 PM</MockActivityTime>
                      </MockActivityInfo>
                      <MockActivityAmount $positive>+$2,500.00</MockActivityAmount>
                    </MockActivityItem>
                    <MockActivityItem>
                      <MockActivityIcon $type="send">↑</MockActivityIcon>
                      <MockActivityInfo>
                        <MockActivityTitle>Sent to Maria</MockActivityTitle>
                        <MockActivityTime>Today, 11:30 AM</MockActivityTime>
                      </MockActivityInfo>
                      <MockActivityAmount>-$5,000.00</MockActivityAmount>
                    </MockActivityItem>
                    <MockActivityItem>
                      <MockActivityIcon $type="swap">⇄</MockActivityIcon>
                      <MockActivityInfo>
                        <MockActivityTitle>Swapped ETH → USDC</MockActivityTitle>
                        <MockActivityTime>Yesterday</MockActivityTime>
                      </MockActivityInfo>
                      <MockActivityAmount>$10,000.00</MockActivityAmount>
                    </MockActivityItem>
                    <MockActivityItem>
                      <MockActivityIcon $type="receive">↓</MockActivityIcon>
                      <MockActivityInfo>
                        <MockActivityTitle>Salary Deposit</MockActivityTitle>
                        <MockActivityTime>Jan 15</MockActivityTime>
                      </MockActivityInfo>
                      <MockActivityAmount $positive>+$8,500.00</MockActivityAmount>
                    </MockActivityItem>
                  </MockActivityList>
                </MockScreen>
              </PhoneScreen>
            </PhoneFrame>
          </PhoneMockup>
        </MockupContainer>
        <MockupCaption>
          Beautiful, intuitive interface • Works on iOS and Android
        </MockupCaption>
      </MockupSection>

      {/* Features */}
      <Section>
        <SectionHeader>
          <SectionTitle>Everything You Need</SectionTitle>
          <SectionSubtitle>
            A complete mobile banking experience for the digital economy
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={3}>
          {features.map((feature, index) => (
            <Card key={index} $accent={feature.color}>
              <CardIcon $color={feature.color}>
                <feature.icon />
              </CardIcon>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* Security */}
      <TwoColumnSection>
        <ContentBlock>
          <ProductBadge $color="#8B5CF6">Security</ProductBadge>
          <BlockTitle>Bank-Grade Security</BlockTitle>
          <BlockText>
            Your assets are protected by the same infrastructure that secures
            billions in institutional funds. MPC key management, HSM-backed
            signing, and biometric authentication.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Face ID and Touch ID authentication</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>MPC-backed transaction signing</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Hardware security key support</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>End-to-end encrypted communications</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>

        <SecurityMockup>
          <SecurityPhone>
            <PhoneNotch />
            <SecurityScreen>
              <SecurityIcon>
                <ShieldIcon />
              </SecurityIcon>
              <SecurityTitle>Secure Transaction</SecurityTitle>
              <SecurityDesc>Authenticate to confirm</SecurityDesc>
              <SecurityBiometric>
                <FingerprintIcon />
              </SecurityBiometric>
              <SecurityLabel>Touch sensor to verify</SecurityLabel>
            </SecurityScreen>
          </SecurityPhone>
        </SecurityMockup>
      </TwoColumnSection>

      {/* White Label */}
      <Section>
        <SectionHeader>
          <SectionTitle>White-Label Mobile Banking</SectionTitle>
          <SectionSubtitle>
            Launch your own branded mobile app in weeks, not months
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={3}>
          <Card>
            <CardTitle>Your Brand</CardTitle>
            <CardDescription>
              Fully customizable with your logo, colors, and brand identity.
              Users never see Lux—only your brand.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>App Store Ready</CardTitle>
            <CardDescription>
              We handle App Store and Play Store submissions. Get approved
              quickly with our compliance documentation.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>SDK & APIs</CardTitle>
            <CardDescription>
              Integrate mobile features into your existing app with our
              SDK, or launch standalone with our white-label solution.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      {/* Download CTA */}
      <CTASection>
        <DownloadBadges>
          <DownloadBadge>
            <AppleIcon />
            <DownloadText>
              <small>Download on the</small>
              <span>App Store</span>
            </DownloadText>
          </DownloadBadge>
          <DownloadBadge>
            <PlayIcon />
            <DownloadText>
              <small>Get it on</small>
              <span>Google Play</span>
            </DownloadText>
          </DownloadBadge>
        </DownloadBadges>
        <CTATitle>Ready to go mobile?</CTATitle>
        <CTASubtitle>
          Contact us to launch your own branded mobile banking app.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

// Apple Icon
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

// Play Store Icon
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.31 0 .61.1.86.28l15.14 8.5c.49.28.8.8.8 1.37s-.31 1.09-.8 1.37l-15.14 8.5c-.25.18-.55.28-.86.28-.83 0-1.5-.67-1.5-1.5z"/>
  </svg>
);

// Styled Components
const MockupSection = styled.section`
  padding: 4rem 0;
  overflow: hidden;
`;

const MockupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;
  padding: 0 2rem;

  @media ${DeviceSize.md} {
    gap: 0.5rem;
  }

  @media ${DeviceSize.sm} {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const PhoneMockup = styled.div<{ $position?: string }>`
  transform: ${props => {
    if (props.$position === 'left') return 'perspective(1000px) rotateY(15deg) scale(0.9)';
    if (props.$position === 'right') return 'perspective(1000px) rotateY(-15deg) scale(0.9)';
    return 'scale(1)';
  }};
  opacity: ${props => props.$position === 'center' ? 1 : 0.85};
  z-index: ${props => props.$position === 'center' ? 2 : 1};

  @media ${DeviceSize.sm} {
    transform: none;
    opacity: 1;
    display: ${props => props.$position !== 'center' ? 'none' : 'block'};
  }
`;

const PhoneFrame = styled.div<{ $featured?: boolean }>`
  width: 280px;
  height: 580px;
  background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
  border-radius: 40px;
  padding: 12px;
  box-shadow: ${props => props.$featured
    ? '0 50px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)'
    : '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.08)'};

  @media ${DeviceSize.md} {
    width: 240px;
    height: 500px;
    border-radius: 32px;
  }
`;

const PhoneNotch = styled.div`
  width: 120px;
  height: 28px;
  background: #000;
  border-radius: 0 0 16px 16px;
  margin: 0 auto 8px;

  @media ${DeviceSize.md} {
    width: 100px;
    height: 24px;
  }
`;

const PhoneScreen = styled.div`
  background: #000;
  border-radius: 28px;
  height: calc(100% - 36px);
  overflow: hidden;

  @media ${DeviceSize.md} {
    border-radius: 24px;
  }
`;

const MockScreen = styled.div<{ $variant?: string }>`
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background: ${props => {
    if (props.$variant === 'send') return 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)';
    if (props.$variant === 'activity') return '#0a0a0a';
    return 'linear-gradient(180deg, #0f1419 0%, #000 100%)';
  }};
`;

const MockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const MockAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22C55E, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
`;

const MockGreeting = styled.div`
  flex: 1;

  span {
    display: block;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.5);
  }

  strong {
    font-size: 1.1rem;
    color: white;
  }
`;

const MockNotification = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    color: rgba(255,255,255,0.7);
  }
`;

const MockBalance = styled.div`
  text-align: center;
  padding: 1.5rem 0;
  margin-bottom: 1rem;
`;

const MockBalanceLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 0.25rem;
`;

const MockBalanceValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;

  @media ${DeviceSize.md} {
    font-size: 1.75rem;
  }
`;

const MockBalanceChange = styled.div<{ $positive?: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.$positive ? '#22C55E' : '#EF4444'};
  margin-top: 0.25rem;
`;

const MockAssets = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MockAssetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
`;

const MockAssetIcon = styled.div<{ $color?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$color || '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const MockAssetInfo = styled.div`
  flex: 1;
`;

const MockAssetName = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
`;

const MockAssetAmount = styled.div`
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
`;

const MockAssetValue = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
`;

const MockNav = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-top: auto;
`;

const MockNavItem = styled.div<{ $active?: boolean }>`
  font-size: 0.7rem;
  color: ${props => props.$active ? '#22C55E' : 'rgba(255,255,255,0.4)'};
  font-weight: ${props => props.$active ? 500 : 400};
`;

// Send screen styles
const MockSendHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  color: white;
  font-weight: 500;
`;

const MockBackBtn = styled.div`
  font-size: 1.25rem;
  opacity: 0.7;
`;

const MockRecipient = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const MockRecipientAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const MockRecipientInfo = styled.div``;

const MockRecipientName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: white;
`;

const MockRecipientAccount = styled.div`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
`;

const MockAmountInput = styled.div`
  text-align: center;
  padding: 1rem 0;
`;

const MockAmountValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;

  @media ${DeviceSize.md} {
    font-size: 2.5rem;
  }
`;

const MockAmountCurrency = styled.div`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  margin-top: 0.25rem;
`;

const MockConversion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
`;

const MockConversionArrow = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.2);
  color: #22C55E;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MockConversionRate = styled.div`
  text-align: center;

  span {
    display: block;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.5);
  }

  strong {
    display: block;
    font-size: 1.25rem;
    color: white;
    margin: 0.25rem 0;
  }

  small {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.4);
  }
`;

const MockSendButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #22C55E, #16a34a);
  border-radius: 16px;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: auto;

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Activity screen styles
const MockActivityHeader = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
`;

const MockActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MockActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
`;

const MockActivityIcon = styled.div<{ $type?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => {
    if (props.$type === 'receive') return 'rgba(34, 197, 94, 0.2)';
    if (props.$type === 'send') return 'rgba(239, 68, 68, 0.2)';
    return 'rgba(59, 130, 246, 0.2)';
  }};
  color: ${props => {
    if (props.$type === 'receive') return '#22C55E';
    if (props.$type === 'send') return '#EF4444';
    return '#3B82F6';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const MockActivityInfo = styled.div`
  flex: 1;
`;

const MockActivityTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
`;

const MockActivityTime = styled.div`
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
`;

const MockActivityAmount = styled.div<{ $positive?: boolean }>`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.$positive ? '#22C55E' : 'white'};
`;

const MockupCaption = styled.div`
  text-align: center;
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  margin-top: 2rem;
`;

// Security mockup
const SecurityMockup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SecurityPhone = styled.div`
  width: 260px;
  height: 520px;
  background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
  border-radius: 36px;
  padding: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.08);

  @media ${DeviceSize.sm} {
    width: 220px;
    height: 440px;
  }
`;

const SecurityScreen = styled.div`
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border-radius: 28px;
  height: calc(100% - 36px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const SecurityIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  svg {
    width: 40px;
    height: 40px;
    color: #8B5CF6;
  }
`;

const SecurityTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const SecurityDesc = styled.div`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 2rem;
`;

const SecurityBiometric = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(139, 92, 246, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;

  svg {
    width: 32px;
    height: 32px;
    color: #8B5CF6;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
`;

const SecurityLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  margin-top: 1rem;
`;

// Download badges
const DownloadBadges = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;

  @media ${DeviceSize.sm} {
    flex-direction: column;
    align-items: center;
  }
`;

const DownloadBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
  }

  svg {
    color: white;
  }
`;

const DownloadText = styled.div`
  text-align: left;

  small {
    display: block;
    font-size: 0.65rem;
    color: rgba(255,255,255,0.5);
  }

  span {
    font-size: 1rem;
    font-weight: 500;
    color: white;
  }
`;
