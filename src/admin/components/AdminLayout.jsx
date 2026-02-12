// src/admin/components/AdminLayout.jsx
import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Offcanvas } from 'react-bootstrap';
import { 
  FaBars, 
  FaTimes, 
  FaTachometerAlt, 
  FaNewspaper, 
  FaBook, 
  FaImages, 
  FaUsers, 
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';
import { LanguageContext } from '../../context/LanguageContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: language === 'yo' ? 'Dáshíbọ́ọ̀dù' : 'Dashboard' },
    { path: '/admin/articles', icon: <FaNewspaper />, label: language === 'yo' ? 'Àwọn Àkọ́ọ́lẹ̀' : 'Articles' },
    { path: '/admin/topics', icon: <FaBook />, label: language === 'yo' ? 'Àwọn Ọ̀ràn' : 'Topics' },
    { path: '/admin/media', icon: <FaImages />, label: language === 'yo' ? 'Àwọn Fáìlì' : 'Media' },
    { path: '/admin/users', icon: <FaUsers />, label: language === 'yo' ? 'Àwọn Oníṣe' : 'Users' },
  ];

  return (
    <div className="admin-container">
      {/* Top Navigation Bar */}
      <Navbar bg="dark" variant="dark" className="admin-navbar">
        <Container fluid>
          <Button 
            variant="outline-light" 
            onClick={() => setShowSidebar(!showSidebar)}
            className="sidebar-toggle"
          >
            {showSidebar ? <FaTimes /> : <FaBars />}
          </Button>
          
          <Navbar.Brand className="ms-3">
            <span className="text-warning fw-bold">SIY</span>
            <span className="ms-2 d-none d-md-inline">
              {language === 'yo' ? 'Olùṣàkóso' : 'Admin Panel'}
            </span>
          </Navbar.Brand>
          
          <div className="ms-auto d-flex align-items-center">
            <div className="user-info me-3 d-none d-md-flex align-items-center">
              <FaUserCircle className="me-2" />
              <span className="text-light">{user.name || 'Admin'}</span>
            </div>
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={handleLogout}
              className="logout-btn"
            >
              <FaSignOutAlt className="me-1" />
              {language === 'yo' ? 'Jáde' : 'Logout'}
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Sidebar for Desktop */}
      <div className="admin-sidebar d-none d-md-block">
        <div className="sidebar-header">
          <h5>{language === 'yo' ? 'Àwọn Ojúṣe' : 'Navigation'}</h5>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              end
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer mt-auto p-3">
          <div className="user-profile">
            <FaUserCircle size={40} className="text-primary" />
            <div className="ms-3">
              <h6 className="mb-0">{user.name || 'Admin'}</h6>
              <small className="text-muted">{user.role || 'Administrator'}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas 
        show={showSidebar} 
        onHide={() => setShowSidebar(false)}
        className="d-md-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {language === 'yo' ? 'Àwọn Ojúṣe' : 'Navigation'}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setShowSidebar(false)}
                end
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main className="admin-main">
        <Container fluid className="py-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default AdminLayout;