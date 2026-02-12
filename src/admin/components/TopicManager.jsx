import React, { useState, useEffect, useContext } from "react";
import { 
  Table, Button, Modal, Form, InputGroup, Badge, Alert, Spinner,
  Card, Row, Col 
} from "react-bootstrap";
import { 
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaPalette, FaSortNumericDown, 
  FaStar, FaBook, FaFlask, FaAtom, FaMicroscope, FaSeedling, FaGlobe, 
  FaLightbulb, FaBrain, FaDna, FaHeartbeat, FaWater, FaFire, FaWind, 
  FaSun, FaMoon, FaCloud, FaMountain, FaTree, FaRobot, FaMobileAlt,
  FaDesktop, FaWifi, FaSatellite, FaRocket, FaShieldAlt, FaMedkit,
  FaPizzaSlice, FaCar, FaPlane, FaShip, FaTrain, FaBicycle, FaRunning,
  FaMusic, FaPaintBrush, FaCamera, FaVideo, FaGamepad, FaGraduationCap,
  FaChalkboardTeacher, FaCalculator, FaChartBar, FaMap, FaCompass,
  FaQuestionCircle
} from "react-icons/fa";
import { LanguageContext } from "../../context/LanguageContext";
import api from "../../services/api";

// Icon options with their proper React components
const iconOptions = [
  // Science & Education
  { name: "FaBook", component: FaBook, label: "Book" },
  { name: "FaFlask", component: FaFlask, label: "Chemistry" },
  { name: "FaAtom", component: FaAtom, label: "Physics" },
  { name: "FaMicroscope", component: FaMicroscope, label: "Microscope" },
  { name: "FaSeedling", component: FaSeedling, label: "Biology" },
  { name: "FaDna", component: FaDna, label: "Genetics" },
  { name: "FaBrain", component: FaBrain, label: "Neuroscience" },
  { name: "FaHeartbeat", component: FaHeartbeat, label: "Medicine" },
  
  // Earth & Nature
  { name: "FaGlobe", component: FaGlobe, label: "Earth" },
  { name: "FaTree", component: FaTree, label: "Ecology" },
  { name: "FaWater", component: FaWater, label: "Water" },
  { name: "FaFire", component: FaFire, label: "Fire" },
  { name: "FaWind", component: FaWind, label: "Wind" },
  { name: "FaSun", component: FaSun, label: "Sun" },
  { name: "FaMoon", component: FaMoon, label: "Moon" },
  { name: "FaCloud", component: FaCloud, label: "Cloud" },
  { name: "FaMountain", component: FaMountain, label: "Mountain" },
  
  // Technology
  { name: "FaLightbulb", component: FaLightbulb, label: "Light/Energy" },
  { name: "FaRobot", component: FaRobot, label: "Robotics" },
  { name: "FaDesktop", component: FaDesktop, label: "Computer" },
  { name: "FaMobileAlt", component: FaMobileAlt, label: "Mobile" },
  { name: "FaWifi", component: FaWifi, label: "Internet" },
  { name: "FaSatellite", component: FaSatellite, label: "Satellite" },
  { name: "FaRocket", component: FaRocket, label: "Space" },
  
  // Transportation
  { name: "FaCar", component: FaCar, label: "Car" },
  { name: "FaPlane", component: FaPlane, label: "Plane" },
  { name: "FaShip", component: FaShip, label: "Ship" },
  { name: "FaTrain", component: FaTrain, label: "Train" },
  { name: "FaBicycle", component: FaBicycle, label: "Bicycle" },
  
  // Health & Sports
  { name: "FaMedkit", component: FaMedkit, label: "First Aid" },
  { name: "FaRunning", component: FaRunning, label: "Sports" },
  
  // Arts & Entertainment
  { name: "FaMusic", component: FaMusic, label: "Music" },
  { name: "FaPaintBrush", component: FaPaintBrush, label: "Art" },
  { name: "FaCamera", component: FaCamera, label: "Photography" },
  { name: "FaVideo", component: FaVideo, label: "Video" },
  { name: "FaGamepad", component: FaGamepad, label: "Gaming" },
  
  // Education Tools
  { name: "FaGraduationCap", component: FaGraduationCap, label: "Graduation" },
  { name: "FaChalkboardTeacher", component: FaChalkboardTeacher, label: "Teaching" },
  { name: "FaCalculator", component: FaCalculator, label: "Math" },
  { name: "FaChartBar", component: FaChartBar, label: "Statistics" },
  { name: "FaMap", component: FaMap, label: "Geography" },
  { name: "FaCompass", component: FaCompass, label: "Navigation" },
  
  // Default
  { name: "FaQuestionCircle", component: FaQuestionCircle, label: "Default" }
];

