const colors = {
  black: '#000',
  white: '#cccccc',
  cobalt: '#193549',
  giest: {
    primary: {
      background: '#000',
      accent1: '#111111',
      accent2: '#333333',
      accent3: '#444444',
      accent4: '#666666',
      accent5: '#888888',
      accent6: '#999999',
      accent7: '#EAEAEA',
      accent8: '#FAFAFA',
      foreground: '#fff',
    },
    success: {
      default: '#0070F3',
      light: '#3291FF',
      dark: '#0366D6',
    },
    error: {
      default: '#FF0000',
      light: '#FF3333',
      dark: '#E60000',
    },
    warning: {
      default: '#F5A623',
      light: '#F7B955',
      dark: '#F49B0B',
    },
    highlight: {
      alert: '#FF0080',
      purple: '#F81CE5',
      violet: '#7928CA',
      cyan: '#79FFE1',
    },
  },
}

export default {
  default: {
    background: colors.white,
    color: colors.black,
    footer: {
      color: colors.giest.primary.accent7,
      background: colors.giest.primary.accent1,
      disabled: colors.giest.primary.accent2,
      link: {
        color: colors.giest.primary.accent7,
      },
    },
    input: {
      background: colors.white,
      color: colors.black,
    },
    notification: {
      success: colors.giest.success.default,
      warning: {
        color: colors.giest.primary.accent1,
        background: colors.giest.warning.default,
      },
    },
    noteListItem: {
      border: colors.giest.primary.accent5,
    },
    logo: {
      color: colors.cobalt,
    },
    form: {
      button: {
        background: colors.cobalt,
        color: colors.white,
        disabled: {
          background: colors.giest.primary.accent2,
          color: colors.giest.primary.accent3,
        },
      },
    },
  },
  dark: {
    background: colors.black,
    color: colors.white,
    input: {
      background: colors.black,
      color: colors.white,
    },
  },
  cobalt: {
    background: colors.black,
    color: colors.white,
    input: {
      background: colors.cobalt,
      color: colors.white,
    },
  },
}
