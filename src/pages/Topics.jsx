// src/pages/Topics.jsx - Updated with React Icons
import React, { useContext } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { LanguageContext } from "../context/LanguageContext";
import { 
  FaLightbulb, 
  FaUserMd, 
  FaGlobeAmericas,
  FaFlask,
  FaAtom,
  FaSeedling,
  FaMicroscope,
  FaDna,
  FaRobot,
  FaSolarPanel,
  FaWind,
  FaWater,
  FaMountain,
  FaCloud
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Topics = () => {
  const { language } = useContext(LanguageContext);
  
  // Complete list of topics (including all from Home and more)
  const topics = [
    { id: 1, nameYo: "Ìmọ́lẹ̀", nameEn: "Light", icon: <FaLightbulb size={40} />, count: 5, color: "primary" },
    { id: 2, nameYo: "Àwọn Ẹ̀dá Ọ̀fun", nameEn: "Human Body", icon: <FaUserMd size={40} />, count: 8, color: "danger" },
    { id: 3, nameYo: "Ilẹ̀ Ayé", nameEn: "Earth Science", icon: <FaGlobeAmericas size={40} />, count: 12, color: "success" },
    { id: 4, nameYo: "Kẹ́místrì", nameEn: "Chemistry", icon: <FaFlask size={40} />, count: 6, color: "warning" },
    { id: 5, nameYo: "Físíksì", nameEn: "Physics", icon: <FaAtom size={40} />, count: 7, color: "info" },
    { id: 6, nameYo: "Báyólójì", nameEn: "Biology", icon: <FaSeedling size={40} />, count: 9, color: "success" },
    { id: 7, nameYo: "Ìmọ̀tara", nameEn: "Microbiology", icon: <FaMicroscope size={40} />, count: 4, color: "success" },
    { id: 8, nameYo: "Ìmọ̀ Ìdálẹ́sẹẹsẹ", nameEn: "Genetics", icon: <FaDna size={40} />, count: 3, color: "success" },
    { id: 9, nameYo: "Ẹ̀rọ Ìṣẹ̀dá", nameEn: "Robotics", icon: <FaRobot size={40} />, count: 5, color: "secondary" },
    { id: 10, nameYo: "Agbára Oòrùn", nameEn: "Solar Energy", icon: <FaSolarPanel size={40} />, count: 4, color: "warning" },
    { id: 11, nameYo: "Agbára Afẹ́fẹ́", nameEn: "Wind Energy", icon: <FaWind size={40} />, count: 3, color: "info" },
    { id: 12, nameYo: "Ìmọ̀ Omi", nameEn: "Hydrology", icon: <FaWater size={40} />, count: 6, color: "primary" },
    { id: 13, nameYo: "Ìmọ̀ Òkè", nameEn: "Geology", icon: <FaMountain size={40} />, count: 5, color: "success" },
    { id: 14, nameYo: "Ìmọ̀ Òfurufú", nameEn: "Meteorology", icon: <FaCloud size={40} />, count: 4, color: "info" },
  ];

  // Group topics by main category for organization
  const mainCategories = [
    { 
      nameYo: "Ìmọ̀ Ara Ẹni", 
      nameEn: "Life Sciences", 
      topics: topics.filter(t => [2, 6, 7, 8].includes(t.id)),
      color: "success"
    },
    { 
      nameYo: "Ìmọ̀ Àwùjọ", 
      nameEn: "Physical Sciences", 
      topics: topics.filter(t => [1, 4, 5].includes(t.id)),
      color: "primary"
    },
    { 
      nameYo: "Ìmọ̀ Ilẹ̀ Ayé", 
      nameEn: "Earth Sciences", 
      topics: topics.filter(t => [3, 12, 13, 14].includes(t.id)),
      color: "info"
    },
    { 
      nameYo: "Ìmọ̀ Ẹ̀rọ", 
      nameEn: "Technology", 
      topics: topics.filter(t => [9, 10, 11].includes(t.id)),
      color: "warning"
    },
  ];

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">
          {language === "yo" ? "Àwọn Ọ̀ràn Ìmọ̀ Ìjìnlẹ̀" : "Science Topics"}
        </h1>
        <p className="lead text-muted max-width-800 mx-auto">
          {language === "yo" 
            ? "Yàn lára àwọn ẹ̀ka ìmọ̀ ìjìnlẹ̀ tí o fẹ́ kà nípa rẹ̀ ní èdè Yorùbá" 
            : "Browse science topics to learn in Yorùbá language"}
        </p>
        <Badge bg="primary" className="fs-6 px-3 py-2">
          {topics.length} {language === "yo" ? "Ọ̀ràn lápapọ̀" : "Total Topics"}
        </Badge>
      </div>

      {/* Main Categories */}
      {mainCategories.map(category => (
        <div key={category.nameEn} className="mb-5">
          <h3 className={`text-${category.color} mb-4 border-bottom pb-2`}>
            {language === "yo" ? category.nameYo : category.nameEn}
          </h3>
          <Row>
            {category.topics.map(topic => (
              <Col md={6} lg={4} xl={3} key={topic.id} className="mb-4">
                <Card className="h-100 shadow-sm hover-shadow border-0">
                  <Card.Body className="text-center d-flex flex-column p-4">
                    <div className={`text-${topic.color} mb-3`}>
                      {topic.icon}
                    </div>
                    <Card.Title className="fw-bold mb-2">
                      {language === "yo" ? topic.nameYo : topic.nameEn}
                    </Card.Title>
                    <Card.Text className="text-muted small flex-grow-1">
                      {language === "yo" 
                        ? `Ìmọ̀ nípa ${topic.nameYo.toLowerCase()}`
                        : `Knowledge about ${topic.nameEn.toLowerCase()}`
                      }
                    </Card.Text>
                    <div className="mt-auto">
                      <Badge bg="light" text="dark" className="me-2">
                        {topic.count} {language === "yo" ? "àkọ́ọ́lẹ̀" : "articles"}
                      </Badge>
                      <Button 
                        as={Link}
                        to={`/articles?category=${topic.nameEn.toLowerCase()}`}
                        variant="outline-primary" 
                        size="sm"
                        className="mt-2"
                      >
                        {language === "yo" ? "Ṣèwádìí" : "Explore"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      {/* All Topics Grid View */}
      <div className="mt-5 pt-5 border-top">
        <h3 className="mb-4">
          {language === "yo" ? "Gbogbo Àwọn Ọ̀ràn" : "All Topics"}
        </h3>
        <Row className="g-4">
          {topics.map(topic => (
            <Col xs={6} sm={4} md={3} lg={2} key={topic.id}>
              <div className="text-center p-3 border rounded hover-shadow">
                <div className={`text-${topic.color} mb-2`}>
                  {React.cloneElement(topic.icon, { size: 30 })}
                </div>
                <div className="fw-bold small">
                  {language === "yo" ? topic.nameYo : topic.nameEn}
                </div>
                <Badge bg="light" text="dark" className="mt-1">
                  {topic.count}
                </Badge>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default Topics;