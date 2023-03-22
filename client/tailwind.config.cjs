/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      user1: '#415164', // kelabu
      user2: '#1f315f', // biru gelap
      user3: '#638cbb', // biru biasa
      user4: '#9ebcdf', // biru cair
      user5: '#e1e9ef', // biru cair background
      user6: '#d9693f', // merah warning
      user7: '#37e186', // hijau
      user8: '#ebcd59', // kuning
      user9: '#ff6363', // merah
      userWhite: 'white',
      userBlack: 'black',
      admin1: '#c76565', // pink pucat
      admin2: '#8c0d3c', // pink pekat
      admin3: '#c44058', // pink biasa
      admin4: '#e79595', // pink cair
      admin5: '#ffefd6', // kuning cair
      admin6: '#0f0f0f', // hitam custom
      admin7: '#e66767', // pink ungu
      adminWhite: 'white',
      adminBlack: 'black',
      kaunter1: '#e05200', // oren gelap
      kaunter2: '#fd8b49', // oren
      kaunter3: '#ffbf99', // oren pucat
      kaunter4: '#3e6c70', // turqoise?????
      kaunter5: '#2f5653', // turqoise gelap?????
      kaunter6: '#f3e19b', // bg color kuning untuk double confirm pendaftaran
      kaunterWhite: 'white',
      kaunterBlack: 'black',
    },
    extend: {},
  },
  plugins: [],
};
