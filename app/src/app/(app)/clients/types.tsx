import { Badge } from '@/components/Badge';
import { IColumnProps } from '@/components/Table';

import { getRiskAssesmentStatusBadgeValues } from '@/utils/valueMaps';

import { CountriesList } from '@/lib/constants';

import { Text, useTheme } from '@cdaxfx/ui';
import dayjs from 'dayjs';
import * as Yup from 'yup';

export interface IFiltersType {
  client?: string;
  account?: string;
  type?: string;
}

export interface IActionsGrid {
  modalIsIsArchiveVisible: boolean;
  uuidSelected: string;
  isLoading: boolean;
}

export interface IClientsFilters {
  entityType: '' | 'individual' | 'business';
  country: string;
  riskRating: string;
  PEP: string;
  gateway?: string;
}

export const PASSWORD_REQUIREMENTS_TEXT =
  'Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character';

export const clientTypeOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Individual',
    value: 'individual',
  },
  {
    label: 'Business',
    value: 'business',
  },
];

const countriesArray = Array.from(CountriesList.entries()).map(
  ([key, value]) => ({
    label: value,
    value: key,
  })
);
export const countryOptions = [
  {
    label: 'All',
    value: '',
  },
  ...countriesArray,
];

export const riskRatingOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Low',
    value: 'low',
  },
  {
    label: 'Standard',
    value: 'standard',
  },
  {
    label: 'High',
    value: 'high',
  },
];

export const pepOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Yes',
    value: 'yes',
  },
  {
    label: 'No',
    value: 'no',
  },
];

export const columnsExpandable: IColumnProps<any>[] = [
  {
    dataIndex: 'client',
    width: 330,
    className: 'column-min-width-01',
    render: () => {
      return <div />;
    },
  },
  {
    dataIndex: 'account',
    width: 200,
    className: 'column-min-width-03',
    render: (_, record) => {
      const businessName = record?.account?.businessMetadata?.companyName;
      const individualName = record?.account?.individualMetadata
        ? `${record?.account?.individualMetadata?.firstname} ${record?.account?.individualMetadata?.lastname}`
        : '--';
      return businessName || individualName || '--';
    },
  },
  {
    dataIndex: 'entityType',
    width: 160,
    className: 'column-min-width-02',
    render: (_, record) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { theme } = useTheme();

      const type =
        (record?.account?.entityType as string).charAt(0).toLocaleUpperCase() +
        (record?.account?.entityType as string).slice(1);

      return (
        <div>
          <span
            style={{
              padding: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: theme.borderColor.layout['border-subtle'].value,
            }}
          >
            {type}
          </span>
        </div>
      );
    },
  },
  {
    dataIndex: 'riskRating',
    width: 160,
    className: 'column-min-width-02',

    render: (_, record) => {
      const rating =
        record?.account?.riskAssessments?.[0]?.riskRating?.toLowerCase();

      if (!rating)
        return (
          <Badge
            label={getRiskAssesmentStatusBadgeValues['pending']?.label}
            variant={getRiskAssesmentStatusBadgeValues['pending']?.variant}
            type="dot"
          />
        );

      return (
        <Badge
          label={getRiskAssesmentStatusBadgeValues[rating]?.label}
          variant={getRiskAssesmentStatusBadgeValues[rating]?.variant}
          type="dot"
        />
      );
    },
  },
  {
    dataIndex: 'lastRa',
    width: 160,
    className: 'column-min-width-02',
    render: (_, record) => {
      const completionDate =
        record?.account?.riskAssessments?.[0]?.completionDate;

      return (
        <Text style={{ fontSize: 14 }} variant="callout_regular">
          {completionDate ? dayjs(completionDate).format('YYYY-MM-DD') : '-'}
        </Text>
      );
    },
  },
  {
    dataIndex: 'nextRa',
    width: 160,
    className: 'column-min-width-02',
    render: (_, record) => {
      const nextRiskAssessment =
        record?.account?.riskAssessments?.[0]?.nextRiskAssessment;

      return (
        <Text style={{ fontSize: 14 }} variant="callout_regular">
          {nextRiskAssessment
            ? dayjs(nextRiskAssessment).format('YYYY-MM-DD')
            : '-'}
        </Text>
      );
    },
  },
  {
    dataIndex: 'pep',
    width: 160,
    className: 'column-min-width-04',
    render: (_, record) => {
      const pep: Record<string, React.ReactNode> = {
        No: <Badge type="tag" label="No" variant="neutral" />,
        Yes: <Badge type="tag" label="Yes" variant="negative" />,
      };

      return pep[record?.account?.riskAssessments?.[0]?.pep];
    },
  },
  {
    dataIndex: 'country',
    width: 120,
    className: 'column-min-width-04',
    render: (_, record) => {
      const business = record?.account?.businessMetadata;
      const individual = record?.account?.individualMetadata;
      return (
        <Text style={{ fontSize: 14 }} variant="callout_regular">
          {individual?.country || business?.countryOfRegistration || '--'}
        </Text>
      );
    },
  },
  {
    title: 'Actions',
    width: 220,
  },
];

