import IndustryPage from "./IndustryPage";

export function generateStaticParams() {
  return [
    { industry: "financial-institutions" },
    { industry: "fintech" },
    { industry: "insurance" },
    { industry: "insurtech" },
    { industry: "crypto" },
    { industry: "saas" },
    { industry: "retail" },
    { industry: "manufacturing" },
    { industry: "gaming" },
    { industry: "professional-services" },
    { industry: "real-estate" },
    { industry: "ngo" },
  ];
}

export default function Page() {
  return <IndustryPage />;
}
