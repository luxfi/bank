"use client";

import { Suspense } from "react";

import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";

import PostContent from "./components/PostContent";

export default function News() {
  return (
    <>
      <AnimatedDiv>
        <BannerWithCard
          image="/images/background_news.jpg"
          showCard={false}
          imageTitle="News & Insights"
          responsiveHeight="250px"
        />
      </AnimatedDiv>

      <Suspense>
        <PostContent />
      </Suspense>
    </>
  );
}
