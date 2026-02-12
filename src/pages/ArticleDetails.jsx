// src/pages/ArticleDetail.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { LanguageContext } from "../context/LanguageContext";
import { FaArrowLeft, FaCalendar, FaUser, FaBookOpen, FaShareAlt, FaPrint } from "react-icons/fa";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchArticle = () => {
      setLoading(true);
      setTimeout(() => {
        const mockArticles = {
          1: {
            id: 1,
            titleYo: "Bí Ìmọ́lẹ̀ Ṣe ń ṣiṣẹ́",
            titleEn: "How Light Works",
            contentYo: `Ìmọ́lẹ̀ jẹ́ ohun tí a lè rí tí ó sì ń tàn káàkiri. Ó wà lára àwọn ohun tí a ń pè ní agbára ìtanna. Ìmọ́lẹ̀ ń lọ kiri ní ọ̀nà tí a ń pè ní igun onírúurú...

            ## Àwọn Iru Ìmọ́lẹ̀
            1. Ìmọ́lẹ̀ Oòrùn - tí ó ti ọ̀rùn wá
            2. Ìmọ́lẹ̀ Iná - tí ó ti iná wá
            3. Ìmọ́lẹ̀ Búlùù - tí a ń lò fún ìtọ́sọ́nà
            
            ## Bí Ó Ṣe ń Lọ Kiri
            Ìmọ́lẹ̀ ń lọ kiri ní iyì tó tó 299,792,458 mita ní ọgọ́ọ̀rùn-kejì. Bí ó bá dé ohun kan, ó lè:
            - Tàn kọjá (transparent)
            - Dà sí ẹ̀yìn (reflect)
            - Gba (absorb)`,
            contentEn: `Light is something we can see that travels around. It is one of the things we call electromagnetic energy. Light travels in what we call waves...

            ## Types of Light
            1. Sunlight - coming from the sun
            2. Firelight - coming from fire
            3. Blue Light - used for navigation
            
            ## How It Travels
            Light travels at a speed of 299,792,458 meters per second. When it hits an object, it can:
            - Pass through (transparent)
            - Bounce back (reflect)
            - Be taken in (absorb)`,
            category: "physics",
            categoryYo: "Físíksì",
            categoryEn: "Physics",
            author: "Ọ̀jọ̀gbọ́n Adéwálé",
            date: "2024-12-15",
            readTime: 5,
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            tags: ["Ìmọ́lẹ̀", "Ìtanna", "Ìlọkiri"],
            tagsEn: ["Light", "Electricity", "Travel"]
          }
        };

        const foundArticle = mockArticles[id];
        if (foundArticle) {
          setArticle(foundArticle);
          setError(null);
        } else {
          setError("Article not found");
        }
        setLoading(false);
      }, 1000);
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">{language === "yo" ? "Ó ń ṣe..." : "Loading..."}</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {language === "yo" ? "Àkọ́ọ́lẹ̀ yìí kò sí" : "Article not found"}
        </Alert>
        <Button variant="primary" onClick={() => navigate("/articles")}>
          {language === "yo" ? "Padà sí Àwọn Àkọ́ọ́lẹ̀" : "Back to Articles"}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate("/articles")}
        className="mb-4"
      >
        <FaArrowLeft className="me-2" />
        {language === "yo" ? "Padà sí Àwọn Àkọ́ọ́lẹ̀" : "Back to Articles"}
      </Button>

      <Row>
        <Col lg={8}>
          {/* Article Header */}
          <div className="mb-4">
            <Badge bg="primary" className="mb-3">
              {language === "yo" ? article.categoryYo : article.categoryEn}
            </Badge>
            <h1 className="fw-bold mb-3">
              {language === "yo" ? article.titleYo : article.titleEn}
            </h1>
            
            <div className="d-flex flex-wrap gap-3 text-muted mb-4">
              <span><FaUser className="me-1" /> {article.author}</span>
              <span><FaCalendar className="me-1" /> {article.date}</span>
              <span><FaBookOpen className="me-1" /> {article.readTime} {language === "yo" ? "ìṣẹ́jú" : "min read"}</span>
            </div>

            {/* Article Image */}
            <div 
              className="mb-4 rounded" 
              style={{
                height: "400px",
                backgroundImage: `url(${article.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          </div>

          {/* Article Content */}
          <div className="mb-5">
            <div className="article-content" style={{ lineHeight: "1.8" }}>
              {language === "yo" 
                ? article.contentYo.split("\n").map((para, idx) => (
                    <p key={idx} className="mb-3">{para}</p>
                  ))
                : article.contentEn.split("\n").map((para, idx) => (
                    <p key={idx} className="mb-3">{para}</p>
                  ))
              }
            </div>
          </div>

          {/* Tags */}
          <div className="mb-5">
            <h5 className="mb-3">{language === "yo" ? "Àwọn Àmì" : "Tags"}</h5>
            <div className="d-flex flex-wrap gap-2">
              {(language === "yo" ? article.tags : article.tagsEn).map((tag, idx) => (
                <Badge key={idx} bg="light" text="dark" className="p-2">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mb-5">
            <Button variant="outline-primary">
              <FaShareAlt className="me-2" />
              {language === "yo" ? "Pín" : "Share"}
            </Button>
            <Button variant="outline-secondary">
              <FaPrint className="me-2" />
              {language === "yo" ? "Tẹ̀" : "Print"}
            </Button>
          </div>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: "20px" }}>
            <div className="card shadow-sm border-0 p-4 mb-4">
              <h5 className="mb-3">{language === "yo" ? "Àwọn Àkọ́ọ́lẹ̀ Míràn" : "Related Articles"}</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <a href="#" className="text-decoration-none">
                    <strong>{language === "yo" ? "Ìwọ̀n Ìmọ́lẹ̀" : "Light Measurement"}</strong>
                    <div className="small text-muted">{language === "yo" ? "Físíksì • 3 ìṣẹ́jú" : "Physics • 3 min"}</div>
                  </a>
                </li>
                <li className="mb-3">
                  <a href="#" className="text-decoration-none">
                    <strong>{language === "yo" ? "Ìtanna" : "Electricity"}</strong>
                    <div className="small text-muted">{language === "yo" ? "Físíksì • 6 ìṣẹ́jú" : "Physics • 6 min"}</div>
                  </a>
                </li>
                <li className="mb-3">
                  <a href="#" className="text-decoration-none">
                    <strong>{language === "yo" ? "Ìlọkiri Agbára" : "Energy Travel"}</strong>
                    <div className="small text-muted">{language === "yo" ? "Físíksì • 4 ìṣẹ́jú" : "Physics • 4 min"}</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ArticleDetail;