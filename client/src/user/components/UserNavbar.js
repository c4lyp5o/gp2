import { useState, useRef, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';

function AdminNavbar() {
  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight + 20}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
  }, [showLinks]);

  return (
    <nav className='nav-container'>
      <div className='nav-header'>
        <button className='nav-toggle' onClick={toggleLinks}>
          <FaBars />
        </button>
      </div>
      <div className='links-container' ref={linksContainerRef}>
        <ul className='links' ref={linksRef}>
          <li>
            <a href='#dashboard'>dashboard</a>
          </li>
          <li>
            <a href='#taska'>taska</a>
          </li>
          <li>
            <a href='#sekolah'>sekolah</a>
          </li>
          <li>
            <a href='#institusi'>institusi</a>
          </li>
          <li>
            <a href='#generate-reten'>generate reten</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;
