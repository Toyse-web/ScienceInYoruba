// src/pages/Articles.jsx
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Spinner } from "react-bootstrap";
import { useSearchParams, Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { FaSearch, FaCalendar, FaUser, FaBookOpen, FaFilter } from "react-icons/fa";
import api from "../services/api";

const Articles = () => {
  const { language } = useContext(LanguageContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // State for real data
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Get category from url
  const categoryFilter = searchParams.get("category") || "all";

  // Fetch articles from backend
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await api.get("/articles", {
          params: {
            category: categoryFilter !== "all" ? categoryFilter : undefined,
            search: searchTerm || undefined
          }
        });
        if (response.data.success) {
          setArticles(response.data.articles);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryFilter, searchTerm]); // Re-run when category or search changes

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSearchParams({ category: val }); // Updates URL
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">
        {language === "yo" ? "Àwọn Àkọ́ọ́lẹ̀" : "Articles"}
      </h1>
      
      <p className="lead mb-4">
        {language === "yo" 
          ? "Kà àwọn àkọ́ọ́lẹ̀ ìmọ̀ ìjìnlẹ̀ ní èdè Yorùbá" 
          : "Read science articles in Yorùbá language"}
      </p>

      {/* Search and Filter */}
      <Row className="mb-5">
        <Col md={8}>
          <InputGroup className="mb-3">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder={language === "yo" ? "Ṣàwárí àkọ́ọ́lẹ̀..." : "Search articles..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><FaFilter /></InputGroup.Text>
            <Form.Select value={categoryFilter} onChange={handleCategoryChange}>
              <option value="all">{language === "yo" ? "Gbogbo rẹ̀" : "All Categories"}</option>
              <option value="physics">{language === "yo" ? "physics" : "Físíksì"}</option>
              <option value="biology">{language === "yo" ? "biology" : "Báyólójì"}</option>
              <option value="chemistry">{language === "yo" ? "chemistry" : "Kẹ́místrì"}</option>
              <option value="earth">{language === "yo" ? "earth" : "Ilẹ̀ Ayé" }</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
      <Row>
        {articles.length === 0 ? (
          <Col className="text-center"><h5>{language === "yo" ? "Kò sí àpilẹ̀kọ nínú ẹ̀ka yìí" : "No articles found in this category."}</h5></Col>
        ) : (
          articles.map(article => (
            <Col lg={6} key={article-id} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow">
                <Card.Body>
                      <Card.Title>{language === 'yo' ? article.title.yo : article.title.en}</Card.Title>
                      <Button as={Link} to={`/articles/${article._id || article.slug.en}`}>
                         {language === 'yo' ? 'Kà Síwájú' : 'Read More'}
                      </Button>
                   </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      )}
    </Container>
  );
};

export default Articles;