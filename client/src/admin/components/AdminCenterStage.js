import { globeVar } from "../../testrun/global";
import AdminLoginForm from "./AdminLoginForm";
import AdminSelamatDatang from "./AdminSelamatDatang";

function AdminSmallStage() {
  if (globeVar === false) {
    return (
      <div className="absolute inset-0 -z-10 flex bg-admin4 text-center justify-center items-center capitalize">
        <div className="w-1/2 h-[25rem] mt-20 mb-5 bg-adminWhite outline outline-1 outline-userBlack rounded-md shadow-xl">
          <AdminLoginForm />
        </div>
      </div>
    );
  }
}

function AdminBigStage() {
  if (globeVar === true) {
    return (
      <>
        <div className="absolute inset-0 -z-10 bg-admin4"></div>
        <div className="absolute inset-10 top-44 -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize">
          <div className="h-full p-5 overflow-y-auto">
            <AdminSelamatDatang />
          </div>
        </div>
      </>
    );
  }
}

function AdminCenterStage() {
  return (
    <>
      <AdminSmallStage />
      <AdminBigStage />
    </>
  );
}

export default AdminCenterStage;
