import { FaBars } from 'react-icons/fa';

function AdminNavbar() {
  return (
    <nav className='nav-container'>
      <div className='nav-header'>
        <button className='nav-toggle'>
          <FaBars />
        </button>
      </div>
      <div className='links-container'>
        <ul className='links'>
          <li>
            <a href='#dashboard'>dashboard</a>
          </li>
          <li>
            <a href='#klinik-pergigian'>klinik pergigian</a>
          </li>
          <li>
            <a href='#pegawai-pergigian'>klinik pergigian</a>
          </li>
          <li>
            <a href='#juruterapi-pergigian'>juruterapi pergigian</a>
          </li>
          <li>
            <a href='#taska'>taska</a>
          </li>
          <li>
            <a href='#tadika'>tadika</a>
          </li>
          <li>
            <a href='#sekolah-rendah'>sekolah rendah</a>
          </li>
          <li>
            <a href='#sekolah-menengah'>sekolah menengah</a>
          </li>
          <li>
            <a href='#institusi'>institusi</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;
