"use client";

import { IndustryTab } from "@/components/IndustryTab";
import { LineText, type LineTextProps } from "@/components/LineText"
import { TextCard, type TextCardProps } from "@/components/TextCard";
import { Button } from "@hanzo/ui/primitives";
import { useState } from "react";

const lineTextData: LineTextProps[] = [
  {
    text: "Competitive FX Rates",
    direction: "right",
    top: "top-[150px]",
    left: "left-[calc(50%-510px)]",
    textMaxWidth: "max-w-[210px]"
  },
  {
    text: "Named accounts with dedicated details for easy deposits.",
    direction: "right",
    top: "top-[285px]",
    left: "left-[calc(50%-630px)]",
    textMaxWidth: "max-w-[315px]"
  },
  {
    text: "Mass Payments Made Easy Bulk upload simplifies sending funds.",
    direction: "left",
    top: "top-[130px]",
    left: "left-[calc(50%+180px)]",
    textMaxWidth: "max-w-[340px]"
  },
  {
    text: "Real-time reports track your activity.",
    direction: "left",
    top: "top-[265px]",
    left: "left-[calc(50%+180px)]",
    textMaxWidth: "max-w-[340px]"
  }
];

const textCardData: TextCardProps[] = [
  {
    title: "Personalized support",
    subTitle: "Talk to Real People",
    detail: "Build genuine relationships with our dedicated account managers, who offer real, chatbot-free support in 15+ languages.",
    className: "ml-[196px]"
  },
  {
    title: "SAFEGUARDING",
    subTitle: "Liquidity Guaranteed",
    detail: "Enjoy instant access and protection, with your funds remaining 100% liquid at all times and being stored in top banks regulated by the Isle of Man Financial Services Authority (IOMFSA).",
  },
  {
    title: "Foregin exchange",
    subTitle: "Great Exchange Rates",
    detail: "Save money and access over 30 currencies, including GBP, EUR, USD, and CHF. Our expertise lies in secure, high-value conversions."
  },
  {
    title: "MOBILE APP",
    subTitle: "Coming Soon Stay in Control from Anywhere",
    detail: "Access your Lux Finance account anytime, anywhere with our upcoming mobile app for phones and tablets."
  }
]

const industryTabList = ["Who We're Built For", "Export/Import", "Manufaturing", "Marketing"];

