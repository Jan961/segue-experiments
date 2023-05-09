/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
],
  plugins: [
    require('@tailwindcss/forms'),
  ],
  theme: {
    /*
    colors: {

        'navbar-blue': '#22355a',
        'booking-heading-text': '#2a77a3',
        'form-backgrounds': '#22355a',
    },
    */
   extend:{
     colors:{
       "primary-orange": "#ec6255",
       "primary-yellow":"#fdce74",
       "primary-green": "#41a29a",
       "primary-blue": "#0093c0",
       "primary-purple" : "#7b568d",
       "primary-pink" : "#e94580",
       "primary-navy" : "#21345b",
       "dark-primary-green":"#42A29A",
       "soft-primary-green": "#BFE0DE",
       "soft-primary-grey": "#627293",
       "faded-primary-grey": "#f8f8fa",
       "soft-table-row-separation": "#e3ebf2",
       "table-row-alternating": "#f8f8f8"
     }
   }
  },
}
