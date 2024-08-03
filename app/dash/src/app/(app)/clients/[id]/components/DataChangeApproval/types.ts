import {
  IApprovelMetadataSession,
  IGetApprovalMetadataResponse,
} from '@/store/useClient/types';

export interface IDataChangeApprovalProps {
  session: IApprovelMetadataSession;
  clientId: string;
}

export const formatApprovalData = (
  data: IGetApprovalMetadataResponse,
  session: IApprovelMetadataSession
) => {
  const isIndividual = !!data.individualMetadata;

  if (session === 'personal' && isIndividual) {
    return [
      {
        label: 'Title',
        value: data.individualMetadata?.title,
      },
      {
        label: 'First Name',
        value: data.individualMetadata?.firstname,
      },
      {
        label: 'Last Name',
        value: data.individualMetadata?.lastname,
      },
      {
        label: 'Phone Number',
        value: data.individualMetadata?.mobileNumber,
      },
    ];
  }

  if (session === 'address' && isIndividual) {
    return [
      {
        label: 'Address Line 1',
        value: data.individualMetadata?.addressLine1,
      },
      {
        label: 'Address Line 2',
        value: data.individualMetadata?.addressLine2,
      },
      {
        label: 'Post code',
        value: data.individualMetadata?.postcode,
      },
      {
        label: 'City',
        value: data.individualMetadata?.city,
      },
      {
        label: 'State',
        value: data.individualMetadata?.state,
      },
      {
        label: 'Country',
        value: data.individualMetadata?.country,
      },
    ];
  }

  if (session === 'employment' && isIndividual) {
    return [
      {
        label: 'Occupation',
        value: data.individualMetadata?.occupation,
      },
      {
        label: 'Employer address 1',
        value: data.individualMetadata?.employerAddress1,
      },
      {
        label: 'Employer address 2',
        value: data.individualMetadata?.employerAddress2,
      },
      {
        label: 'Employer address 3',
        value: data.individualMetadata?.employerAddress3,
      },
      {
        label: 'Previous address line 1',
        value: data.individualMetadata?.previousAddressLine1,
      },
      {
        label: 'Previous address line 2',
        value: data.individualMetadata?.previousAddressLine2,
      },
      {
        label: 'Previous city',
        value: data.individualMetadata?.previousCity,
      },
      {
        label: 'Previous postcode',
        value: data.individualMetadata?.previousPostcode,
      },
      {
        label: 'Previous state',
        value: data.individualMetadata?.previousState,
      },
      {
        label: 'Previous country',
        value: data.individualMetadata?.previousCountry,
      },
    ];
  }

  if (session === 'address' && !isIndividual) {
    return [
      {
        label: 'Address Line 1',
        value: data.businessMetadata?.addressLine1,
      },
      {
        label: 'Address Line 2',
        value: data.businessMetadata?.addressLine2,
      },
      {
        label: 'Post code',
        value: data.businessMetadata?.postcode,
      },
      {
        label: 'City',
        value: data.businessMetadata?.city,
      },
      {
        label: 'State',
        value: data.businessMetadata?.state,
      },
      {
        label: 'Registered Office 1',
        value: data.businessMetadata?.registeredOffice1,
      },
      {
        label: 'Registered Office 2',
        value: data.businessMetadata?.registeredOffice2,
      },
      {
        label: 'Principal place of business',
        value: data.businessMetadata?.principalPlaceOfBusiness,
      },
      {
        label: 'Mailing address',
        value: data.businessMetadata?.mailingAddress,
      },
      {
        label: 'Previous office 1',
        value: data.businessMetadata?.previousOffice1,
      },
      {
        label: 'Previous office 2',
        value: data.businessMetadata?.previousOffice2,
      },
      {
        label: 'Previous office 3',
        value: data.businessMetadata?.previousOffice3,
      },
    ];
  }

  if (!isIndividual && session === 'personal') {
    return [
      {
        label: 'Phone number',
        value: data.userClientsMetadataDto?.phoneNumber,
      },
      {
        label: 'Who they are',
        value: data.userClientsMetadataDto?.whoTheyAre,
      },
    ];
  }

  return [];
};
