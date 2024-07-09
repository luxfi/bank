"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { IPagination, IPosts, TTags } from "@/models/ghost";

import { Pagination } from "antd";

import { buildPath } from "@/api/fetcher/types";

import * as Skeleton from "../../components/Skeletons";
import CardPost from "../Card";
import {
  CardPostStyled,
  ContainerPagination,
  ContainerPosts,
  MainContainer,
} from "./styles";

interface IProps {
  filterTag: TTags;
}

export default function Posts({ filterTag }: IProps) {
  const route = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    currentPage: searchParams.has("page")
      ? Number(searchParams.get("page"))
      : 1,
    limit: 9,
  });
  const [data, setData] = useState<{
    posts: IPosts[];
    pagination: IPagination;
  }>();

  const getFetchURL = useMemo(() => {
    const params = new Map();

    if (filterTag !== "all") {
      params.set("tag", `${filterTag}`);
    }

    params.set("page", pagination.currentPage);

    const path = buildPath({
      endpoint: "/news/api",
      params: Object.fromEntries(params.entries()),
    });

    return path;
  }, [filterTag, pagination]);

  const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const previousFilterTag = usePrevious(filterTag);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);

    return await fetch(getFetchURL, { method: "GET", cache: "no-store" })
      .then((data) => data.json())
      .then((response) => {
        setData({
          pagination: response.pagination,
          posts: response.posts,
        });
      })
      .finally(() => setIsLoading(false));
  }, [getFetchURL]);

  useEffect(() => {
    if (previousFilterTag && filterTag !== previousFilterTag)
      setPagination((pS) => ({ ...pS, currentPage: 1 }));
  }, [filterTag, previousFilterTag]);

  useEffect(() => {
    fetchPosts();
  }, [pagination]);

  useEffect(() => {
    route.replace(getFetchURL.replace("/api", ""));
  }, [getFetchURL]);

  return (
    <MainContainer>
      {!data || isLoading ? (
        <Skeleton.Posts />
      ) : (
        <ContainerPosts>
          {data.posts.map((post, index) => (
            <CardPostStyled key={post.id} delay={index * 0.1}>
              <CardPost
                key={post.id}
                id={post.id}
                thumbnail={(post?.feature_image as string) ?? ""}
                description={post?.excerpt ?? ""}
                title={post?.title ?? ""}
              />
            </CardPostStyled>
          ))}
        </ContainerPosts>
      )}

      {data?.posts && data?.posts?.length > 0 && data?.pagination && (
        <ContainerPagination>
          <Pagination
            onChange={(page) =>
              setPagination((pS) => ({ ...pS, currentPage: page }))
            }
            defaultCurrent={1}
            current={pagination.currentPage}
            total={data?.pagination.total}
          />
        </ContainerPagination>
      )}
    </MainContainer>
  );
}
