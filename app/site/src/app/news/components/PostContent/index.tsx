"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import AnimatedDiv from "@/components/AnimatedDiv";

import { TTags } from "@/models/ghost";

import { TitleAllPosts } from "../../styles";
import FilterTag from "../FilterTags";
import Posts from "../Posts";

export default function PostContent() {
  const searchParams = useSearchParams();

  const [activeTag, setActiveTag] = useState<TTags>(
    searchParams.has("tag") ? (searchParams.get("tag") as TTags) : "all",
  );

  return (
    <AnimatedDiv style={{ paddingInline: "18px" }}>
      <Suspense>
        <FilterTag onClick={setActiveTag} activeTag={activeTag} />
      </Suspense>

      <TitleAllPosts style={{ marginTop: "48px" }}>All Posts</TitleAllPosts>

      <Suspense>
        <Posts filterTag={activeTag} />
      </Suspense>
    </AnimatedDiv>
  );
}
