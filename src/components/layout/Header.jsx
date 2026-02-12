// src/components/layout/Header.jsx
import React, { useContext, useState } from 'react';
import { Container, Navbar, Nav, Button, Form, FormControl, Dropdown  } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import { FaSearch, FaHome, FaBook, FaNewspaper, FaInfoCircle, FaEnvelope, FaGlobe, FaSignOutAlt, FaSignInAlt, FaUser, FaCog } from 'react-icons/fa';

const Header = () => {
  const { language, toggleLanguage, translations } = useContext(LanguageContext);
  const t = translations[language];
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!token; // true if token exists

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
    window.location.reload();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <FaGlobe className="text-yoruba me-2" />
          <span className="text-yoruba fw-bold">SIY</span>
          <span className="ms-2 d-none d-md-inline">
            {language === 'yo' ? 'Ìmọ̀ Ìjìnlẹ̀ ní Yorùbá' : 'Science in Yorùbá'}
          </span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">
              <FaHome className="me-1" /> {t.nav.home}
            </Nav.Link>
            <Nav.Link href="/topics">
              <FaBook className="me-1" /> {t.nav.topics}
            </Nav.Link>
            <Nav.Link href="/articles">
              <FaNewspaper className="me-1" /> {t.nav.articles}
            </Nav.Link>
            <Nav.Link href="/about">
              <FaInfoCircle className="me-1" /> {t.nav.about}
            </Nav.Link>
            <Nav.Link href="/contact">
              <FaEnvelope className="me-1" /> {t.nav.contact}
            </Nav.Link>
          </Nav>
          
          <Form className="d-flex me-3">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <FaSearch />
              </span>
              <FormControl
                type="search"
                placeholder={t.nav.search}
                className="border-start-0"
                aria-label="Search"
              />
            </div>
          </Form>

          {isLoggedIn ? (
            <Dropdown className="me-3">
              <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                <FaUser className="me-1" />
                {user?.name?.split(' ')[0] || 'Admin'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/admin">
                  <FaCog className="me-2" />
                  {language === 'yo' ? 'Ìtọ́jú' : 'Admin Panel'}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  {language === 'yo' ? 'Ìgbàá' : 'Logout'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button 
              variant="outline-light" 
              href="/admin/login"
              className="me-3"
            >
              <FaSignInAlt className="me-1" />
              {language === 'yo' ? 'Ìwọlé' : 'Login'}
            </Button>
          )}
          
          <Button 
            variant="outline-light" 
            onClick={toggleLanguage}
            className="language-toggle d-flex align-items-center"
          >
            <FaGlobe className="me-1" />
            {language === 'yo' ? 'EN' : 'YO'}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;