export const HomeLayout = () => {
  const [industryTabIndex, setIndustryTabIndex] = useState(0);

  const onSelectTab = (value: number) => {
    setIndustryTabIndex(value);
  }

  return (
    <div className="w-full">
      {/* Section 1 */}
      <div className="relative flex flex-col justify-center items-center pb-[100px] overflow-hidden">
        <div className="flex justify-center items-center flex-col max-w-[910px] mt-[134px] z-2">
          <h3 className="uppercase text-base text-white-65">Crypto</h3>
          <h1 className="uppercase text-[40px] leading-[48px] text-white text-center font-bold mt-[18px] font-heading">
            Send and receive moeny globally with the speed of blockchain
          </h1>
          <h3 className="text-base text-white-65 text-center mt-[18px] max-w-[609px]">Gone are the days of clunky international transactions and tangled currency woes. We make navigating the global marketplace smooth and secure.</h3>
          <Button className="mt-[38px] py-2 px-4">Setup your account in minutes</Button>
        </div>
        <div className="absolute left-[-130px] top-10 rotate-[13deg]">
          <img src="assets/images/diamond.png" alt="left-diamond" width={341.85} />
        </div>
        <div className="absolute right-[-60px] top-[200px] rotate-[-13deg]">
          <img src="assets/images/diamond.png" alt="right-diamond" width={341.85} />
        </div>
      </div>

      {/* Section 2 */}
      <div className="relative w-full flex flex-col justify-center items-center mt-[84px]">
        <div className="max-w-[724px] mb-[68px]">
          <h1 className="uppercase text-[32px] leading-[auto] text-white text-center font-bold font-heading">
            Manage multiple currencies in one place.
          </h1>
          <p className="text-base leading-[22px] text-white-65 text-center mt-[18px]">
            Lux Finance lets you feel like a local in every country you operate.
          </p>
        </div>
        <div className="relative w-full flex flex-col justify-center items-center">
          {
            lineTextData.map((data) => <LineText {...data} />)
          }
          <img src="assets/images/diamond-1.png" alt="diamond-1" />
        </div>
      </div>

      {/* Section 3 */}
      <div className="w-full flex flex-col justify-center items-center mt-[30px]">
        <h1 className="uppercase text-[32px] leading-[auto] text-white text-center font-bold font-heading">
          Physical and virtual card
        </h1>
        <p className="text-base text-white-85 leading-[22px] max-w-[700px] text-center mt-[18px]">
          Forget waiting for weeks. Get your virtual card in seconds and start spending your crypto like cash.
        </p>
        <div className="flex flex-row justify-center items-center gap-[138px] mt-[119px]">
          <img src="assets/images/black_card.png" alt="black card" />
          <div className="flex flex-col gap-[42px]">
            <div>
              <div className="flex flex-row gap-[15px]">
                <img src="assets/images/card.svg" alt="card" />
                <span className="text-[20px] text-white leading-[22px]">Instant Card Issuance</span>
              </div>
              <p className="text-base leading-[22px] text-white-65 max-w-[410px] mt-3">
                Forget waiting for weeks. Get your virtual card in seconds and start spending your crypto like cash.
              </p>
            </div>
            <div>
              <div className="flex flex-row gap-[15px]">
                <img src="assets/images/hand.svg" alt="hand" />
                <span className="text-[20px] text-white leading-[22px]">Seamless Spend Control</span>
              </div>
              <p className="text-base leading-[22px] text-white-65 max-w-[410px] mt-3">
                Manage your spending with a single click. Freeze or unfreeze your card instantly for ultimate security.
              </p>
            </div>
            <div>
              <div className="flex flex-row gap-[15px]">
                <img src="assets/images/global.svg" alt="global" />
                <span className="text-[20px] text-white leading-[22px]">Global Limits, No Borders</span>
              </div>
              <p className="text-base leading-[22px] text-white-65 max-w-[410px] mt-3">
                Enjoy high spending and withdrawal limits, wherever your travels take you. Crypto knows no boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="w-full flex flex-col justify-center items-center mt-[120px]">
        <h1 className="uppercase text-[32px] leading-[auto] text-white text-center font-bold font-heading">
          Unleash Your Crypto. Spend It Anywhere
        </h1>
        <p className="text-base text-white-85 leading-[22px] text-center mt-[18px]">
          Take control of your finances on the go. Manage and track transactions from your phone or desktop with ease
        </p>
        <div className="flex flex-row w-full gap-[37px] mt-[96px] overflow-x-scroll overflow-y-hidden no-scroll">
          {
            textCardData.map((data) => <TextCard {...data} />)
          }
        </div>
      </div>

      {/* Section 5 */}
      <div className="w-full flex flex-col justify-center items-center mt-[120px]">
        <h1 className="uppercase text-[32px] leading-[auto] text-white text-center font-bold font-heading">
          How it works
        </h1>
        <p className="text-base text-white-85 leading-[22px] text-center mt-[18px]">
          Three Steps, Then Relax
        </p>
        <div className="border-l border-white-65 mt-[108px]">
          <ul className="list-disc ml-[14px]">
            <li className="pl-[40px]">
              <h3 className="text-[20px]">
                Step1
              </h3>
              <h4 className="text-base mt-[62px]">
                Application
              </h4>
              <p className="text-base text-white-65 mt-[28px] max-w-[200px] tracking-negative-tiny">
                Complete a simple form to tell us about you and your financial needs.
              </p>
            </li>
            <li className="mt-[55px] pl-[40px]">
              <h3 className="text-[20px]">
                Step2
              </h3>
              <h4 className="text-base mt-[62px]">
                Review
              </h4>
              <p className="text-base text-white-65 mt-[28px] max-w-[200px] tracking-negative-tiny">
                Our team reviews your application to tailor financial solutions for you.
              </p>
            </li>
            <li className="mt-[55px] pl-[40px]">
              <h3 className="text-[20px]">
                Step3
              </h3>
              <h4 className="text-base mt-[62px]">
                Confirmation
              </h4>
              <p className="text-base text-white-65 mt-[28px] max-w-[200px] tracking-negative-tiny">
                Get a decision in 48 hours and start your financial journey with Lux Finance.
              </p>
            </li>
          </ul>
        </div>
        <Button className="px-4 py-2 mt-[80px]">Open an Account</Button>
      </div>

      {/* Section 6 */}
      <div className="w-full flex flex-col justify-center items-center mt-[120px] relative">
        <div className="z-2 flex flex-col justify-center items-center">
          <h1 className="uppercase text-[32px] leading-[auto] text-white text-center font-bold font-heading">
            Why We’re Better
          </h1>
          <p className="text-base text-white-85 leading-[22px] text-center mt-[18px] max-w-[700px]">
            Lux Finance is renowned as a trusted leader in the financial industry, dedicated to long-term partnerships with enterprise clients, funded startups, and sovereign wealth offices.
          </p>
          <div className="flex flex-row gap-[34px] justify-center items-center mt-[153px]">
            <div className="w-[370px] h-[210px] bg-[#0D0D0D] rounded-[10px] px-4 pt-5 overflow-hidden">
              <p className="text-[#CCCDDC] text-base leading-[22px]">
                Multicurrency Accounts
              </p>
              <p className="text-[#CCCDDC] text-base leading-[22px] mt-[20px]">
                Seamlessly manage your global finances with our streamlined solution for international businesses.
              </p>
              <p className="text-[#CCCDDC] text-base leading-[22px] mt-[20px]">
                Simplify transactions across currencies, reduce operational costs, and focus on growth.
              </p>
            </div>
            <div className="w-[439px] h-[210px] bg-[#0D0D0D] rounded-[10px] px-4 pt-5 overflow-hidden">
              <p className="text-[#CCCDDC] text-base leading-[22px]">
                Foreign Exchange
              </p>
              <p className="text-[#CCCDDC] text-base leading-[22px] mt-[20px]">
                Simplify your currency transactions with our dedicated foreign exchange services.
              </p>
              <p className="text-[#CCCDDC] text-base leading-[22px] mt-[20px]">
                Manage exchange risks effectively with expert traders, enhancing financial operations and securing edge in your market.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-full flex flex-col justify-center items-center">
          <img src="assets/images/better_bg.png" alt="better_bg" className="w-[1440px] h-[526px]" />
        </div>
      </div>

      {/* Section 7 */}
      <div className="w-full flex flex-col justify-center items-center mt-[120px] relative">
        <div className="z-2 flex flex-col justify-center items-center relative">
          <h1 className="uppercase text-[32px] leading-[auto] text-white text-center font-bold font-heading">
            Web3 Integration
          </h1>
          <p className="text-base text-white-85 leading-[22px] text-center mt-[18px]">
            Most Efficient On/Off Ramps and Exchange Rates for Blockchain Assets
          </p>
          <div className="bg-[#0D0D0D] rounded-[10px] px-4 py-5 overflow-hidden w-[350px] absolute left-[calc(50%-600px)] top-[200px]">
            <p className="text-[#CCCDDC] text-base leading-[22px]">
              Effortless Onboarding: Lux Network makes entering the world of Web3 smooth.
            </p>
            <p className="text-[#CCCDDC] text-base leading-[22px] mt-[20px]">
              Best Rates & Conversions: Buy and sell crypto with ease, at top exchange rates.
            </p>
          </div>
          <div className="bg-[#0D0D0D] rounded-[10px] px-4 py-5 overflow-hidden w-[350px] absolute left-[calc(50%+200px)] top-[150px]">
            <p className="text-[#CCCDDC] text-base leading-[22px]">
              Deepest Bitcoin Liquidity: Access the largest pools for smooth transactions.
            </p>
            <p className="text-[#CCCDDC] text-base leading-[22px] mt-[20px]">
              Highest Margin Trading Accounts: Maximize your trading potential with our high-margin accounts.
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <img src="assets/images/web3_bg.png" alt="web3_bg" className="w-[822px] h-[588px]" />
        </div>
      </div>

      {/* Section 8 */}
      <div className="w-full flex flex-col justify-center items-center mt-[120px]">
        <h1 className="uppercase text-[32px] leading-[auto] text-white text-center font-bold font-heading">
          Debit and credit cards
        </h1>
        <p className="text-base text-white-85 leading-[22px] text-center mt-[18px] max-w-[685px]">
          Lux Finance is renowned as a trusted leader in the financial industry, dedicated to long-term partnerships with enterprise clients, funded startups, and sovereign wealth offices.
        </p>
        <div className="w-full flex flex-col justify-center items-center mt-[74px]">
          <img src="assets/images/card_bg.png" alt="card_bg" className="w-[662px] h-[390px]" />
        </div>
        <Button className="mt-[65px] py-2 px-4">Get Lux Credit Card</Button>
      </div>

      {/* Section 9 */}
      <div className="w-full flex flex-col justify-center items-center mt-[120px] mb-[260px]">
        <h1 className="uppercase text-[32px] leading-[auto] text-white text-center font-bold font-heading">
          Industries
        </h1>
        <p className="text-base text-white-85 leading-[22px] text-center mt-[18px]">
          Industry-specific account managers understand your needs.
        </p>
        <IndustryTab list={industryTabList} selectedTabIndex={industryTabIndex} onSelectTab={onSelectTab} />
        <div className="flex flex-row justify-center items-center gap-[78px] mt-[40px]">
          <div className="flex items-center justify-center w-[448px] h-[400px] bg-[#0D0D0D]">
            <img src="assets/images/industry.png" alt="industry" />
          </div>
          <div>
            <h1 className="text-[40px] text-white leading-normal">Who We're Built For</h1>
            <p className="text-white-65 text-xl leading-normal max-w-[470px]">Lux Finance works with everyone from funded startups to large enterprises, but we're especially popular with companies that have an international presence.</p>
          </div>
        </div>
      </div>

    </div>
  )
}