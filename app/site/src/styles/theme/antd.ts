import type { ThemeConfig } from "antd";

const antdTheme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#FAFAFA",
    colorBgBase: "#09090B",
    colorTextBase: "#FAFAFA",
    colorBorder: "#27272A",
    fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Button: {
      colorPrimary: "#FAFAFA",
      colorPrimaryHover: "#E4E4E7",
      algorithm: true,
    },
    Input: {
      colorBgContainer: "#18181B",
      colorBorder: "#27272A",
    },
    Modal: {
      contentBg: "#18181B",
      headerBg: "#18181B",
      footerBg: "#18181B",
    },
  },
};

export default antdTheme;
