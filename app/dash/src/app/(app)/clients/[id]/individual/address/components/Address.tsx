import { LabelAndValue } from '@/components/LabelAndValue';

import { Button, Column, useTheme } from '@luxbank/ui';

interface IProps {
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  previousAddressLine1: string;
  previousAddressLine2: string;
  previousState: string;

  previousCity: string;
  previousPostcode: string;
  previousCountry: string;

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
            label="Previous Address Line 1"
            value={previousAddressLine1}
          />
          <LabelAndValue
            label="Previous Address Line 2"
            value={previousAddressLine2}
          />
          <LabelAndValue label="Previous Postcode" value={previousPostcode} />
          <LabelAndValue label="Previous City" value={previousCity} />
          <LabelAndValue label="Previous State" value={previousState} />
          <LabelAndValue label="Previous Country" value={previousCountry} />
        </Column>

        <Button
          style={{ alignSelf: 'center' }}
          text="Edit"
          leftIcon="pen-2"
          roundness="rounded"
          onClick={onEdit}
        />
      </Column>
    </Column>
  );
};