// Icon mapping function
const getIconComponent = (iconName, size = 24, color = "currentColor") => {
  const iconOption = iconOptions.find(opt => opt.name === iconName);
  const IconComponent = iconOption ? iconOption.component : FaQuestionCircle;
  return <IconComponent size={size} color={color} />;
};

const TopicManager = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { language } = useContext(LanguageContext);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingTopic, setEditingTopic] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: { yo: "", en: "" },
    description: { yo: "", en: "" },
    category: "physics",
    icon: "FaBook",
    color: "#3498db",
    order: 0,
    isFeatured: false
  });

  // Fetch topics
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await api.get("/topics");
      if (response.data.success) {
        setTopics(response.data.topics);
      }
    } catch (err) {
      setError(language === "yo" 
        ? "Àṣìṣe ní gbígbà àwọn ọ̀ràn" 
        : "Error fetching topics");
      console.error("Error fetching topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {fetchTopics();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent],
          [child]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      name: { yo: "", en: "" },
      description: { yo: "", en: "" },
      category: "physics",
      icon: "FaBook", color: "#3498db",
      order: topics.length, isFeatured: false
    });
    setShowModal(true);
  };

  const handleEdit = (topic) => {
    setModalMode("edit");
    setFormData({
      name: { yo: topic.name.yo, en: topic.name.en },
      description: { 
        yo: topic.description?.yo || "",  en: topic.description?.en || "" 
      },
      category: topic.category || "physics",
      icon: topic.icon || "FaBook",
      color: topic.color || "#3498db",
      order: topic.order || 0,
      isFeatured: topic.isFeatured || false
    });
    setEditingTopic(topic);
    setShowModal(true);
  };

  const handleDelete = async (topicId) => {
    if (!window.confirm(language === "yo" ? "Ṣe o da ọ́ lọ́kàn pé o fẹ́ pa ọ̀ràn yìí rẹ?" 
      : "Are you sure you want to delete this topic?")) {
      return;
    }

    try {
      await api.delete(`/topics/${topicId}`);
      setSuccess(language === "yo" ? "Ọ̀ràn ti parẹ!" : "Topic deleted successfully!");
      fetchTopics();
    } catch (err) {
      setError(err.response?.data?.error || 
        (language === "yo" ? "Àṣìṣe ní piparẹ ọ̀ràn" : "Error deleting topic"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === "create") {
        await api.post("/topics", formData);
        setSuccess(language === "yo" 
          ? "Ọ̀ràn tuntun ti dá sílẹ̀!" 
          : "New topic created successfully!");
      } else {
        await api.put(`/topics/${editingTopic._id}`, formData);
        setSuccess(language === "yo" ? "Ọ̀ràn ti ṣàtúnṣe!" : "Topic updated successfully!");
      }
      
      setShowModal(false);
      fetchTopics();
    } catch (err) {
      setError(err.response?.data?.error || 
        (language === "yo" ? "Àṣìṣe ní ifipamọ́ ọ̀ràn" : "Error saving topic"));
    }
  };

  // Render topic icon in the grid
  const renderTopicIcon = (topic, size = 40) => {
    return getIconComponent(topic.icon, size, topic.color);
  };

  return (
    <div className="topic-manager">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-2">
            {language === "yo" ? "Àwọn Ọ̀ràn" : "Topics"}
          </h1>
          <p className="text-muted mb-0">
            {language === "yo" ? "Ṣàkóso àwọn ẹ̀ka ìmọ̀ ìjìnlẹ̀" : "Manage science topics and categories"}
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={handleCreate}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" />
          {language === "yo" ? "Ọ̀ràn Tuntun" : "New Topic"}
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}

      {/* Topics Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">{language === "yo" ? "Ó ń ṣe..." : "Loading topics..."}</p>
        </div>
      ) : topics.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <FaBook size={48} className="text-muted mb-3" />
            <h5>{language === "yo" ? "Kò Sí Ọ̀ràn" : "No Topics Found"}</h5>
            <p className="text-muted mb-4">
              {language === "yo" ? "Kọ àwọn ọ̀ràn àkọ́kọ́ rẹ láti bẹ̀rẹ̀" 
                : "Create your first topics to get started"}
            </p>
            <Button variant="primary" onClick={handleCreate}>
              {language === "yo" ? "Kọ Ọ̀ràn Àkọ́kọ́" : "Create First Topic"}
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {topics.map(topic => (
            <Col key={topic._id} md={6} lg={4} xl={3} className="mb-4">
              <Card className="h-100 border-0 shadow-sm hover-shadow">
                <Card.Body className="d-flex flex-column p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="topic-icon">
                      {renderTopicIcon(topic, 48)}
                    </div>
                    <div className="text-end">
                      {topic.isFeatured && (
                        <Badge bg="warning" className="mb-2 d-inline-flex align-items-center">
                          <FaStar className="me-1" size={12} />
                          {language === "yo" ? "Pàtàkì" : "Featured"}
                        </Badge>
                      )}
                      <div className="mt-2">
                        <Badge bg="light" text="dark" className="fw-normal">
                          {topic.articleCount || 0} {language === "yo" ? "àkọ́ọ́lẹ̀" : "articles"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="fw-bold mb-2">
                    {language === "yo" ? topic.name.yo : topic.name.en}
                  </h5>
                  
                  {topic.description && (topic.description.yo || topic.description.en) && (
                    <p className="text-muted small flex-grow-1 mb-3">
                      {language === "yo" && topic.description.yo 
                        ? topic.description.yo 
                        : (topic.description.en || "")}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted d-flex align-items-center">
                        <FaSortNumericDown className="me-1" />
                        {topic.order || 0}
                      </small>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEdit(topic)}
                          title={language === "yo" ? "Ṣàtúnṣe" : "Edit"}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(topic._id)}
                          title={language === "yo" ? "Parẹ" : "Delete"}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "create"  
              ? (language === "yo" ? "Ọ̀ràn Tuntun" : "New Topic")
              : (language === "yo" ? "Ṣàtúnṣe Ọ̀ràn" : "Edit Topic")}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-primary">
                    {language === "yo" ? "Ẹ̀ka Ìmọ̀ Ìjìnlẹ̀" : "Scientific Category"} *
                  </Form.Label>
                  <Form.Select name="category" value={formData.category} onChange={handleInputChange}
                    required>
                    <option value="physics">Physics (Físíksì)</option>
                    <option value="biology">Biology (Báyólójì)</option>
                    <option value="chemistry">Chemistry (Kẹ́místrì)</option>
                    <option value="earth">Earth Science (Ilẹ̀ Ayé)</option>
                    <option value="technology">Technology (Ẹ̀rọ Ìgbàlódé)</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    {language ==="yo" ? "Èyí yóò so ọ̀rọ̀ yìí pọ̀ mọ́ àwọn àkọ́ọ́lẹ̀ rẹ." 
                    : "This links this topic to your article filters."}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {language === "yo" ? "Àpèjúwe (Yorùbá)" : "Description (Yorùbá)"}
                  </Form.Label>
                  <Form.Control
                    as="textarea" 
                    rows={2}
                    name="description.yo" 
                    value={formData.description.yo}
                    onChange={handleInputChange}
                    placeholder={language === "yo" ? "Àpèjúwe kúkúrú nípa ọ̀ràn yìí" 
                      : "Brief description about this topic"}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {language === "yo" ? "Àpèjúwe (Gẹ̀ẹ́sì)" : "Description (English)"}
                  </Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={2}
                    name="description.en" 
                    value={formData.description.en}
                    onChange={handleInputChange}
                    placeholder="Brief description about this topic"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaPalette className="me-2" />
                    {language === "yo" ? "Àmì" : "Icon"}
                  </Form.Label>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="me-3">
                        {getIconComponent(formData.icon, 36, formData.color)}
                      </div>
                      <div>
                        <small className="text-muted">
                          {language === "yo" ? "Yàn àmì:" : "Selected icon:"} 
                          <span className="ms-2 fw-bold">
                            {iconOptions.find(opt => opt.name === formData.icon)?.label || formData.icon}
                          </span>
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="icon-grid mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <div className="d-flex flex-wrap gap-2">
                      {iconOptions.map((opt) => {
                        const Icon = opt.component;
                        return (
                          <Button 
                            key={opt.name}
                            variant={formData.icon === opt.name ? "primary" : "outline-secondary"}
                            onClick={() => setFormData({ ...formData, icon: opt.name })}
                            className="p-2 d-flex flex-column align-items-center"
                            style={{ width: "60px", height: "60px" }}
                            title={opt.label}
                          >
                            <Icon size={20} className="mb-1" />
                            <small style={{ fontSize: "9px" }}>{opt.label.substring(0, 8)}</small>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <InputGroup>
                    <InputGroup.Text>
                      <FaPalette />
                    </InputGroup.Text>
                    <Form.Control
                      name="icon" 
                      value={formData.icon}
                      onChange={handleInputChange} 
                      placeholder="FaBook"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    {language === "yo" ? "Àwọ̀" : "Color"}
                  </Form.Label>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div 
                      className="rounded border"
                      style={{width: "40px", height: "40px",
                        backgroundColor: formData.color, border: "1px solid #dee2e6"
                      }}
                    />
                    <div className="flex-grow-1">
                      <Form.Control type="color" name="color"
                        value={formData.color} onChange={handleInputChange}
                        className="mb-1"
                      />
                      <Form.Control name="color" value={formData.color}
                        onChange={handleInputChange} placeholder="#3498db"
                      />
                    </div>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold d-flex align-items-center">
                    <FaSortNumericDown className="me-2" />
                    {language === "yo" ? "Ìtò" : "Order"}
                  </Form.Label>
                  <Form.Control 
                    type="number" 
                    name="order" 
                    value={formData.order}
                    onChange={handleInputChange} 
                    min="0"
                  />
                  <Form.Text className="text-muted">
                    {language === "yo" ? "0 ni àkọ́kọ́" : "0 is first"}
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    id="isFeatured" 
                    name="isFeatured"
                    label={
                      <span className="d-flex align-items-center">
                        <FaStar className="me-2" />
                        {language === "yo" ? "Ṣe é pàtàkì" : "Mark as Featured"}
                      </span>
                    }
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    {language === "yo" ? "Àwọn ọ̀ràn pàtàkì máa hàn ní ojúewé ilé" 
                      : "Featured topics appear on the homepage"}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <FaTimes className="me-2" />
              {language === "yo" ? "Fagilé" : "Cancel"}
            </Button>
            <Button type="submit" variant="primary">
              <FaSave className="me-2" />
              {modalMode === "create" 
                ? (language === "yo" ? "Dá Sí" : "Create") 
                : (language === "yo" ? "Ṣàtúnṣe" : "Update")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicManager;