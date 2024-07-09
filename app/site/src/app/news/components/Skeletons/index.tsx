import Skeleton from "@/components/Skeleton";

import { ContainerPosts, CardPost } from "./styles";

function Posts() {
  return (
    <ContainerPosts>
      {[...Array(9)].map((_, index) => (
        <CardPost key={index}>
          <div style={{ height: 242 }}>
            <Skeleton />
          </div>

          <div
            style={{
              height: 128,
              marginBlock: 32,
              marginInline: 16,
              borderRadius: 8,
            }}
          >
            <Skeleton />
          </div>

          <div style={{ alignSelf: "flex-end", marginTop: 32, height: 40 }}>
            <Skeleton />
          </div>
        </CardPost>
      ))}
    </ContainerPosts>
  );
}

export { Posts };
