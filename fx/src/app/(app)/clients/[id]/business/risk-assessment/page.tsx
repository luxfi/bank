'use client';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { IDocument } from '@/store/useClient/types';
import { useDocuments } from '@/store/useDocuments';
import { Column, Text, useTheme } from '@cdaxfx/ui';
import dayjs from 'dayjs';

import { HeaderClientsDetails } from '../../components/Header';

export default function RiskAssessment() {
  const { clientSelected } = useClients();
  const { theme } = useTheme();

  const { downloadClientDocument } = useDocuments();

  const company = clientSelected?.riskAssessment;

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
        <Text variant="headline_semibold">{`Business Risk Assessment`}</Text>

        <Column>
          <Text
            color={theme.textColor.layout.secondary.value}
            variant="body_md_semibold"
          >{`This needs to remain part of client record to demonstrate what has been considered and how we have arrived at our client risk rating.`}</Text>

          <Text variant="body_md_semibold">{`To ensure that the risk rating is assessed accurately ALL sections and questions on this form must be completed`}</Text>
        </Column>
      </Column>

      <HeaderClientsDetails />

      {company && (
        <Column style={{ paddingInline: 16 }}>
          <Text variant="body_md_semibold">{`Residence and nationality of beneficial owners`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`Refer to list of high risk and sanctioned countries`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Residence of beneficial owners? "
              value={company.residenceNationalityResidenceOfBeneficial ?? ''}
            />
            <LabelAndValue
              label="What is the nationality of the beneficial owners?"
              value={company.ownershipInfo ?? ''}
            />
            <LabelAndValue
              label="What is the risk rating of the jurisdiction according to the Country Risk list ?"
              value={company.rating ?? ''}
            />
            <LabelAndValue
              label="Does this apply in this case?"
              value={company.apply}
            />
          </Column>

          <Text variant="body_md_semibold">{`Principal known to CDAX`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Is the Company known to CDAX?"
              value={company.known ?? ''}
            />
            <LabelAndValue
              label="If yes, how long have we known them"
              value={company.yearsKnown ?? ''}
            />
            <LabelAndValue
              label="Have the clients ever been met face to face?"
              value={company.metFace ? 'No' : ''}
            />
            <LabelAndValue
              label=" If no to the above who has met the client face to face?"
              value={company.metFace !== 'Yes' ? company.metFace : ''}
            />
          </Column>

          <Text variant="body_md_semibold">{`Beneficial owners`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Number of benefical Owners"
              value={company.numberOfBeneficialOwners ?? ''}
            />
            <LabelAndValue
              label="Are any of the beneficial owners or directors of the company a Politically Exposed Person (PEP) or family member/close associate of a PEP?"
              value={company.pep ?? ''}
            />
            <LabelAndValue
              label="Any Adverse Information from Compliance screening check or other sources on beneficial owners or Directors? e.g. criminal activity/disqualified director."
              value={company.adverseInformation ?? ''}
            />

            <Column>
              <Text
                variant="caption_regular"
                color={theme.textColor.layout.secondary.value}
              >
                Document
              </Text>
              {company?.raAttachDocument ? (
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (!company?.raAttachDocument) return;
                    handleDownloadDoc(company?.raAttachDocument as IDocument);
                  }}
                >
                  <Text
                    variant="body_md_semibold"
                    style={{ textDecoration: 'underline' }}
                  >
                    {company?.raAttachDocument?.originalFilename ?? '--'}
                  </Text>
                </div>
              ) : (
                '-'
              )}
            </Column>
          </Column>

          <Text variant="body_md_semibold">{`Source of funds/source of wealth (initial and on-going)`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`We must have adequate knowledge and understanding of how the client has acquired his wealth and the source of funds.`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Are funds/assets in or derived from an AML Equivalent jurisdiction?"
              value={company.aml ?? ''}
            />
            <LabelAndValue
              label="Do they originate from a sanctioned jurisdiction?"
              value={company.sanctionedJurisdiction ?? ''}
            />
            <LabelAndValue
              label="Do they originate from a high risk jurisdiction?"
              value={company.automaticallyHigh ?? ''}
            />
            <LabelAndValue
              label="Are funds/assets coming from a 3rd party?"
              value={company.thirdParty ?? ''}
            />
            <LabelAndValue
              label="If yes is the rationale fully understood, provide detail below"
              value={company.understood ?? ''}
            />
            <LabelAndValue
              label="Where the client has a material connection to a country covered by a statement from an international body  (list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs) then MUST rate the relationship as High Risk. Does this apply in this case?"
              value={company.materialConnection ?? ''}
            />
          </Column>

          <Text variant="body_md_semibold">{`Jurisdiction of client entity`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`See list of high risk and sanctioned countries`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Within the Corporate structure/ownership is there any country of incorporation subject to Sanctions?"
              value={company.sanctionedCorporate ?? ''}
            />
            <LabelAndValue
              label="Within the Corporate structure/ownership is there any country of incorporation that is High Risk?"
              value={company.highRiskCorporate ?? ''}
            />
            <LabelAndValue
              label="What is the highest risk rating of the jurisdictions involved?"
              value={company.highestRisk ?? ''}
            />
            <LabelAndValue
              label="Is the entity a public listed company or wholly owned subsidiary?"
              value={company.publicOrWholly ?? ''}
            />
            <LabelAndValue
              label="Are there any bearer shares issued?"
              value={company.bearer ?? ''}
            />
            {/* <LabelAndValue
              label="If yes must be imobilizei and undertaking obtained"
              value=""
            /> */}
            <LabelAndValue
              label="Is the Company ownership/Directors information publicly available?"
              value={company.jurisdictionIsCompanyOwnershipDirectors}
            />
            <LabelAndValue
              label="Where the client has a material connection to a country covered by a statement from an international body (list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs) then MUST rate the relationship as High Risk and no downgrade can be applied.*Does this apply in this case?"
              value={company.clientEntityApply ?? ''}
            />
          </Column>

          <Text variant="body_md_semibold">{`Principal areas of operation`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`Consider where the business principally conducts business and cross border operations`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Is the country subject to any sanctions?"
              value={company.principalAreaSanction ?? ''}
            />
            <LabelAndValue
              label="What is the risk rating of the jurisdiction?"
              value={company.principalAreaRisk ?? ''}
            />
            <LabelAndValue
              label="Where the client has a material connection to a country covered by a statement from an international body (list A or B of High Risk jurisdiction lists issued by IOM Gov Dept of Home Affairs) then MUST rate the relationship as High Risk and no downgrade can be applied.*Does this apply in this case?"
              value={company.principalAreaApply ?? ''}
            />
          </Column>

          <Text variant="body_md_semibold">{`Business purpose`}</Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >{`Consider the following factors`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="What is the business activity /purpose of the company ?"
              value={company?.businessPurpose ?? ''}
            />
            <LabelAndValue
              label="Is the clients activity regulated?"
              value={company?.activityRegulated ?? ''}
            />
            <LabelAndValue
              label="If Yes, who is it regulated by?"
              value={company.businessPurposeIfYesWhoItRegulatedBy}
            />
          </Column>

          <Text variant="body_md_semibold">{`Values and volumes`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Value of entity?"
              value={company.valueOfEntity}
            />
            <LabelAndValue
              label={
                'Expected volume of transactions [ Per Annum ] Numbers quoted to be considered in light of practical experience?'
              }
              value={company.volume ?? ''}
            />
            <LabelAndValue
              label="Expected value of annual account turnover?"
              value={company.transactions ?? ''}
            />
          </Column>

          <Text variant="body_md_semibold">{`Risk Rating Assessment`}</Text>

          <Column padding="sm" gap="sm" style={styleContainer}>
            <LabelAndValue
              label="Determination of Risk Rating."
              value={company.riskRating ?? ''}
            />
            <LabelAndValue
              label={'Notes re rationale to justify any changes to grading:'}
              value={company.riskRatingAssessmentNotesReRationaleToJustify}
            />
            <LabelAndValue
              label="Date"
              value={dayjs(company.completionDate).format('YYYY-MM-DD')}
            />
            <LabelAndValue
              label="Any further notes regarding risk assessement"
              value={company.completeAnyNotesRegardingRiskAssessment}
            />
          </Column>
        </Column>
      )}
    </>
  );
}
