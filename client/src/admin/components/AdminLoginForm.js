import { globeVar, changeValue } from "../../testrun/global.js";
function AdminLoginForm() {
  const handleSubmit = (e) => {
    console.log(globeVar);
    e.preventDefault();
    changeValue();
    console.log(globeVar);
    // some code here..
  };

  return (
    <>
      <h3 className="text-xl font-semibold mt-10">sila masukkan kata laluan</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md shadow-xl"
          type="text"
          placeholder="ID Pengguna"
          required
        />
        <br />
        <input
          className="mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md shadow-xl"
          type="password"
          placeholder="Kata Laluan"
          required
        />
        <br />
        <div className="mt-5 text-xs text-admin6 underline">
          <a href="#lupa-kata-laluan">lupa kata laluan</a>
        </div>
        <br />
        <button
          type="submit"
          className="capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all"
        >
          log masuk
        </button>
      </form>
    </>
  );
}

export default AdminLoginForm;
