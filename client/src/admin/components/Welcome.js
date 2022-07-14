export default function Welcome({ showWelcome }) {
  if (showWelcome) {
    return (
      <div className='justify-center items-center text-xl font-semibold mt-10 space-y-5'>
        <h1>selamat datang admin!</h1>
        <p>sila pilih fungsi di sidebar</p>
      </div>
    );
  }
}
