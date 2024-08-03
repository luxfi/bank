import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../auth/AuthSlice";
import { EntityType, selectRegistrationType } from "../../registration/RegistrationSlice";
import { businessDocuments } from "./businessDocuments";
import { individualDocuments } from "./individualDocuments";

export function useDocumentList() {
  const user = useAppSelector(selectCurrentUser);
  const isBusinessRegistration = user?.contact?.account?.entityType === EntityType.Business;
  const docStyle = isBusinessRegistration ? businessDocuments: individualDocuments;
  return docStyle;
}
