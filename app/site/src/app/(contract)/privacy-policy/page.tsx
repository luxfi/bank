"use server";

import { privacyContentHtml } from "../content";
import { ContentContainer, MainContainer } from "../styles";

export default async function PrivacyPolicy() {
  // const res = await getPages("privacy-policy");
  // if (!res) {
  //   return <div>Not found</div>;
  // }

  return (
    <MainContainer>
      <ContentContainer
        dangerouslySetInnerHTML={{ __html: privacyContentHtml }}
      />
    </MainContainer>
  );
}
