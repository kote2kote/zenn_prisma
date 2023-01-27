module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    screens: {
      // --------------------------------------------------
      // custom settings
      // --------------------------------------------------
      // 根拠：https://crestadesign.org/responsive/
      maxxs: { max: '374px' },
      xs: { min: '375px' },

      maxsp: { max: '427px' }, //iPhone 13ProMax427px以下は全部スマホ判断
      sp: '428px',
      sptb: { min: '428px', max: '559px' },

      maxtb: { max: '599px' },
      tb: '600px',
      tbpc: { min: '600px', max: '1023px' },

      maxpc: { max: '1023px' },
      pc: '1024px',

      // --------------------------------------------------
      // tailwind default
      // --------------------------------------------------
      maxsm: { max: '639px' },
      sm: '640px',
      smmd: { min: '640px', max: '767px' },

      maxmd: { max: '767px' },
      md: '768px',
      mdlg: { min: '768px', max: '1023px' },

      maxlg: { max: '1023px' },
      lg: '1024px',
      lgxl: { min: '1024px', max: '1279px' },

      maxxl: { max: '1279px' },
      xl: '1280px',
      xlwide: { min: '1280px', max: '1535px' },

      maxwide: { max: '1535px' },
      wide: '1536px',
    },
    extend: {},
  },
  plugins: [],
};
