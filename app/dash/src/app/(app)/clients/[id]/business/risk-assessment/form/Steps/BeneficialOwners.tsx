import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import Input from '@/components/Input';
import { ModalUpload } from '@/components/ModalUpload';
import { FileContainer } from '@/components/ModalUpload/styles';
import { RadioGroup } from '@/components/RadioGroup';

import {
  EStepRiskAssessment,
  NUMBERS_OWNERS,
  YES_NO,
  useContextBusinessRiskAssessment,
} from '@/context/businessRiskAssessment';
import { useNotification } from '@/context/Notification';

import { useDocuments } from '@/store/useDocuments';
import { Button, Column, Icon, Row, Text, useTheme } from '@luxbank/ui';

import { beneficialOwnersOptions, yesNoOptions } from '../../types';

export function BeneficialOwners() {
  const router = useRouter();
  const { theme } = useTheme();
  const { uploadClientDocuments } = useDocuments();
  const { onShowNotification } = useNotification();

  const [modalUploadIsVisible, setModalUploadIsVisible] = useState(false);
  const [fileSelected, setFileSelected] = useState<File>();

  const {
    onChangeData,
    resetConversion,
    beneficialOwnersAnyAdverseInformation,
    beneficialOwnersAnyAdverseInformationDetails,
    beneficialOwnersAreAnyOfTheBeneficialOwners,
    beneficialOwnersNumberOfBeneficialOwners,
  } = useContextBusinessRiskAssessment();

  const disableNext = useMemo((): boolean => {
    return (
      !beneficialOwnersAnyAdverseInformation ||
      !beneficialOwnersNumberOfBeneficialOwners ||
      !beneficialOwnersAreAnyOfTheBeneficialOwners ||
      (beneficialOwnersAnyAdverseInformation === 'Yes' &&
        !beneficialOwnersAnyAdverseInformationDetails)
    );
  }, [
    beneficialOwnersAnyAdverseInformation,
    beneficialOwnersAnyAdverseInformationDetails,
    beneficialOwnersAreAnyOfTheBeneficialOwners,
    beneficialOwnersNumberOfBeneficialOwners,
  ]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    await uploadClientDocuments(formData)
      .then(async (response) => {
        setFileSelected(file);
        onChangeData('raAttachDocumentUuid', response.uuid);
        onChangeData('raAttachDocument', {
          uuid: response.uuid,
          creator: (response.creator as any)?.uuid ?? '',
          originalFilename: response.originalFilename,
          ownCloudPath: response.ownCloudPath,
          updatedAt: response.updatedAt as any,
          createdAt: response.createdAt as any,
          deletedAt: null,
        });
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: err.message,
          description: 'Error uploading document',
        });
      });
  };

  return (
    <>
      <Column style={{ width: 808, gap: 16 }}>
        <RadioGroup
          label="Number of beneficial Owners"
          options={beneficialOwnersOptions}
          value={beneficialOwnersNumberOfBeneficialOwners}
          onChangeData={(v) =>
            onChangeData(
              'beneficialOwnersNumberOfBeneficialOwners',
              v as NUMBERS_OWNERS
            )
          }
        />

        <RadioGroup
          label="Are any of the beneficial owners or directors of the company a Politically Exposed Person (PEP) or family member/close associate of a PEP?"
          options={yesNoOptions}
          value={beneficialOwnersAreAnyOfTheBeneficialOwners}
          onChangeData={(v) =>
            onChangeData(
              'beneficialOwnersAreAnyOfTheBeneficialOwners',
              v as YES_NO
            )
          }
        />

        <RadioGroup
          label="Any Adverse Information from Compliance screening check or other sources on beneficial owners or Directors? e.g criminal activity/disqualified director."
          options={yesNoOptions}
          value={beneficialOwnersAnyAdverseInformation}
          onChangeData={(v) =>
            onChangeData('beneficialOwnersAnyAdverseInformation', v as YES_NO)
          }
        />

        <Input
          disabled={
            !beneficialOwnersAnyAdverseInformation ||
            beneficialOwnersAnyAdverseInformation === 'No'
          }
          label="If yes, full rationale of the factors considered and the outcome must be documented clearly identifying who has compiled the rationale and date."
          value={beneficialOwnersAnyAdverseInformationDetails}
          onChange={(v) =>
            onChangeData('beneficialOwnersAnyAdverseInformationDetails', v)
          }
        />

        <Text
          style={{ fontSize: 12 }}
          variant="body_md_regular"
        >{`ANY PEP should be brought to the attention of the Compliance Department and details of the PEP recorded in the PEPs Register which is maintained by the Compliance Department. Compliance Department will determine whether CDD is sufficient or if enhanced due diligence on the individual concerned is needed.`}</Text>

        <Text
          style={{ fontSize: 12 }}
          variant="body_md_regular"
        >{`For definition of persons who are regarded as PEP’s refer to AML/CFT Manual.`}</Text>

        <Text
          style={{ fontSize: 12 }}
          variant="body_md_regular"
          color={theme.textColor.interactive.default.value}
        >{`Copy of compliance screening check results to be retained with this risk assessment.`}</Text>

        {fileSelected ? (
          <FileContainer>
            <Text variant="caption_regular">{fileSelected?.name}</Text>
            <Icon
              onClick={() => setFileSelected(undefined)}
              style={{ cursor: 'pointer' }}
              variant="cross-circle"
              size="sm"
            />
          </FileContainer>
        ) : (
          <Button
            roundness="rounded"
            text="Upload"
            leftIcon="upload"
            onClick={() => setModalUploadIsVisible(true)}
          />
        )}

        <Row
          style={{ marginTop: 48 }}
          align="center"
          justify="center"
          width="100%"
          gap="lg"
        >
          <Button
            onClick={() => {
              resetConversion();
              router.back();
            }}
            text="Cancel"
            roundness="rounded"
            variant="secondary"
          />
          <Button
            disabled={disableNext}
            onClick={() =>
              onChangeData('currentStep', EStepRiskAssessment.SOURCE_OF_FUNDS)
            }
            text="Next"
            roundness="rounded"
          />
        </Row>
      </Column>

      <ModalUpload
        isVisible={modalUploadIsVisible}
        onClose={() => setModalUploadIsVisible(false)}
        title={''}
        description="All files are encrypted, ensuring greater security in data transmission"
        onConfirm={(file) => handleUpload(file)}
      />
    </>
  );
}
