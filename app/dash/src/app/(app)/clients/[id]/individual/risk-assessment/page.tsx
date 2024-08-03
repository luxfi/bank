'use client';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { IDocument } from '@/store/useClient/types';
import { useDocuments } from '@/store/useDocuments';
import { Column, Text, useTheme } from '@luxbank/ui';
import dayjs from 'dayjs';

import { HeaderClientsDetails } from '../../components/Header';

export default function RiskAssessment() {
  const { theme } = useTheme();
  const { clientSelected } = useClients();

  const { downloadClientDocument } = useDocuments();

  const individual = clientSelected?.riskAssessment;

  const handleDownloadDoc = async (doc: IDocument) => {
    await downloadClientDocument(doc.uuid).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.originalFilename);
      document.body.appendChild(link);
      link.click();
    });
  };

  const styleContainer = {
    borderRadius: 8,
    backgroundColor: theme.backgroundColor.layout['container-L2'].value,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  };

  return (
    <>
      <Column padding="sm" gap="sm">
        <Text variant="headline_semibold">{`Individual Client Risk Assessment`}</Text>

        <Column>
          <Text
            color={theme.textColor.layout.secondary.value}
            variant="body_md_semibold"
          >{`This needs to remain part of client record to demonstrate what has been considered and how we have arrived at our client risk rating.`}</Text>

          <Text variant="body_md_semibold">{`To ensure that the risk rating is assessed accurately ALL sections and questions on this form must be completed`}</Text>
        </Column>
      </Column>

      <HeaderClientsDetails />

      {individual && (
        <Column style={{ paddingInline: 16 }}>
          <Text variant="body_md_semibold">{`Jurisdiction of client residence/nationality`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`Refer to List of High Risk and Sanctioned Countries`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Client nationality"
              value={individual.ownershipInfo ?? ''}
            />
            <LabelAndValue
              label="Residence of client"
              value={individual.residenceNationalityResidenceOfBeneficial ?? ''}
            />
            <LabelAndValue
              label="Is the country subject to any sanctions?"
              value={individual.sanction ?? ''}
            />
            <LabelAndValue
              label="What is the risk rating of the jurisdiction according to the Country Risk list* ?"
              value={individual.rating}
            />
            <LabelAndValue
              label="Does this apply in this case?"
              value={individual.apply}
            />
          </Column>

          <Text variant="body_md_semibold">{`Higher risk client`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`(e.g. PEP, adverse media or press profile)`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Is the client a Politically Exposed Person (PEP) or family member/close associate of a PEP."
              value={individual.pep ?? ''}
            />
            <LabelAndValue
              label="Any Adverse Information from Compliance screening check or other sources. (e.g. criminal activity/disqualified director)"
              value={individual?.adverseInformation ? 'Yes' : 'No'}
            />
            <LabelAndValue
              label="If any adverse information please provide explanation below"
              value={individual?.adverseInformation ?? ''}
            />
            <Column>
              <Text
                variant="caption_regular"
                color={theme.textColor.layout.secondary.value}
              >
                Document
              </Text>
              {individual?.raAttachDocument ? (
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (!individual?.raAttachDocument) return;
                    handleDownloadDoc(
                      individual?.raAttachDocument as IDocument
                    );
                  }}
                >
                  <Text
                    variant="body_md_semibold"
                    style={{ textDecoration: 'underline' }}
                  >
                    {individual?.raAttachDocument?.originalFilename ?? '--'}
                  </Text>
                </div>
              ) : (
                '-'
              )}
            </Column>
          </Column>

          <Text variant="body_md_semibold">{`Source of funds/source of wealth (Initial and on-going)`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`We must have adequate knowledge and understanding of how the client has acquired his wealth and the source of funds.`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Are funds/assets in or derived from an AML Equivalent jurisdiction?"
              value={individual.aml ?? ''}
            />
            <LabelAndValue
              label="Do they originate from a sanctioned jurisdiction?"
              value={individual.sanctionedJurisdiction ?? ''}
            />
            <LabelAndValue
              label="Do they originate from a high risk jurisdiction?"
              value={individual.highestRisk ?? ''}
            />
            <LabelAndValue
              label="Are funds/assets coming from a 3rd party?"
              value={individual?.understood ? 'Yes' : 'No'}
            />
            <LabelAndValue
              label="If yes is the rationale fully understood"
              value={individual?.understood ?? ''}
            />

            <LabelAndValue
              label="Are funds/assets coming from a 3rd party?"
              value={
                individual?.sourceOfFoundsAreFundsAssetsComingFromA3d2
                  ? 'Yes'
                  : 'No'
              }
            />
            <LabelAndValue
              label="If yes is the rationale fully understood"
              value={
                individual?.sourceOfFoundsAreFundsAssetsComingFromA3d2Details ??
                ''
              }
            />

            <LabelAndValue
              label="For example, Arms and Military, Mining, Gold or Precious metal trading, Gambling, Time share, Pharmaceutical, cross border trade. (See Client Risk Assessment Guidance)"
              value={individual?.activityRegulated ? 'Yes' : 'No'}
            />
            <LabelAndValue
              label="If Yes please provide explanation below"
              value={individual?.activityRegulated ?? ''}
            />
          </Column>

          <Text variant="body_md_semibold">{`Other factors to consider`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`when arriving at final rating.`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Is the applicant known to CDAX? "
              value={individual.known ?? ''}
            />
            <LabelAndValue
              label="Have the clients ever been met face to face?"
              value={individual.metFace === 'Yes' ? 'Yes' : 'No'}
            />
            <LabelAndValue
              label="If no to the above who has met the client face to face?"
              value={individual.metFace != 'Yes' ? individual.metFace : ''}
            />
          </Column>

          <Text variant="body_md_semibold">{`Determination of Risk Rating`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`Considering all the above information what is the risk rating of the client.`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Risk Rating"
              value={individual.riskRating ?? ''}
            />
            <LabelAndValue
              label="Assessment Completed by (name)"
              value={individual.riskRatingAssessmentCompleted}
            />
            <LabelAndValue
              label="Where the rating is High Risk, involves a PEP or is being downgraded the application must also be approved by a Director.Where applicable, Name of Director approving"
              value={individual.classifyAsPep ?? ''}
            />
            <LabelAndValue
              label="Date"
              value={
                dayjs(individual.completionDate).format('YYYY-MM-DD') ?? ''
              }
            />
            <LabelAndValue
              label="Next review due"
              value={
                dayjs(individual.nextRiskAssessment).format('YYYY-MM-DD') ?? ''
              }
            />
          </Column>

          <Text variant="body_md_semibold">{`Complete below`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`If higher risk client consider the enhanced CDD requirements , what on-going monitoring should be carried out, and any additional data required`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Detail below"
              value={individual.completeDetail}
            />
            <LabelAndValue
              label="Notes re rationale to justify any changes to grading"
              value={individual.completeNotesRationaleToJustify}
            />
            <LabelAndValue
              label="Assessment Completed by (name)"
              value={individual.completeAssessmentCompleteByName}
            />
            <LabelAndValue
              label="Where the rating is High Risk, involves a PEP or is being downgraded the application must also be approved by a Director.Where applicable, Name of Director approving"
              value={individual.director}
            />
            <LabelAndValue
              label="Date"
              value={dayjs(individual.completionDate).format('YYYY-MM-DD')}
            />
            <LabelAndValue
              label="Any further notes regarding risk assessments"
              value={individual.completeAnyNotesRegardingRiskAssessment}
            />
          </Column>
        </Column>
      )}
    </>
  );
}
