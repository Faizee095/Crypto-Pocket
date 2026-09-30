import React from 'react';
import { useState ,useEffect } from 'react';
import { Button , Menu , Typography ,Avatar} from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, BulbOutlined, FundOutlined, MenuOutlined } from '@ant-design/icons';

import icon from '../images/crypto.jpg';

const Navbar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const selectedMenu = location.pathname.startsWith('/crypto/')
    ? 'cryptocurrencies'
    : location.pathname === '/cryptocurrencies'
      ? 'cryptocurrencies'
      : location.pathname === '/news'
        ? 'news'
        : 'home';

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  useEffect(() => {
    if (screenSize <= 800) setActiveMenu(false);
  }, [location.pathname, screenSize]);

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Avatar src={icon} size="large" />
        <Typography.Title level={2} className="logo"><Link to="/">Crypto-Pocket</Link></Typography.Title>
        <Button aria-label="Toggle navigation" aria-expanded={activeMenu} className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}><MenuOutlined /></Button>
      </div>
      {activeMenu && (
      <Menu theme="dark" mode="inline" selectedKeys={[selectedMenu]}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="cryptocurrencies" icon={<FundOutlined />}>
          <Link to="/cryptocurrencies">Cryptocurrencies</Link>
        </Menu.Item>
        <Menu.Item key="news" icon={<BulbOutlined />}>
          <Link to="/news">News</Link>
        </Menu.Item>
      </Menu>
      )}
    </div>
  );
};

export default Navbar;
