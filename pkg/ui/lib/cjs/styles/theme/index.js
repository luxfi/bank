"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const light = {
    typography: {
        body: {
            sm_regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_mono_regular: {
                value: {
                    fontFamily: 'Roboto Mono',
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_mono_semibold: {
                value: {
                    fontFamily: 'Roboto Mono',
                    fontWeight: 500,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_mono_regular: {
                value: {
                    fontFamily: 'Roboto Mono',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_mono_semibold: {
                value: {
                    fontFamily: 'Roboto Mono',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        callout: {
            regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '24px',
                    fontSize: '18px',
                    letterSpacing: '0.09px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '24px',
                    fontSize: '18px',
                    letterSpacing: '0.09px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '18px',
                    letterSpacing: '0.09px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        headline: {
            regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '28px',
                    fontSize: '20px',
                    letterSpacing: '-0.26px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '28px',
                    fontSize: '20px',
                    letterSpacing: '-0.26px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '28px',
                    fontSize: '20px',
                    letterSpacing: '-0.26px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        heading: {
            title_1: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '56px',
                    fontSize: '40px',
                    letterSpacing: '-0.52px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            title_2: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '40px',
                    fontSize: '32px',
                    letterSpacing: '-0.416px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            title_3: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '32px',
                    fontSize: '24px',
                    letterSpacing: '-0.312px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        caption: {
            regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '18px',
                    fontSize: '12px',
                    letterSpacing: '0.18px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '18px',
                    fontSize: '12px',
                    letterSpacing: '0.18px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        interactive: {
            md_link: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'underline',
                },
                type: 'typography',
            },
            sm_link: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'underline',
                },
                type: 'typography',
            },
            sm_regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
    },
    fontFamily: {
        primary: {
            value: 'Roboto',
            type: 'fontFamilies',
        },
        mono: {
            value: 'Roboto Mono',
            type: 'fontFamilies',
        },
    },
    lineHeight: {
        caption: {
            value: '18px',
            type: 'lineHeights',
        },
        body_sm: {
            value: '20px',
            type: 'lineHeights',
        },
        body_md: {
            value: '24px',
            type: 'lineHeights',
        },
        callout: {
            value: '24px',
            type: 'lineHeights',
        },
        headline: {
            value: '28px',
            type: 'lineHeights',
        },
        title_sm: {
            value: '32px',
            type: 'lineHeights',
        },
        title_md: {
            value: '40px',
            type: 'lineHeights',
        },
        title_lg: {
            value: '56px',
            type: 'lineHeights',
        },
    },
    fontWeight: {
        regular: {
            value: 400,
            type: 'fontWeights',
        },
        medium: {
            value: 500,
            type: 'fontWeights',
        },
        semibold: {
            value: 500,
            type: 'fontWeights',
        },
        bold: {
            value: 700,
            type: 'fontWeights',
        },
    },
    fontSize: {
        caption: {
            value: '12px',
            type: 'fontSizes',
        },
        body_sm: {
            value: '14px',
            type: 'fontSizes',
        },
        body_md: {
            value: '16px',
            type: 'fontSizes',
        },
        callout: {
            value: '18px',
            type: 'fontSizes',
        },
        headline: {
            value: '20px',
            type: 'fontSizes',
        },
        title_sm: {
            value: '24px',
            type: 'fontSizes',
        },
        title_md: {
            value: '32px',
            type: 'fontSizes',
        },
        title_lg: {
            value: '40px',
            type: 'fontSizes',
        },
    },
    paragraphSpacing: {
        default: {
            value: '12px',
            type: 'paragraphSpacing',
        },
    },
    textCase: {
        none: {
            value: 'none',
            type: 'textCase',
        },
        allCaps: {
            value: 'uppercase',
            type: 'textCase',
        },
    },
    textDecoration: {
        none: {
            value: 'none',
            type: 'textDecoration',
        },
        underline: {
            value: 'underline',
            type: 'textDecoration',
        },
        line_through: {
            value: 'line-through',
            type: 'textDecoration',
        },
    },
    letterSpacing: {
        body: {
            value: 0.005,
            type: 'letterSpacing',
        },
        titles: {
            value: -0.013,
            type: 'letterSpacing',
        },
        caption: {
            value: 0.015,
            type: 'letterSpacing',
        },
    },
    backgroundColor: {
        layout: {
            'container-L0': {
                value: '#f5f8ff',
                type: 'color',
            },
            'container-L1': {
                value: '#ffffff',
                type: 'color',
            },
            'container-L2': {
                value: '#0f244d0a',
                type: 'color',
                description: 'Apply only for surfaces above container-L1',
            },
            'container-emphasized': {
                value: '#d7e3fa',
                type: 'color',
            },
            'container-emphasized-primary': {
                value: '#2b64d6',
                type: 'color',
            },
            'container-inverse': {
                value: '#2b64d6',
                type: 'color',
            },
        },
        interactive: {
            'primary-default': {
                value: '#2b64d6',
                type: 'color',
            },
            'primary-hover': {
                value: '#4074db',
                type: 'color',
            },
            'primary-press': {
                value: '#2659bf',
                type: 'color',
            },
            'primary-disabled': {
                value: '#0f244d0a',
                type: 'color',
            },
            'secondary-default': {
                value: '#d7e3fa',
                type: 'color',
            },
            'secondary-hover': {
                value: '#f5f8ff',
                type: 'color',
            },
            'secondary-press': {
                value: '#bccff5',
                type: 'color',
            },
            'secondary-disabled': {
                value: '#0f244d0a',
                type: 'color',
            },
            'tertiary-default': {
                value: '#d7e3fa',
                type: 'color',
            },
            'tertiary-hover': {
                value: '#f5f8ff',
                type: 'color',
            },
            'tertiary-press': {
                value: '#bccff5',
                type: 'color',
            },
            'tertiary-disabled': {
                value: '#0f244d0a',
                type: 'color',
            },
            'surface-default': {
                value: '#0f244d00',
                type: 'color',
            },
            'surface-hover': {
                value: '#0f244d0a',
                type: 'color',
            },
            'surface-press': {
                value: '#0f244d14',
                type: 'color',
            },
            'surface-disabled': {
                value: '#0f244d0a',
                type: 'color',
            },
            transparent: {
                value: '#ffffff00',
                type: 'color',
            },
            'destructive-default': {
                value: '#BA452D',
                type: 'color',
            },
            'destructive-hover': {
                value: '#D44B2F',
                type: 'color',
            },
            'destructive-press': {
                value: '#A1402B',
                type: 'color',
            },
            'destructive-disabled': {
                value: '#0f244d0a',
                type: 'color',
            },
            'destructive-secondary-default': {
                value: '#FCDFD9',
                type: 'color',
            },
            'destructive-secondary-hover': {
                value: '#FFF7F5',
                type: 'color',
            },
            'destructive-secondary-press': {
                value: '#FACAC0',
                type: 'color',
            },
            'destructive-secondary-disabled': {
                value: '#0f244d0a',
                type: 'color',
            },
            'destructive-tertiary-default': {
                value: '#FCDFD9',
                type: 'color',
            },
            'destructive-tertiary-hover': {
                value: '#FFF7F5',
                type: 'color',
            },
            'destructive-tertiary-press': {
                value: '#FACAC0',
                type: 'color',
            },
            'destructive-tertiary-disabled': {
                value: '#0f244d0a',
                type: 'color',
            },
        },
        feedback: {
            negative: {
                value: '#FCDFD9',
                type: 'color',
            },
            negativeAccent: {
                value: '#D44B2F',
                type: 'color',
            },
            warning: {
                value: '#FFECD6',
                type: 'color',
            },
            warningAccent: {
                value: '#E37E0B',
                type: 'color',
            },
            positive: {
                value: '#DAF7E9',
                type: 'color',
            },
            positiveAccent: {
                value: '#3CA674',
                type: 'color',
            },
            info: {
                value: '#DEF2FC',
                type: 'color',
            },
            infoAccent: {
                value: '#4BA4D1',
                type: 'color',
            },
            neutral: {
                value: '#00000014',
                type: 'color',
            },
            neutralAccent: {
                value: '#000000a3',
                type: 'color',
            },
        },
    },
    padding: {
        zero: {
            value: '0px',
            type: 'spacing',
        },
        xxxs: {
            value: '4px',
            type: 'spacing',
        },
        xxs: {
            value: '8px',
            type: 'spacing',
        },
        xs: {
            value: '12px',
            type: 'spacing',
        },
        sm: {
            value: '16px',
            type: 'spacing',
        },
        md: {
            value: '20px',
            type: 'spacing',
        },
        lg: {
            value: '24px',
            type: 'spacing',
        },
        xl: {
            value: '32px',
            type: 'spacing',
        },
        xxl: {
            value: '40px',
            type: 'spacing',
        },
        xxxl: {
            value: '48px',
            type: 'spacing',
        },
        'inset-xs': {
            value: '4px 4px 4px 4px',
            type: 'spacing',
        },
        'inset-sm': {
            value: '8px 8px 8px 8px',
            type: 'spacing',
        },
        'inset-md': {
            value: '16px 16px 16px 16px',
            type: 'spacing',
        },
        'inset-lg': {
            value: '32px 32px 32px 32px',
            type: 'spacing',
        },
        'inset-xl': {
            value: '64px 64px 64px 64px',
            type: 'spacing',
        },
        'squish-sm': {
            value: '4px 8px',
            type: 'spacing',
        },
        'squish-md': {
            value: '8px 16px',
            type: 'spacing',
        },
        'squish-lg': {
            value: '16px 32px',
            type: 'spacing',
        },
        'stretch-sm': {
            value: '12px 8px',
            type: 'spacing',
        },
        'stretch-md': {
            value: '24px 16px',
            type: 'spacing',
        },
    },
    gap: {
        zero: {
            value: '0px',
            type: 'spacing',
        },
        xxxs: {
            value: '4px',
            type: 'spacing',
        },
        xxs: {
            value: '8px',
            type: 'spacing',
        },
        xs: {
            value: '12px',
            type: 'spacing',
        },
        sm: {
            value: '16px',
            type: 'spacing',
        },
        md: {
            value: '20px',
            type: 'spacing',
        },
        lg: {
            value: '24px',
            type: 'spacing',
        },
        xl: {
            value: '32px',
            type: 'spacing',
        },
        xxl: {
            value: '40px',
            type: 'spacing',
        },
        xxxl: {
            value: '48px',
            type: 'spacing',
        },
        'stack-xxs': {
            value: '2px',
            type: 'spacing',
        },
        'stack-xs': {
            value: '4px',
            type: 'spacing',
        },
        'stack-sm': {
            value: '8px',
            type: 'spacing',
        },
        'stack-md': {
            value: '16px',
            type: 'spacing',
        },
        'stack-lg': {
            value: '32px',
            type: 'spacing',
        },
        'stack-xl': {
            value: '64px',
            type: 'spacing',
        },
        'stack-zero': {
            value: '0px',
            type: 'spacing',
        },
        'inline-xxs': {
            value: '2px',
            type: 'spacing',
        },
        'inline-xs': {
            value: '4px',
            type: 'spacing',
        },
        'inline-sm': {
            value: '8px',
            type: 'spacing',
        },
        'inline-md': {
            value: '16px',
            type: 'spacing',
        },
        'inline-lg': {
            value: '32px',
            type: 'spacing',
        },
        'inline-xl': {
            value: '64px',
            type: 'spacing',
        },
        'inline-zero': {
            value: '0px',
            type: 'spacing',
        },
    },
    margin: {
        zero: {
            value: '0px',
            type: 'spacing',
        },
        xxxs: {
            value: '4px',
            type: 'spacing',
        },
        xxs: {
            value: '8px',
            type: 'spacing',
        },
        xs: {
            value: '12px',
            type: 'spacing',
        },
        sm: {
            value: '16px',
            type: 'spacing',
        },
        md: {
            value: '20px',
            type: 'spacing',
        },
        lg: {
            value: '24px',
            type: 'spacing',
        },
        xl: {
            value: '32px',
            type: 'spacing',
        },
        xxl: {
            value: '40px',
            type: 'spacing',
        },
        xxxl: {
            value: '48px',
            type: 'spacing',
        },
    },
    width: {
        zero: {
            value: '0px',
            type: 'sizing',
        },
        xxxs: {
            value: '4px',
            type: 'sizing',
        },
        xxs: {
            value: '8px',
            type: 'sizing',
        },
        xs: {
            value: '12px',
            type: 'sizing',
        },
        sm: {
            value: '16px',
            type: 'sizing',
        },
        md: {
            value: '24px',
            type: 'sizing',
        },
        lg: {
            value: '32px',
            type: 'sizing',
        },
        xl: {
            value: '40px',
            type: 'sizing',
        },
        xxl: {
            value: '48px',
            type: 'sizing',
        },
        xxxl: {
            value: '64px',
            type: 'sizing',
        },
        '18x': {
            value: '72px',
            type: 'sizing',
        },
        '20x': {
            value: '80px',
            type: 'sizing',
        },
        '24x': {
            value: '96px',
            type: 'sizing',
        },
        '30x': {
            value: '120px',
            type: 'sizing',
        },
        '40x': {
            value: '160px',
            type: 'sizing',
        },
        '60x': {
            value: '240px',
            type: 'sizing',
        },
        '80x': {
            value: '320px',
            type: 'sizing',
        },
    },
    height: {
        zero: {
            value: '0px',
            type: 'sizing',
        },
        xxxs: {
            value: '4px',
            type: 'sizing',
        },
        xxs: {
            value: '8px',
            type: 'sizing',
        },
        xs: {
            value: '12px',
            type: 'sizing',
        },
        sm: {
            value: '16px',
            type: 'sizing',
        },
        md: {
            value: '24px',
            type: 'sizing',
        },
        lg: {
            value: '32px',
            type: 'sizing',
        },
        xl: {
            value: '40px',
            type: 'sizing',
        },
        xxl: {
            value: '48px',
            type: 'sizing',
        },
        xxxl: {
            value: '64px',
            type: 'sizing',
        },
        '18x': {
            value: '72px',
            type: 'sizing',
        },
        '20x': {
            value: '80px',
            type: 'sizing',
        },
        '24x': {
            value: '96px',
            type: 'sizing',
        },
        '30x': {
            value: '120px',
            type: 'sizing',
        },
        '40x': {
            value: '160px',
            type: 'sizing',
        },
        '60x': {
            value: '240px',
            type: 'sizing',
        },
        '80x': {
            value: '320px',
            type: 'sizing',
        },
    },
    textColor: {
        feedback: {
            'text-negative': {
                value: '#BA452D',
                type: 'color',
            },
            'icon-negative': {
                value: '#D44B2F',
                type: 'color',
            },
            'text-warning': {
                value: '#8F591D',
                type: 'color',
            },
            'icon-warning': {
                value: '#AB671A',
                type: 'color',
            },
            'text-positive': {
                value: '#2F805A',
                type: 'color',
            },
            'icon-positive': {
                value: '#2F805A',
                type: 'color',
            },
            'text-info': {
                value: '#326985',
                type: 'color',
            },
            'icon-info': {
                value: '#3A7C9E',
                type: 'color',
            },
        },
        layout: {
            primary: {
                value: '#0b1936',
                type: 'color',
            },
            'primary-inverse': {
                value: '#ffffff',
                type: 'color',
            },
            secondary: {
                value: '#0f244da3',
                type: 'color',
            },
            'secondary-inverse': {
                value: '#ffffffa3',
                type: 'color',
            },
            emphasized: {
                value: '#2b64d6',
                type: 'color',
            },
        },
        interactive: {
            'default-inverse': {
                value: '#ffffff',
                type: 'color',
            },
            default: {
                value: '#2b64d6',
                type: 'color',
            },
            enabled: {
                value: '#0b1936',
                type: 'color',
            },
            placeholder: {
                value: '#0f244da3',
                type: 'color',
            },
            disabled: {
                value: '#0f244d29',
                type: 'color',
            },
            link: {
                value: '#2b64d6',
                type: 'color',
            },
            destructive: {
                value: '#BA452D',
                type: 'color',
            },
        },
    },
    borderColor: {
        layout: {
            'border-subtle': {
                value: '#0f244d29',
                type: 'color',
            },
            'border-strong': {
                value: '#0f244d52',
                type: 'color',
            },
            'divider-subtle': {
                value: '#0f244d14',
                type: 'color',
            },
            'divider-strong': {
                value: '#0f244d29',
                type: 'color',
            },
            'border-inverse': {
                value: '#ffffff',
                type: 'color',
            },
        },
        interactive: {
            default: {
                value: '#0f244d29',
                type: 'color',
            },
            hover: {
                value: '#0f244d52',
                type: 'color',
            },
            disabled: {
                value: '#0f244d14',
                type: 'color',
            },
            primary: {
                value: '#2b64d6',
                type: 'color',
            },
            'focus-default': {
                value: '#224fa8',
                type: 'color',
            },
            'focus-negative': {
                value: '#BA452D',
                type: 'color',
            },
            'focus-warning': {
                value: '#C77314',
                type: 'color',
            },
            'focus-positive': {
                value: '#379468',
                type: 'color',
            },
            'focus-info': {
                value: '#4491B8',
                type: 'color',
            },
        },
        feedback: {
            negative: {
                value: '#FACAC0',
                type: 'color',
            },
            warning: {
                value: '#FFDEB8',
                type: 'color',
            },
            positive: {
                value: '#C0EDD8',
                type: 'color',
            },
            info: {
                value: '#CAEAFA',
                type: 'color',
            },
        },
    },
    backdropOpacity: {
        default: {
            value: '#00000066',
            type: 'color',
        },
    },
    borderRadius: {
        'radius-xs': {
            value: '2px',
            type: 'borderRadius',
        },
        'radius-sm': {
            value: '4px',
            type: 'borderRadius',
        },
        'radius-md': {
            value: '8px',
            type: 'borderRadius',
        },
        'radius-lg': {
            value: '12px',
            type: 'borderRadius',
        },
        'radius-xl': {
            value: '16px',
            type: 'borderRadius',
        },
        'radius-xxl': {
            value: '24px',
            type: 'borderRadius',
        },
        'radius-full': {
            value: '2000px',
            type: 'borderRadius',
        },
        'radius-zero': {
            value: '0px',
            type: 'borderRadius',
        },
    },
    borderWidth: {
        'width-zero': {
            value: '0px',
            type: 'borderWidth',
        },
        'width-sm': {
            value: '1px',
            type: 'borderWidth',
        },
        'width-md': {
            value: '2px',
            type: 'borderWidth',
        },
        'width-lg': {
            value: '4px',
            type: 'borderWidth',
        },
    },
    boxShadow: {
        'level-1': {
            value: {
                x: 0,
                y: 2,
                blur: 6,
                spread: 0,
                color: '#0000001a',
                type: 'dropShadow',
            },
            type: 'boxShadow',
        },
        'level-2': {
            value: {
                x: 0,
                y: 6,
                blur: 16,
                spread: 0,
                color: '#00000026',
                type: 'dropShadow',
            },
            type: 'boxShadow',
        },
        'level-3': {
            value: {
                x: 0,
                y: 12,
                blur: 32,
                spread: 0,
                color: '#00000033',
                type: 'dropShadow',
            },
            type: 'boxShadow',
        },
        'level-4': {
            value: {
                x: 0,
                y: 24,
                blur: 48,
                spread: 0,
                color: '#00000026',
                type: 'dropShadow',
            },
            type: 'boxShadow',
        },
    },
    buttonIcon: {
        primary: {
            default: {
                container: {
                    value: {
                        verticalPadding: '12px',
                        horizontalPadding: '12px',
                        borderRadius: '8px',
                        fill: '#2b64d6',
                        spacing: '0px',
                    },
                    type: 'composition',
                },
                icon: {
                    value: {
                        fill: '#ffffff',
                    },
                    type: 'composition',
                },
            },
        },
    },
    dataViz: {
        '1': {
            value: '#68CC9D',
            type: 'color',
        },
        '2': {
            value: '#D44B2F',
            type: 'color',
        },
        '3': {
            value: '#FF961F',
            type: 'color',
        },
        '4': {
            value: '#873827',
            type: 'color',
        },
        '5': {
            value: '#BA89F5',
            type: 'color',
        },
        '6': {
            value: '#4491B8',
            type: 'color',
        },
        '7': {
            value: '#29556B',
            type: 'color',
        },
        '8': {
            value: '#2F805A',
            type: 'color',
        },
        '9': {
            value: '#4C306E',
            type: 'color',
        },
    },
};
const dark = {
    typography: {
        body: {
            sm_regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_mono_regular: {
                value: {
                    fontFamily: 'Roboto Mono',
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_mono_semibold: {
                value: {
                    fontFamily: 'Roboto Mono',
                    fontWeight: 500,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_mono_regular: {
                value: {
                    fontFamily: 'Roboto Mono',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_mono_semibold: {
                value: {
                    fontFamily: 'Roboto Mono',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        callout: {
            regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '24px',
                    fontSize: '18px',
                    letterSpacing: '0.09px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '24px',
                    fontSize: '18px',
                    letterSpacing: '0.09px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '18px',
                    letterSpacing: '0.09px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        headline: {
            regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '28px',
                    fontSize: '20px',
                    letterSpacing: '-0.26px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '28px',
                    fontSize: '20px',
                    letterSpacing: '-0.26px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '28px',
                    fontSize: '20px',
                    letterSpacing: '-0.26px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        heading: {
            title_1: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '56px',
                    fontSize: '40px',
                    letterSpacing: '-0.52px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            title_2: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '40px',
                    fontSize: '32px',
                    letterSpacing: '-0.416px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            title_3: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '32px',
                    fontSize: '24px',
                    letterSpacing: '-0.312px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        caption: {
            regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '18px',
                    fontSize: '12px',
                    letterSpacing: '0.18px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '18px',
                    fontSize: '12px',
                    letterSpacing: '0.18px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
        interactive: {
            md_link: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'underline',
                },
                type: 'typography',
            },
            sm_link: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'underline',
                },
                type: 'typography',
            },
            sm_regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            sm_semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '20px',
                    fontSize: '14px',
                    letterSpacing: '0.07px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_bold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_semibold: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
            md_regular: {
                value: {
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    lineHeight: '24px',
                    fontSize: '16px',
                    letterSpacing: '0.08px',
                    paragraphSpacing: '12px',
                    textCase: 'none',
                    textDecoration: 'none',
                },
                type: 'typography',
            },
        },
    },
    fontFamily: {
        primary: {
            value: 'Roboto',
            type: 'fontFamilies',
        },
        mono: {
            value: 'Roboto Mono',
            type: 'fontFamilies',
        },
    },
    lineHeight: {
        caption: {
            value: '18px',
            type: 'lineHeights',
        },
        body_sm: {
            value: '20px',
            type: 'lineHeights',
        },
        body_md: {
            value: '24px',
            type: 'lineHeights',
        },
        callout: {
            value: '24px',
            type: 'lineHeights',
        },
        headline: {
            value: '28px',
            type: 'lineHeights',
        },
        title_sm: {
            value: '32px',
            type: 'lineHeights',
        },
        title_md: {
            value: '40px',
            type: 'lineHeights',
        },
        title_lg: {
            value: '56px',
            type: 'lineHeights',
        },
    },
    fontWeight: {
        regular: {
            value: 400,
            type: 'fontWeights',
        },
        medium: {
            value: 500,
            type: 'fontWeights',
        },
        semibold: {
            value: 500,
            type: 'fontWeights',
        },
        bold: {
            value: 700,
            type: 'fontWeights',
        },
    },
    fontSize: {
        caption: {
            value: '12px',
            type: 'fontSizes',
        },
        body_sm: {
            value: '14px',
            type: 'fontSizes',
        },
        body_md: {
            value: '16px',
            type: 'fontSizes',
        },
        callout: {
            value: '18px',
            type: 'fontSizes',
        },
        headline: {
            value: '20px',
            type: 'fontSizes',
        },
        title_sm: {
            value: '24px',
            type: 'fontSizes',
        },
        title_md: {
            value: '32px',
            type: 'fontSizes',
        },
        title_lg: {
            value: '40px',
            type: 'fontSizes',
        },
    },
    paragraphSpacing: {
        default: {
            value: '12px',
            type: 'paragraphSpacing',
        },
    },
    textCase: {
        none: {
            value: 'none',
            type: 'textCase',
        },
        allCaps: {
            value: 'uppercase',
            type: 'textCase',
        },
    },
    textDecoration: {
        none: {
            value: 'none',
            type: 'textDecoration',
        },
        underline: {
            value: 'underline',
            type: 'textDecoration',
        },
        line_through: {
            value: 'line-through',
            type: 'textDecoration',
        },
    },
    letterSpacing: {
        body: {
            value: 0.005,
            type: 'letterSpacing',
        },
        titles: {
            value: -0.013,
            type: 'letterSpacing',
        },
        caption: {
            value: 0.015,
            type: 'letterSpacing',
        },
    },
    backgroundColor: {
        layout: {
            'container-L0': {
                value: '#060e1f',
                type: 'color',
                description: 'apply shadow',
            },
            'container-L1': {
                value: '#0b1936',
                type: 'color',
            },
            'container-L2': {
                value: '#ffffff14',
                type: 'color',
                description: 'Apply only for surfaces above container-L1',
            },
            'container-emphasized': {
                value: '#142e63',
                type: 'color',
            },
            'container-emphasized-primary': {
                value: '#2b64d6',
                type: 'color',
            },
            'container-inverse': {
                value: '#2b64d6',
                type: 'color',
            },
        },
        interactive: {
            'primary-default': {
                value: '#2b64d6',
                type: 'color',
            },
            'primary-hover': {
                value: '#4074db',
                type: 'color',
            },
            'primary-press': {
                value: '#2659bf',
                type: 'color',
            },
            'primary-disabled': {
                value: '#0f244d52',
                type: 'color',
            },
            'secondary-default': {
                value: '#ffffff00',
                type: 'color',
            },
            'secondary-hover': {
                value: '#ffffff29',
                type: 'color',
            },
            'secondary-press': {
                value: '#ffffff52',
                type: 'color',
            },
            'secondary-disabled': {
                value: '#0f244d52',
                type: 'color',
            },
            'tertiary-default': {
                value: '#ffffff00',
                type: 'color',
            },
            'tertiary-hover': {
                value: '#ffffff29',
                type: 'color',
            },
            'tertiary-press': {
                value: '#ffffff52',
                type: 'color',
            },
            'tertiary-disabled': {
                value: '#0f244d52',
                type: 'color',
            },
            'surface-default': {
                value: '#ffffff00',
                type: 'color',
            },
            'surface-hover': {
                value: '#ffffff29',
                type: 'color',
            },
            'surface-press': {
                value: '#ffffff52',
                type: 'color',
            },
            'surface-disabled': {
                value: '#0f244d52',
                type: 'color',
            },
            transparent: {
                value: '#ffffff00',
                type: 'color',
            },
            'destructive-default': {
                value: '#BA452D',
                type: 'color',
            },
            'destructive-hover': {
                value: '#D44B2F',
                type: 'color',
            },
            'destructive-press': {
                value: '#A1402B',
                type: 'color',
            },
            'destructive-disabled': {
                value: '#0f244d52',
                type: 'color',
            },
            'destructive-secondary-default': {
                value: '#FCDFD9',
                type: 'color',
            },
            'destructive-secondary-hover': {
                value: '#FFF7F5',
                type: 'color',
            },
            'destructive-secondary-press': {
                value: '#FACAC0',
                type: 'color',
            },
            'destructive-secondary-disabled': {
                value: '#0f244d52',
                type: 'color',
            },
            'destructive-tertiary-default': {
                value: '#FCDFD9',
                type: 'color',
            },
            'destructive-tertiary-hover': {
                value: '#FFF7F5',
                type: 'color',
            },
            'destructive-tertiary-press': {
                value: '#FACAC0',
                type: 'color',
            },
            'destructive-tertiary-disabled': {
                value: '#0f244d52',
                type: 'color',
            },
        },
        feedback: {
            negative: {
                value: '#52261D',
                type: 'color',
            },
            negativeAccent: {
                value: '#D44B2F',
                type: 'color',
            },
            warning: {
                value: '#573A1A',
                type: 'color',
            },
            warningAccent: {
                value: '#E37E0B',
                type: 'color',
            },
            positive: {
                value: '#1B4531',
                type: 'color',
            },
            positiveAccent: {
                value: '#3CA674',
                type: 'color',
            },
            info: {
                value: '#204152',
                type: 'color',
            },
            infoAccent: {
                value: '#4BA4D1',
                type: 'color',
            },
            neutral: {
                value: '#ffffff29',
                type: 'color',
            },
            neutralAccent: {
                value: '#ffffffa3',
                type: 'color',
            },
        },
    },
    padding: {
        zero: {
            value: '0px',
            type: 'spacing',
        },
        xxxs: {
            value: '4px',
            type: 'spacing',
        },
        xxs: {
            value: '8px',
            type: 'spacing',
        },
        xs: {
            value: '12px',
            type: 'spacing',
        },
        sm: {
            value: '16px',
            type: 'spacing',
        },
        md: {
            value: '20px',
            type: 'spacing',
        },
        lg: {
            value: '24px',
            type: 'spacing',
        },
        xl: {
            value: '32px',
            type: 'spacing',
        },
        xxl: {
            value: '40px',
            type: 'spacing',
        },
        xxxl: {
            value: '48px',
            type: 'spacing',
        },
        'inset-xs': {
            value: '4px 4px 4px 4px',
            type: 'spacing',
        },
        'inset-md': {
            value: '16px 16px 16px 16px',
            type: 'spacing',
        },
        'inset-lg': {
            value: '32px 32px 32px 32px',
            type: 'spacing',
        },
        'inset-xl': {
            value: '64px 64px 64px 64px',
            type: 'spacing',
        },
        'squish-sm': {
            value: '4px 8px',
            type: 'spacing',
        },
        'squish-md': {
            value: '8px 16px',
            type: 'spacing',
        },
        'squish-lg': {
            value: '16px 32px',
            type: 'spacing',
        },
        'stretch-sm': {
            value: '12px 8px',
            type: 'spacing',
        },
        'stretch-md': {
            value: '24px 16px',
            type: 'spacing',
        },
        'inset-sm': {
            value: '8px 8px 8px 8px',
            type: 'spacing',
        },
    },
    gap: {
        zero: {
            value: '0px',
            type: 'spacing',
        },
        xxxs: {
            value: '4px',
            type: 'spacing',
        },
        xxs: {
            value: '8px',
            type: 'spacing',
        },
        xs: {
            value: '12px',
            type: 'spacing',
        },
        sm: {
            value: '16px',
            type: 'spacing',
        },
        md: {
            value: '20px',
            type: 'spacing',
        },
        lg: {
            value: '24px',
            type: 'spacing',
        },
        xl: {
            value: '32px',
            type: 'spacing',
        },
        xxl: {
            value: '40px',
            type: 'spacing',
        },
        xxxl: {
            value: '48px',
            type: 'spacing',
        },
        'stack-xxs': {
            value: '2px',
            type: 'spacing',
        },
        'stack-xs': {
            value: '4px',
            type: 'spacing',
        },
        'stack-sm': {
            value: '8px',
            type: 'spacing',
        },
        'stack-md': {
            value: '16px',
            type: 'spacing',
        },
        'stack-lg': {
            value: '32px',
            type: 'spacing',
        },
        'stack-xl': {
            value: '64px',
            type: 'spacing',
        },
        'stack-zero': {
            value: '0px',
            type: 'spacing',
        },
        'inline-xxs': {
            value: '2px',
            type: 'spacing',
        },
        'inline-xs': {
            value: '4px',
            type: 'spacing',
        },
        'inline-sm': {
            value: '8px',
            type: 'spacing',
        },
        'inline-md': {
            value: '16px',
            type: 'spacing',
        },
        'inline-lg': {
            value: '32px',
            type: 'spacing',
        },
        'inline-xl': {
            value: '64px',
            type: 'spacing',
        },
        'inline-zero': {
            value: '0px',
            type: 'spacing',
        },
    },
    margin: {
        zero: {
            value: '0px',
            type: 'spacing',
        },
        xxxs: {
            value: '4px',
            type: 'spacing',
        },
        xxs: {
            value: '8px',
            type: 'spacing',
        },
        xs: {
            value: '12px',
            type: 'spacing',
        },
        sm: {
            value: '16px',
            type: 'spacing',
        },
        md: {
            value: '20px',
            type: 'spacing',
        },
        lg: {
            value: '24px',
            type: 'spacing',
        },
        xl: {
            value: '32px',
            type: 'spacing',
        },
        xxl: {
            value: '40px',
            type: 'spacing',
        },
        xxxl: {
            value: '48px',
            type: 'spacing',
        },
    },
    width: {
        zero: {
            value: '0px',
            type: 'sizing',
        },
        xxxs: {
            value: '4px',
            type: 'sizing',
        },
        xxs: {
            value: '8px',
            type: 'sizing',
        },
        xs: {
            value: '12px',
            type: 'sizing',
        },
        sm: {
            value: '16px',
            type: 'sizing',
        },
        md: {
            value: '24px',
            type: 'sizing',
        },
        lg: {
            value: '32px',
            type: 'sizing',
        },
        xl: {
            value: '40px',
            type: 'sizing',
        },
        xxl: {
            value: '48px',
            type: 'sizing',
        },
        xxxl: {
            value: '64px',
            type: 'sizing',
        },
        '18x': {
            value: '72px',
            type: 'sizing',
        },
        '20x': {
            value: '80px',
            type: 'sizing',
        },
        '24x': {
            value: '96px',
            type: 'sizing',
        },
        '30x': {
            value: '120px',
            type: 'sizing',
        },
        '40x': {
            value: '160px',
            type: 'sizing',
        },
        '60x': {
            value: '240px',
            type: 'sizing',
        },
        '80x': {
            value: '320px',
            type: 'sizing',
        },
    },
    height: {
        zero: {
            value: '0px',
            type: 'sizing',
        },
        xxxs: {
            value: '4px',
            type: 'sizing',
        },
        xxs: {
            value: '8px',
            type: 'sizing',
        },
        xs: {
            value: '12px',
            type: 'sizing',
        },
        sm: {
            value: '16px',
            type: 'sizing',
        },
        md: {
            value: '24px',
            type: 'sizing',
        },
        lg: {
            value: '32px',
            type: 'sizing',
        },
        xl: {
            value: '40px',
            type: 'sizing',
        },
        xxl: {
            value: '48px',
            type: 'sizing',
        },
        xxxl: {
            value: '64px',
            type: 'sizing',
        },
        '18x': {
            value: '72px',
            type: 'sizing',
        },
        '20x': {
            value: '80px',
            type: 'sizing',
        },
        '24x': {
            value: '96px',
            type: 'sizing',
        },
        '30x': {
            value: '120px',
            type: 'sizing',
        },
        '40x': {
            value: '160px',
            type: 'sizing',
        },
        '60x': {
            value: '240px',
            type: 'sizing',
        },
        '80x': {
            value: '320px',
            type: 'sizing',
        },
    },
    textColor: {
        feedback: {
            'text-negative': {
                value: '#FACAC0',
                type: 'color',
            },
            'icon-negative': {
                value: '#FACAC0',
                type: 'color',
            },
            'text-warning': {
                value: '#FFDEB8',
                type: 'color',
            },
            'icon-warning': {
                value: '#FFDEB8',
                type: 'color',
            },
            'text-positive': {
                value: '#C0EDD8',
                type: 'color',
            },
            'icon-positive': {
                value: '#C0EDD8',
                type: 'color',
            },
            'text-info': {
                value: '#CAEAFA',
                type: 'color',
            },
            'icon-info': {
                value: '#CAEAFA',
                type: 'color',
            },
        },
        layout: {
            primary: {
                value: '#ffffff',
                type: 'color',
            },
            secondary: {
                value: '#ffffffa3',
                type: 'color',
            },
            emphasized: {
                value: '#6e96e5',
                type: 'color',
            },
            'primary-inverse': {
                value: '#0b1936',
                type: 'color',
            },
            'secondary-inverse': {
                value: '#0f244da3',
                type: 'color',
            },
        },
        interactive: {
            default: {
                value: '#f5f8ff',
                type: 'color',
            },
            'default-inverse': {
                value: '#ffffff',
                type: 'color',
            },
            enabled: {
                value: '#f5f8ff',
                type: 'color',
            },
            placeholder: {
                value: '#ffffffa3',
                type: 'color',
            },
            disabled: {
                value: '#ffffff29',
                type: 'color',
            },
            link: {
                value: '#6e96e5',
                type: 'color',
            },
            destructive: {
                value: '#D44B2F',
                type: 'color',
            },
        },
    },
    borderColor: {
        layout: {
            'border-subtle': {
                value: '#ffffff29',
                type: 'color',
            },
            'border-strong': {
                value: '#ffffff52',
                type: 'color',
            },
            'divider-subtle': {
                value: '#ffffff14',
                type: 'color',
            },
            'divider-strong': {
                value: '#ffffff29',
                type: 'color',
            },
            'border-inverse': {
                value: '#edf1f5',
                type: 'color',
            },
        },
        interactive: {
            default: {
                value: '#ffffff52',
                type: 'color',
            },
            hover: {
                value: '#ffffffa3',
                type: 'color',
            },
            disabled: {
                value: '#ffffff29',
                type: 'color',
            },
            primary: {
                value: '#f5f8ff',
                type: 'color',
            },
            'focus-default': {
                value: '#2b64d6',
                type: 'color',
            },
            'focus-negative': {
                value: '#F79F8D',
                type: 'color',
            },
            'focus-warning': {
                value: '#C77314',
                type: 'color',
            },
            'focus-positive': {
                value: '#92DEBB',
                type: 'color',
            },
            'focus-info': {
                value: '#8DD0F2',
                type: 'color',
            },
        },
        feedback: {
            negative: {
                value: '#FACAC0',
                type: 'color',
            },
            warning: {
                value: '#FFDEB8',
                type: 'color',
            },
            positive: {
                value: '#C0EDD8',
                type: 'color',
            },
            info: {
                value: '#CAEAFA',
                type: 'color',
            },
        },
    },
    backdropOpacity: {
        default: {
            value: '#00000066',
            type: 'color',
        },
    },
    borderRadius: {
        'radius-xs': {
            value: '2px',
            type: 'borderRadius',
        },
        'radius-sm': {
            value: '4px',
            type: 'borderRadius',
        },
        'radius-md': {
            value: '8px',
            type: 'borderRadius',
        },
        'radius-lg': {
            value: '12px',
            type: 'borderRadius',
        },
        'radius-xl': {
            value: '16px',
            type: 'borderRadius',
        },
        'radius-xxl': {
            value: '24px',
            type: 'borderRadius',
        },
        'radius-full': {
            value: '2000px',
            type: 'borderRadius',
        },
        'radius-zero': {
            value: '0px',
            type: 'borderRadius',
        },
    },
    borderWidth: {
        'width-zero': {
            value: '0px',
            type: 'borderWidth',
        },
        'width-sm': {
            value: '1px',
            type: 'borderWidth',
        },
        'width-md': {
            value: '2px',
            type: 'borderWidth',
        },
        'width-lg': {
            value: '4px',
            type: 'borderWidth',
        },
    },
    boxShadow: {
        'level-1': {
            value: {
                x: 0,
                y: 2,
                blur: 6,
                spread: 0,
                color: '#0000001a',
                type: 'dropShadow',
            },
            type: 'boxShadow',
        },
        'level-2': {
            value: {
                x: 0,
                y: 6,
                blur: 16,
                spread: 0,
                color: '#00000026',
                type: 'dropShadow',
            },
            type: 'boxShadow',
        },
        'level-3': {
            value: {
                x: 0,
                y: 12,
                blur: 32,
                spread: 0,
                color: '#00000033',
                type: 'dropShadow',
            },
            type: 'boxShadow',
        },
        'level-4': {
            value: {
                x: 0,
                y: 24,
                blur: 48,
                spread: 0,
                color: '#00000026',
                type: 'dropShadow',
            },
            type: 'boxShadow',
        },
    },
    buttonIcon: {
        primary: {
            default: {
                container: {
                    value: {
                        verticalPadding: '12px',
                        horizontalPadding: '12px',
                        borderRadius: '8px',
                        fill: '#2b64d6',
                        spacing: '0px',
                    },
                    type: 'composition',
                },
                icon: {
                    value: {
                        fill: '#ffffff',
                    },
                    type: 'composition',
                },
            },
        },
    },
    dataViz: {
        '1': {
            value: '#68CC9D',
            type: 'color',
        },
        '2': {
            value: '#D44B2F',
            type: 'color',
        },
        '3': {
            value: '#FF961F',
            type: 'color',
        },
        '4': {
            value: '#873827',
            type: 'color',
        },
        '5': {
            value: '#BA89F5',
            type: 'color',
        },
        '6': {
            value: '#4491B8',
            type: 'color',
        },
        '7': {
            value: '#29556B',
            type: 'color',
        },
        '8': {
            value: '#2F805A',
            type: 'color',
        },
        '9': {
            value: '#4C306E',
            type: 'color',
        },
    },
};
exports.default = {
    light,
    dark,
};
//# sourceMappingURL=index.js.map