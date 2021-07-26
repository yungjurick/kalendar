module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-10': '-10'
      },
      fontSize: {
        'xxxs': '.4rem',
        'xxs': '.5rem'
      },
      minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        '40': '40px',
        '56': '56px',
        '100': '100px',
        '168': '168px',
        '248': '248px'
       },
       minHeight: {
        'list': 'calc(100vh - 117px)',
        'mail-list': 'calc(100vh - 145px)'
       },
       backgroundImage: theme => ({
         'inbox': "url('/inbox.png')",
         'starred': "url('/starred.png')",
         'important': "url('/important.png')",
         'sent': "url('/sent.png')",
         'spam': "url('/spam.png')",
         'drafts': "url('/drafts.png')",
         'trash': "url('/trash.png')",
         'active-important': "url('/active-important.png')",
         'active-star': "url('/active-star.png')",
         'inactive-important': "url('/inactive-important.png')",
         'inactive-star': "url('/inactive-star.png')",
         'background': "url('/background.jpeg')"
       }),
       flex: {
        'basis-56': '0 56px',
        'basis-168': '0 168px'
       }
    },
  },
  variants: {
    extend: {
      display: ['group-hover']
    },
  },
  plugins: [],
}
