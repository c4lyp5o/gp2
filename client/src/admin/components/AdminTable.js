function AdminTable() {
  function KlinikListTable() {
    return (
      <div className="admin-table">
        <h1>Senarai Klinik Pergigian Daerah $$$</h1>
        <div className="admin-table-container">
          <div className="admin-table-header-container">
            <div className="admin-table-header-container-text">
              <table>
                <thead>
                  <tr>
                    <th>Bil.</th>
                    <th>Nama KP</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>KP Gulau</td>
                    <td>kpgulau</td>
                    <td>rahasia</td>
                    <td>
                      <div className="admin-table-header-container-text-manage">
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>KP Naka</td>
                    <td>kpnaka</td>
                    <td>rahasia</td>
                    <td>
                      <div className="admin-table-header-container-text-manage">
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button id="addFac">+</button>
          </div>
        </div>
      </div>
    );
  }

  function StaffListTable() {
    function Pegawai() {
      return <h1>Senarai Pegawai Pergigian Daerah $$$</h1>;
    }
    function Juruterapi() {
      return <h1>Senarai Juruterapi Pergigian Daerah $$$</h1>;
    }
    return (
      <div className="admin-table">
        {/* <Pegawai /> */}
        <Juruterapi />
        <div className="admin-table-container">
          <div className="admin-table-header-container">
            <div className="admin-table-header-container-text">
              <table>
                <thead>
                  <tr>
                    <th>Bil.</th>
                    <th>Nama</th>
                    <th>Gred</th>
                    {/* <th>KP</th> */}
                    <th>Nama Klinik Pergigian</th>
                    <th>Role</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Calypso</td>
                    <td>666</td>
                    <td>Klinik Pergigian Datuk Kumbar</td>
                    {/* <td>KP Datuk Kumbar</td> */}
                    <td>Driller</td>
                    <td>
                      <div className="admin-table-header-container-text-manage">
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Mariya</td>
                    <td>999</td>
                    <td>Klinik Pergigian Alor Janggus</td>
                    {/* <td>KP Alor Janggus</td> */}
                    <td>Driller</td>
                    <td>
                      <div className="admin-table-header-container-text-manage">
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button id="addFac">+</button>
          </div>
        </div>
        {/* <img
          className="admin-table-plus-sign"
          width={100}
          height={100}
          src="https://pic.onlinewebfonts.com/svg/img_28449.png"
          alt="plus sign"
        /> */}
      </div>
    );
  }
  function EducationCenterListTable() {
    function Taska() {
      return <h1>Senarai Taska Daerah $$$</h1>;
    }
    function TadikaPraSekolah() {
      return <h1>Senarai Tadika Pra Sekolah Daerah $$$</h1>;
    }
    function SekolahRendah() {
      return <h1>Senarai Sekolah Rendah Daerah $$$</h1>;
    }
    function SekolahMenengah() {
      return <h1>Senarai Sekolah Menengah Daerah $$$</h1>;
    }
    function Institusi() {
      return <h1>Senarai Institusi Daerah $$$</h1>;
    }
    return (
      <div className="admin-table">
        <Taska />
        {/* <TadikaPraSekolah /> */}
        {/* <SekolahRendah /> */}
        {/* <SekolahMenengah /> */}
        {/* <Institusi /> */}
        <div className="admin-table-container">
          <div className="admin-table-header-container">
            <select>
              <option>Klinik Pergigian Alor Janggus</option>
              <option>Klinik Pergigian Datuk Kumbar</option>
            </select>
            <div className="admin-table-header-container-text">
              <table>
                <thead>
                  <tr>
                    <th>Bil.</th>
                    <th>Nama</th>
                    <th>Nama Klinik Pergigian</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Calypso</td>
                    <td>666</td>
                    <td>
                      <div className="admin-table-header-container-text-manage">
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Calypso</td>
                    <td>666</td>
                    <td>
                      <div className="admin-table-header-container-text-manage">
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button id="addFac">+</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <KlinikListTable /> */}
      {/* <StaffListTable /> */}
      <EducationCenterListTable />
    </div>
  );
}

export default AdminTable;
