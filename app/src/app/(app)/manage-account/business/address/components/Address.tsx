import { LabelAndValue } from '@/components/LabelAndValue';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';
import { Button, Column, useTheme } from '@cdaxfx/ui';

interface IProps {
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  registeredOffice2: string;
  registeredOffice1: string;
  principalPlaceOfBusiness: string;
  mailingAddress: string;
  previousOffice1: string;
  previousOffice2: string;
  previousOffice3: string;
  onEdit(): void;
}
export const AddressTable: React.FC<IProps> = ({
  addressLine1,
  addressLine2,
  city,
  country,
  postcode,
  state,
  registeredOffice2,
  registeredOffice1,
  principalPlaceOfBusiness,
  mailingAddress,
  previousOffice1,
  previousOffice2,
  previousOffice3,
  onEdit,
}) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  return (
    <Column style={{ width: '100%' }}>
      <Column style={{ width: '100%' }}>
        <Column
          padding="sm"
          gap="sm"
          style={{
            borderRadius: 8,
            backgroundColor: theme.backgroundColor.layout['container-L2'].value,
            width: '100%',
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <LabelAndValue label="Address Line 1" value={addressLine1} />
          <LabelAndValue label="Address Line 2" value={addressLine2} />
          <LabelAndValue label="Postcode" value={postcode} />
          <LabelAndValue label="City" value={city} />
          <LabelAndValue label="State" value={state} />
          <LabelAndValue label="Country" value={country} />
          <LabelAndValue
            label="Registered Office 1"
            value={registeredOffice1}
          />
          <LabelAndValue
            label="Registered Office 2"
            value={registeredOffice2}
          />

          <LabelAndValue
            label="Principal place of business"
            value={principalPlaceOfBusiness}
          />
          <LabelAndValue label="Mailing address" value={mailingAddress} />

          <LabelAndValue label="Previous office 1" value={previousOffice1} />
          <LabelAndValue label="Previous office 2" value={previousOffice2} />
          <LabelAndValue label="Previous office 3" value={previousOffice3} />
        </Column>

        {currentUser?.role !== UserRole.ViewerUser &&
          currentUser?.role !== UserRole.TeamMember && (
            <Button
              style={{ alignSelf: 'center' }}
              text="Edit"
              leftIcon="pen-2"
              roundness="rounded"
              onClick={onEdit}
            />
          )}
      </Column>
    </Column>
  );
};
