// src/admin/components/ArticleForm.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner,Tabs,Tab,
    Badge, InputGroup } from 'react-bootstrap';
import { FaSave, FaTimes, FaEye, FaUpload, FaLink, FaTag, FaClock, FaLanguage } from 'react-icons/fa';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import api from '../../services/api';

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language: currentLanguage } = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [topics, setTopics] = useState([]);
  
  const isEditMode = id && id !== 'new';

  // Article form state
  const [article, setArticle] = useState({
    title: { yo: '', en: '' }, content: { yo: '', en: '' },
    category: 'physics', topic: '', readTime: 5, status: 'draft',
    tags: [], featuredImage: '', audioUrl: '', videoUrl: '', slug: { yo: '', en: '' }
  });

  // Tag input
  const [tagInput, setTagInput] = useState({ yo: '', en: '' });
  const [activeTab, setActiveTab] = useState(currentLanguage === 'yo' ? 'yo' : 'en');

  // Fetch article data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch topics for dropdown
        const topicsRes = await api.get('/topics');
        if (topicsRes.data.success) {
          setTopics(topicsRes.data.topics);
        }

        // Fetch article if editing
        if (isEditMode) {
          const articleRes = await api.get(`/admin/articles/${id}`);
          if (articleRes.data.success) {
            setArticle(articleRes.data.article);
          }
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setArticle(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setArticle(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.yo.trim() && tagInput.en.trim()) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, { yo: tagInput.yo.trim(), en: tagInput.en.trim() }]
      }));
      setTagInput({ yo: '', en: '' });
    }
  };

  const handleRemoveTag = (index) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleTitleChange = (lang, value) => {
    setArticle(prev => ({
      ...prev,
      title: { ...prev.title, [lang]: value },
      slug: { 
        ...prev.slug, 
        [lang]: generateSlug(value) 
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let response;
      
      if (isEditMode) {
        response = await api.put(`/articles/${id}`, article);
      } else {
        response = await api.post('/articles', article);
      }

      if (response.data.success) {
        setSuccess(
          currentLanguage === 'yo' 
            ? `Àkọ́ọ́lẹ̀ ${isEditMode ? 'tí a ṣàtúnṣe' : 'tuntun'} tí a fi pamọ́!` 
            : `Article ${isEditMode ? 'updated' : 'created'} successfully!`
        );
        
        // Redirect to articles list after 2 seconds
        setTimeout(() => {
          navigate('/admin/articles');
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        (currentLanguage === 'yo' 
          ? 'Àṣìṣe ní ifipamọ́ àkọ́ọ́lẹ̀' 
          : 'Error saving article')
      );
      console.error('Error saving article:', err);
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = [
    { value: 'physics', label: currentLanguage === 'yo' ? 'Físíksì' : 'Physics' },
    { value: 'biology', label: currentLanguage === 'yo' ? 'Báyólójì' : 'Biology' },
    { value: 'chemistry', label: currentLanguage === 'yo' ? 'Kẹ́místrì' : 'Chemistry' },
    { value: 'earth', label: currentLanguage === 'yo' ? 'Ilẹ̀ Ayé' : 'Earth Science' },
    { value: 'technology', label: currentLanguage === 'yo' ? 'Ẹ̀rọ' : 'Technology' }
  ];

  const statusOptions = [
    { value: 'draft', label: currentLanguage === 'yo' ? 'Ìṣẹ́ṣe' : 'Draft' },
    { value: 'published', label: currentLanguage === 'yo' ? 'Tí A Tẹ̀' : 'Published' },
    { value: 'archived', label: currentLanguage === 'yo' ? 'Ìfi Sí' : 'Archived' }
  ];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">
          {currentLanguage === 'yo' ? 'Ó ń ṣe...' : 'Loading...'}
        </p>
      </Container>
    );
  }

  return (
    <div className="article-form">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-2">
            {isEditMode 
              ? (currentLanguage === 'yo' ? 'Ṣàtúnṣe Àkọ́ọ́lẹ̀' : 'Edit Article')
              : (currentLanguage === 'yo' ? 'Àkọ́ọ́lẹ̀ Tuntun' : 'New Article')}
          </h1>
          <p className="text-muted mb-0">
            {currentLanguage === 'yo' ? 'Kọ tabi ṣàtúnṣe àkọ́ọ́lẹ̀ ìmọ̀ ìjìnlẹ̀ ní èdè Yorùbá' 
              : 'Create or edit science article in Yorùbá language'}
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            as={Link}
            to="/admin/articles"
            variant="outline-secondary"
          >
            <FaTimes className="me-2" />
            {currentLanguage === 'yo' ? 'Fagilé' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                {currentLanguage === 'yo' ? 'Ó ń ṣe...' : 'Saving...'}
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                {isEditMode 
                  ? (currentLanguage === 'yo' ? 'Ṣàtúnṣe' : 'Update')
                  : (currentLanguage === 'yo' ? 'Fi Pamọ́' : 'Save')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* Language Tabs */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4"
                >
                  <Tab eventKey="yo" title={
                    <span className="d-flex align-items-center">
                      <FaLanguage className="me-2" />
                      Yorùbá
                    </span>
                  }>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        {currentLanguage === 'yo' ? 'Àkọ́lé (Yorùbá)' : 'Title (Yorùbá)'}
                      </Form.Label>
                      <Form.Control
                        name="title.yo"
                        value={article.title.yo}
                        onChange={(e) => handleTitleChange('yo', e.target.value)}
                        placeholder={currentLanguage === 'yo' 
                          ? 'Àkọ́lé àkọ́ọ́lẹ̀ rẹ ní èdè Yorùbá' 
                          : 'Your article title in Yorùbá'}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        {currentLanguage === 'yo' ? 'Àkọọ́lẹ̀ (Yorùbá)' : 'Content (Yorùbá)'}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={12}
                        name="content.yo"
                        value={article.content.yo}
                        onChange={handleChange}
                        placeholder={currentLanguage === 'yo' ? 'Kọ àkọọ́lẹ̀ rẹ ní èdè Yorùbá nibi...' 
                          : 'Write your content in Yorùbá here...'}
                        required
                      />
                      <Form.Text className="text-muted">
                        {currentLanguage === 'yo' ? 'Lo markdown fún ìwúrí dáradára (## fún àkọlé, **fún ìdámọ̀, etc.)' 
                          : 'Use markdown for rich formatting (## for headings, **for bold, etc.)'}
                      </Form.Text>
                    </Form.Group>
                  </Tab>

                  <Tab eventKey="en" title={
                    <span className="d-flex align-items-center">
                      <FaLanguage className="me-2" />
                      English
                    </span>
                  }>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        {currentLanguage === 'yo' ? 'Àkọ́lé (Gẹ̀ẹ́sì)' : 'Title (English)'}
                      </Form.Label>
                      <Form.Control
                        name="title.en"
                        value={article.title.en}
                        onChange={(e) => handleTitleChange('en', e.target.value)}
                        placeholder={currentLanguage === 'yo' ? 'Àkọ́lé àkọ́ọ́lẹ̀ rẹ ní èdè Gẹ̀ẹ́sì' 
                          : 'Your article title in English'}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        {currentLanguage === 'yo' ? 'Àkọọ́lẹ̀ (Gẹ̀ẹ́sì)' : 'Content (English)'}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={12}
                        name="content.en"
                        value={article.content.en}
                        onChange={handleChange}
                        placeholder={currentLanguage === 'yo' ? 'Kọ àkọọ́lẹ̀ rẹ ní èdè Gẹ̀ẹ́sì nibi...' 
                          : 'Write your content in English here...'}
                        required
                      />
                    </Form.Group>
                  </Tab>
                </Tabs>

                {/* Slug Preview */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">
                    {currentLanguage === 'yo' ? 'Àwọn URL Wípé' : 'Generated URLs'}
                  </h6>
                  <div className="mb-2">
                    <small className="text-muted">Yorùbá:</small>
                    <div className="d-flex align-items-center">
                      <FaLink className="me-2 text-muted" />
                      <code>/articles/{article.slug.yo || 'your-slug-here'}</code>
                    </div>
                  </div>
                  <div>
                    <small className="text-muted">English:</small>
                    <div className="d-flex align-items-center">
                      <FaLink className="me-2 text-muted" />
                      <code>/articles/{article.slug.en || 'your-slug-here'}</code>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Settings Sidebar */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-white">
                <h6 className="mb-0 fw-bold">
                  {currentLanguage === 'yo' ? 'Ètò' : 'Settings'}
                </h6>
              </Card.Header>
              <Card.Body>
                {/* Category */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    {currentLanguage === 'yo' ? 'Ẹ̀ka' : 'Category'}
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={article.category}
                    onChange={handleChange}
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Topic */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    {currentLanguage === 'yo' ? 'Ọ̀ràn' : 'Topic'}
                  </Form.Label>
                  <Form.Select
                    name="topic"
                    value={article.topic}
                    onChange={handleChange}
                  >
                    <option value="">{currentLanguage === 'yo' ? 'Yan ọ̀ràn...' : 'Select topic...'}</option>
                    {topics.map(topic => (
                      <option key={topic._id} value={topic._id}>
                        {currentLanguage === 'yo' ? topic.name.yo : topic.name.en}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Status */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    {currentLanguage === 'yo' ? 'Ipò' : 'Status'}
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={article.status}
                    onChange={handleChange}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Read Time */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaClock className="me-2" />
                    {currentLanguage === 'yo' ? 'Ìwákà Ìká' : 'Read Time'}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      min="1"
                      name="readTime"
                      value={article.readTime}
                      onChange={handleChange}
                    />
                    <InputGroup.Text>
                      {currentLanguage === 'yo' ? 'ìṣẹ́jú' : 'minutes'}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Media Card */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-white">
                <h6 className="mb-0 fw-bold">
                  {currentLanguage === 'yo' ? 'Àwọn Mídíà' : 'Media'}
                </h6>
              </Card.Header>
              <Card.Body>
                {/* Featured Image */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    {currentLanguage === 'yo' ? 'Àwòrán Ìṣàfihàn' : 'Featured Image'}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="featuredImage"
                      value={article.featuredImage}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button variant="outline-secondary">
                      <FaUpload />
                    </Button>
                  </InputGroup>
                  {article.featuredImage && (
                    <div className="mt-2">
                      <img 
                        src={article.featuredImage} 
                        alt="Featured" 
                        className="img-fluid rounded"
                        style={{ maxHeight: '100px' }}
                      />
                    </div>
                  )}
                </Form.Group>

                {/* Audio URL */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    {currentLanguage === 'yo' ? 'URL Orin' : 'Audio URL'}
                  </Form.Label>
                  <Form.Control
                    name="audioUrl"
                    value={article.audioUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/audio.mp3"
                  />
                </Form.Group>

                {/* Video URL */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    {currentLanguage === 'yo' ? 'URL Fídíò' : 'Video URL'}
                  </Form.Label>
                  <Form.Control
                    name="videoUrl"
                    value={article.videoUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Tags Card */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white">
                <h6 className="mb-0 fw-bold">
                  <FaTag className="me-2" />
                  {currentLanguage === 'yo' ? 'Àwọn Àmì' : 'Tags'}
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="row g-2 mb-2">
                    <div className="col">
                      <Form.Control
                        placeholder={currentLanguage === 'yo' ? 'Àmì Yorùbá' : 'Yorùbá Tag'}
                        value={tagInput.yo}
                        onChange={(e) => setTagInput(prev => ({ ...prev, yo: e.target.value }))}
                      />
                    </div>
                    <div className="col">
                      <Form.Control
                        placeholder={currentLanguage === 'yo' ? 'Àmì Gẹ̀ẹ́sì' : 'English Tag'}
                        value={tagInput.en}
                        onChange={(e) => setTagInput(prev => ({ ...prev, en: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!tagInput.yo.trim() || !tagInput.en.trim()}
                  >
                    {currentLanguage === 'yo' ? 'Ìfikún Àmì' : 'Add Tag'}
                  </Button>
                </div>

                {/* Tags List */}
                <div className="tags-list">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-2 mb-2 p-2">
                      <span className="fw-bold">{tag.yo}</span>
                      <small className="text-muted ms-1">({tag.en})</small>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger p-0 ms-1"
                        onClick={() => handleRemoveTag(index)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                  {article.tags.length === 0 && (
                    <p className="text-muted small mb-0">
                      {currentLanguage === 'yo' ? 'Kò sí àmì. Fi àwọn àmì kún sílẹ̀ láti ṣe irọrun wíwá.' 
                        : 'No tags. Add tags to make search easier.'}
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ArticleForm;