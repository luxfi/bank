import { Icon } from '@cdaxfx/ui';

import {
  ModalContainerLabels,
  ModalLabel,
  ModalLabelContainer,
  ModalValue,
} from '../details/styles';

interface IProps {
  label: string;
  value: string;
}

export const ModalLabelValue: React.FC<IProps> = ({ label, value }) => {
  return (
    <ModalContainerLabels>
      <ModalLabel>{label}</ModalLabel>
      <ModalLabelContainer>
        <Icon variant="copy" size="sm" />
        <ModalValue>{value}</ModalValue>
      </ModalLabelContainer>
    </ModalContainerLabels>
  );
};
