import { termsContentHtml } from "../content";
import { ContentContainer, MainContainer } from "../styles";

export default async function TermsAndConditions() {
  return (
    <MainContainer>
      <ContentContainer
        dangerouslySetInnerHTML={{ __html: termsContentHtml }}
      />
    </MainContainer>
  );
}
