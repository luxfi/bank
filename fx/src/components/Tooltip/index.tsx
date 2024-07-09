import { useTheme } from '@cdaxfx/ui';
import { Tooltip as AntTooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';

interface ITooltipProps extends React.PropsWithChildren {
  title?: string;
  placement?: TooltipPlacement;
  width?: string;
}

export function Tooltip({
  title,
  placement,
  width = 'auto',
  children,
}: ITooltipProps) {
  const { theme } = useTheme();
  return (
    <AntTooltip
      placement={placement}
      color={theme.backgroundColor.layout['container-L0'].value}
      overlayInnerStyle={{
        color: theme.textColor.layout.primary.value,
        fontSize: '14px',
        width: width,
        boxShadow: 'none',
        borderRadius: '8px',
      }}
      title={title}
    >
      {children}
    </AntTooltip>
  );
}
