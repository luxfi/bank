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
  previousAddressLine1: string;
  previousAddressLine2: string;
  previousCity: string;
  previousCountry: string;
  previousPostcode: string;
  previousState: string;
  onEdit(): void;
}
export const AddressTable: React.FC<IProps> = ({
  addressLine1,
  addressLine2,
  city,
  country,
  onEdit,
  postcode,
  state,
  previousAddressLine1,
  previousAddressLine2,
  previousCity,
  previousCountry,
  previousPostcode,
  previousState,
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
            label="Previous address line 1"
            value={previousAddressLine1}
          />
          <LabelAndValue
            label="Previous address line 2"
            value={previousAddressLine2}
          />
          <LabelAndValue label="Previous city" value={previousCity} />
          <LabelAndValue label="Previous postcode" value={previousPostcode} />
          <LabelAndValue label="Previous state" value={previousState} />
          <LabelAndValue label="Previous country" value={previousCountry} />
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
