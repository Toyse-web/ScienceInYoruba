// src/pages/NotFound.jsx
import React, { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <Container className="py-5 text-center">
      <h1 className="display-1 fw-bold text-muted">404</h1>
      <h2 className="mb-4">
        {language === 'yo' ? 'Ojúewé kò sí' : 'Page Not Found'}
      </h2>
      <p className="lead mb-4">
        {language === 'yo' 
          ? 'Ojúewé tí o n wá kò sí. Ṣe o fẹ́ lọ sí ojúewé ilé?' 
          : "The page you're looking for doesn't exist. Would you like to go home?"
        }
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate('/')}>
        {language === 'yo' ? 'Lọ sí ilé' : 'Go Home'}
      </Button>
    </Container>
  );
};

export default NotFound;