export const columns: IColumnProps<any>[] = [
  {
    title: 'CLIENT',
    dataIndex: 'username',
    width: 330,
    render: (value) => {
      return <Text variant="body_md_semibold">{value}</Text>;
    },
  },
  {
    title: 'ACCOUNT',
    width: 200,
    render: () => {
      return <div />;
    },
  },
  {
    title: 'TYPE',
    width: 160,
    render: () => {
      return <div />;
    },
  },
  {
    title: 'RISK RATING',
    width: 160,
    render: () => {
      return <div />;
    },
  },
  {
    title: 'LAST RA',
    width: 160,
    render: () => {
      return <div />;
    },
  },
  {
    title: 'NEXT RA',
    width: 160,
    render: () => {
      return <div />;
    },
  },
  {
    title: 'PEP',
    width: 160,
    render: () => {
      return <div />;
    },
  },
  {
    title: 'COUNTRY',
    width: 160,
    render: () => {
      return <div />;
    },
  },
  {
    title: 'Actions',
    width: 220,
  },
];

export const whoTheyAreOptions: Map<string, string> = new Map(
  Object.entries({
    'Board director / Business owner': 'Board director / Business owner',
    'Chief executive officer (CEO)': 'Chief executive officer (CEO)',
    'Chief operating officer (COO)': 'Chief operating officer (COO)',
    'Chief Financial Officer (CFO)': 'Chief Financial Officer (CFO)',
    'Chief Technology Officer (CTO)': 'Chief Technology Officer (CTO)',
    'Chief Marketing Officer (CMO)': 'Chief Marketing Officer (CMO)',
    'Chief Human Resources Officer (CHRO)':
      'Chief Human Resources Officer (CHRO)',
    'Vice President (VP)': 'Vice President (VP)',
    other: 'Other',
  })
);

export const entityTypes: Map<string, string> = new Map(
  Object.entries({
    business: 'Business',
    individual: 'Individual',
  })
);

export const newClientSchema: Yup.Schema = Yup.object({
  accountType: Yup.string().required().oneOf(Array.from(entityTypes.keys())),
  firstName: Yup.string().required('Please enter the First name'),
  lastName: Yup.string().required('Please enter the Last name'),
  companyName: Yup.string().when(
    'accountType',
    ([accountType], newClientSchema) => {
      return accountType === 'business'
        ? newClientSchema.required('Please enter the Company name')
        : newClientSchema.optional();
    }
  ),
  email: Yup.string().required('Please enter the Email').email(),
  country: Yup.string().oneOf(Array.from(CountriesList.keys())),
  phone: Yup.string().required('Please enter the Phone number'),
  businessRole: Yup.string().oneOf(Array.from(whoTheyAreOptions.keys())),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
      PASSWORD_REQUIREMENTS_TEXT
    )
    .required('Please enter the Password'),
  confirmPassword: Yup.string().test(
    'passwords-match',
    'Passwords must match',
    function (value) {
      return this.parent.password === value;
    }
  ),
});
