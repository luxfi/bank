import Lottie from 'react-lottie';

import loadingTable from '@/animations/loadingTable.json';
import { Column, Text } from '@cdaxfx/ui';

const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingTable,
};

export const Loading: React.FC = () => {
  return (
    <Column
      gap="xxxs"
      width="100%"
      align="center"
      style={{ marginTop: '200px' }}
    >
      <Lottie options={animationOptions} width={110} />
      <Text variant="body_md_regular">Loading...</Text>
    </Column>
  );
};
