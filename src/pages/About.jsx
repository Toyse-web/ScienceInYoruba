// src/pages/About.jsx
import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';

const About = () => {
  const { language } = useContext(LanguageContext);

  return (
    <Container className="py-5">
      <h1 className="mb-4">
        {language === 'yo' ? 'Nípa Wa' : 'About Us'}
      </h1>
      
      <Row className="mb-5">
        <Col lg={8}>
          <p className="lead">
            {language === 'yo' 
              ? 'Science in Yorùbá jẹ́ ìgbìnyánjú láti mú ìmọ̀ ìjìnlẹ̀ sáyẹ́ǹsì dé títí fún gbogbo ènìyàn ní èdè Yorùbá.'
              : 'Science in Yorùbá is an initiative to make science education accessible to everyone in the Yorùbá language.'
            }
          </p>
          
          <h3 className="mt-4">
            {language === 'yo' ? 'Ètò Wa' : 'Our Mission'}
          </h3>
          <p>
            {language === 'yo' 
              ? 'Láti riíi dájú pé a lè fi èdè Yorùbá sọ̀rọ̀ nípa gbogbo ẹ̀ka ìmọ̀ ìjìnlẹ̀ sáyẹ́ǹsì kí á sì lè kọ́ àwọn akẹ́kọ̌ ní èyíkéyǐ ẹ̀ka ìmọ̀ yí pẹ̀lu èdè Yorùbá.'
              : 'To ensure we can discuss all fields of science in Yorùbá language so we can teach students in any science field using Yorùbá.'
            }
          </p>
        </Col>
        <Col lg={4}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h4>{language === 'yo' ? 'Àwọn Idánilẹ́kọ̀ọ́' : 'Our Values'}</h4>
              <ul className="list-unstyled">
                <li>✓ {language === 'yo' ? 'Ìtọ́sọ́nà' : 'Accessibility'}</li>
                <li>✓ {language === 'yo' ? 'Ìpinnu' : 'Excellence'}</li>
                <li>✓ {language === 'yo' ? 'Ìjọgbọ́n' : 'Innovation'}</li>
                <li>✓ {language === 'yo' ? 'Ìṣọpọ̀' : 'Community'}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;