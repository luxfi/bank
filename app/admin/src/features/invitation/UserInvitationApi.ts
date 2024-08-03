import * as ApiHelpers from '../../utils/api-helpers';
import { EntityType } from '../registration/RegistrationSlice';
import { invitationDto } from './model/invitation-schema';

export const submitInvitationData = async (data: invitationDto): Promise<boolean> => {
  const res = await ApiHelpers.fetch("/api/v1/invitations/user-role", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const { statusCode, message } = await res.json();

    if (statusCode === 200) {
      return true;
    }

    if (message) {
      throw new Error(message);
    }
  }

  throw new Error("Invitation couldn't be sent, please try again.")
}

export const fetchInvitationData = async (uuid: string): Promise<invitationDto & { entityType: EntityType } | null> => {
    const res = await ApiHelpers.fetch(`/api/v1/invitations/${uuid}`, {
      method: 'GET',
    });

    if (res.ok) {
      const { data: { invitation }, statusCode } = await res.json();

      if (statusCode === 200) {
        return invitation;
      }
    }

    throw new Error("Invitation request failed, please try again.");
};
