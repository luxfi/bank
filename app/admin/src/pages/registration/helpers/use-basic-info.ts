import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchInvitationData } from "../../../features/invitation/UserInvitationApi";
import { selectRegistrationBasicInfo, setEntityType } from "../../../features/registration/RegistrationSlice";
import { useQuery } from "../../../utils/use-query";

export function useBasicInfo() {
  const dispatch = useAppDispatch();
  const appBasicInfo = useAppSelector(selectRegistrationBasicInfo);

  const [basicInfo, setBasicInfo] = React.useState(appBasicInfo);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const query = useQuery();
  const invitation = query.get('invitation');
  React.useEffect(() => {
    if (!invitation) {
      setBasicInfo(appBasicInfo);
    }
  },[appBasicInfo, invitation])
  React.useEffect(() => {
    if (invitation) {
      setLoading(true);
      fetchInvitationData(invitation).then((data) => {
        setBasicInfo({
          firstname: String(data?.firstname),
          lastname: String(data?.lastname),
          email: String(data?.email),
        });

        if (data?.entityType) {
          dispatch(setEntityType(data.entityType));
        }
      }).catch((error) => {
        if (error.message) {
          setError(error.message);
        } else {
          setError('Invitation request failed, please try again.');
        }
      }).finally(() => setLoading(false));
    }
  }, [dispatch, invitation]);

  return { error, loading, basicInfo };
}
