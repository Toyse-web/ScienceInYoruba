// src/pages/Contact.jsx
import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';

const Contact = () => {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">
        {language === 'yo' ? 'Àdírẹ́sì' : 'Contact Us'}
      </h1>
      
      <Row>
        <Col lg={6} className="mb-4">
          <h3>{language === 'yo' ? 'Fọ́nrán Wa' : 'Get in Touch'}</h3>
          <p className="text-muted">
            {language === 'yo' 
              ? 'Ti o bá ní ìbéèrè tabi àṣàyàn, jọ̀wọ́ fọ́nrán wa.'
              : 'If you have questions or suggestions, please contact us.'
            }
          </p>
          
          <div className="mt-4">
            <h5>{language === 'yo' ? 'Àwọn Ọ̀nà Ìbánisọ̀rọ̀' : 'Contact Information'}</h5>
            <p><strong>📧 Email:</strong> contact@scienceinyoruba.org</p>
            <p><strong>🌐 Website:</strong> https://scienceinyoruba.org</p>
          </div>
        </Col>
        
        <Col lg={6}>
          {submitted && (
            <Alert variant="success" className="mb-4">
              {language === 'yo' 
                ? 'Ìfọ̀rọ̀wanilẹ́nu rẹ ti gbà! A ó dáhùn rẹ̀ lẹ́sẹ̀kẹsẹ̀.'
                : 'Your message has been received! We will respond shortly.'
              }
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'yo' ? 'Orúkọ' : 'Name'}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>{language === 'yo' ? 'Ìfọ̀rọ̀wanilẹ́nu' : 'Message'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Button variant="primary" type="submit">
              {language === 'yo' ? 'Fí ìfọ̀rọ̀wanilẹ́nu' : 'Send Message'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;