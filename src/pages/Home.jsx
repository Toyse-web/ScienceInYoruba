// src/pages/Home.jsx - Updated with React Icons
import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { LanguageContext } from "../context/LanguageContext";
import * as Icons from 'react-icons/fa';
import { Link } from "react-router-dom";;
import api from "../services/api";

const DynamicIcon = ({iconName}) => {
    const IconComponent = Icons[iconName] || Icons.FaBook;
    return <IconComponent />
  }

const Home = () => {
  const { language, translations } = useContext(LanguageContext);
  const [featuredTopics, setFeaturedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // useEffect(() => {
  //   setTimeout(() => {
  //     const topics = [
  //       { id: 1, titleYo: 'Ìmọ́lẹ̀', titleEn: 'Light', descriptionYo: 'Ìtumò àti àwọn ìṣe ìmọ́lẹ̀', descriptionEn: 'Properties and behavior of light', icon: <FaLightbulb size={40} />, articleCount: 5 },
  //       { id: 2, titleYo: 'Àwọn Ẹ̀dá Ọ̀fun', titleEn: 'Human Body', descriptionYo: 'Ìṣẹ̀lẹ̀ àti ìṣòro ẹ̀dá ọ̀fun', descriptionEn: 'Human anatomy and physiology', icon: <FaUserMd size={40} />, articleCount: 8 },
  //       { id: 3, titleYo: 'Ilẹ̀ Ayé', titleEn: 'Earth Science', descriptionYo: 'Nípa ilẹ̀ ayé àti àwọn òṣùpá', descriptionEn: 'Study of Earth and planets', icon: <FaGlobeAmericas size={40} />, articleCount: 12 },
  //       { id: 4, titleYo: 'Kẹ́místrì', titleEn: 'Chemistry', descriptionYo: 'Àwọn àwùjọ àti ìyípadà', descriptionEn: 'Elements and reactions', icon: <FaFlask size={40} />, articleCount: 6 },
  //       { id: 5, titleYo: 'Físíksì', titleEn: 'Physics', descriptionYo: 'Agbára àti ìṣiṣẹ́', descriptionEn: 'Energy and work', icon: <FaAtom size={40} />, articleCount: 7 },
  //       { id: 6, titleYo: 'Báyólójì', titleEn: 'Biology', descriptionYo: 'Ìgbé ayé àti ìdàgbàsókè', descriptionEn: 'Life and evolution', icon: <FaSeedling size={40} />, articleCount: 9 },
  //     ];
  //     setFeaturedTopics(topics);
  //     setLoading(false);
  //   }, 1000);
  // }, []);

  useEffect(() => {
    const fetchFeaturedTopics = async () => {
      setLoading(true);
      try {
        // Fetch only featured topics from your actual database
        const response = await api.get("/topics", { params: { isFeatured: true } });
        if (response.data.success) {
          setFeaturedTopics(response.data.topics);
        }
      } catch (err) {
        console.error("Error fetching topics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTopics();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">{translations[language].hero.title}</h1>
              <p className="lead mb-4">{translations[language].hero.subtitle}</p>
              <div className="d-flex gap-3">
                <Button variant="warning" size="lg">
                  {translations[language].hero.cta} <Icons.FaArrowRight className="ms-2" />
                </Button>
                <Button variant="outline-light" size="lg">
                  {language === 'yo' ? 'Àwọn Ọ̀ràn' : 'Browse Topics'}
                </Button>
              </div>
            </Col>
            <Col lg={4} className="text-center d-none d-lg-block">
              <Icons.FaGraduationCap size={120} className="hero-icon text-warning" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Topics */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">
            {language === 'yo' ? 'Àwọn Ọ̀ràn Pàtàkì' : 'Featured Topics'}
          </h2>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">{language === 'yo' ? 'Ó ń ṣe...' : 'Loading...'}</p>
            </div>
          ) : (
            <Row>
  {featuredTopics.map((topic) => (
    <Col md={6} lg={4} key={topic._id} className="mb-4">
      <Card className="h-100 shadow-sm border-0 hover-shadow">
        <Card.Body className="text-center d-flex flex-column">
          {/* 1. Icon rendering logic */}
          <div className="mb-3" style={{ fontSize: '40px', color: topic.color || '#3498db' }}>
             {/* If using the DynamicIcon helper we made earlier: */}
             <DynamicIcon iconName={topic.icon} /> 
          </div>

          <Card.Title className="fw-bold mb-3">
            {language === 'yo' ? topic.name.yo : topic.name.en}
          </Card.Title>

          <Card.Text className="text-muted mb-4 flex-grow-1">
            {language === 'yo' ? topic.description?.yo : topic.description?.en}
          </Card.Text>

          <div className="mt-auto">
            {/* 2. Navigation Logic: Send user to Articles page with category filter */}
            <Button 
              as={Link} 
              to={`/articles?category=${topic.category}`} 
              variant="outline-primary" 
              size="sm"
            >
              {language === 'yo' ? 'Ṣàwárí' : 'Explore'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default Home;