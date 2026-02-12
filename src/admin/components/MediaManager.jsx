// src/admin/components/MediaManager.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { Card, Button, Row, Col, Form, InputGroup, Alert, Spinner,
    Modal, Badge, Dropdown, ProgressBar } from "react-bootstrap";
import { FaUpload, FaSearch, FaImage, FaVideo, FaMusic, FaFile, FaTrash,
    FaEye, FaCopy, FaFolder, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { LanguageContext } from "../../context/LanguageContext";
import api from "../../services/api";

const MediaManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const { language } = useContext(LanguageContext);
  
  const fileInputRef = useRef(null);

  // Mock files data - in real app, fetch from API
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get("/media");
      // setFiles(response.data.files);
      
      // Mock data for now
      setTimeout(() => {
        const mockFiles = [
          {
            id: 1,
            name: "science-lab.jpg",
            url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
            type: "image",
            size: "2.4 MB",
            uploaded: "2024-12-15",
            dimensions: "1920x1080"
          },
          {
            id: 2,
            name: "yoruba-pronunciation.mp3",
            url: "https://example.com/audio.mp3",
            type: "audio",
            size: "4.1 MB",
            uploaded: "2024-12-10",
            duration: "2:30"
          },
          {
            id: 3,
            name: "chemistry-experiment.mp4",
            url: "https://example.com/video.mp4",
            type: "video",
            size: "15.2 MB",
            uploaded: "2024-12-05",
            dimensions: "1280x720"
          },
          {
            id: 4,
            name: "physics-diagram.png",
            url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
            type: "image",
            size: "1.8 MB",
            uploaded: "2024-12-01",
            dimensions: "1600x900"
          },
          {
            id: 5,
            name: "biology-lesson.pdf",
            url: "https://example.com/document.pdf",
            type: "document",
            size: "3.2 MB",
            uploaded: "2024-11-28"
          }
        ];
        setFiles(mockFiles);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(language === "yo" 
        ? "Àṣìṣe ní gbígbà àwọn fáìlì" 
        : "Error fetching files");
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const selected = event.target.files;
    if (selected.length > 0) {
      handleUpload(selected);
    }
  };

  const handleUpload = async (files) => {
    setUploading(true);
    setUploadProgress(0);
    
    // Mock upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // TODO: Replace with actual API upload
      // const formData = new FormData();
      // Array.from(files).forEach(file => {
      //   formData.append("files", file);
      // });
      // await api.post("/media/upload", formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = Math.round(
      //       (progressEvent.loaded * 100) / progressEvent.total
      //     );
      //     setUploadProgress(percentCompleted);
      //   }
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setSuccess(language === "yo" 
        ? "Àwọn fáìlì ti gbé lọ sókè!" 
        : "Files uploaded successfully!");
      
      // Refresh files list
      fetchFiles();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(language === "yo" 
        ? "Àṣìṣe ní gbígbe fáìlì lọ sókè" 
        : "Error uploading files");
      clearInterval(interval);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm(language === "yo" 
      ? "Ṣe o da ọ́ lọ́kàn pé o fẹ́ parẹ fáìlì yìí?" 
      : "Are you sure you want to delete this file?")) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await api.delete(`/media/${fileId}`);
      
      // Mock delete
      setFiles(prev => prev.filter(file => file.id !== fileId));
      
      setSuccess(language === "yo" 
        ? "Fáìlì ti parẹ!" 
        : "File deleted successfully!");
    } catch (err) {
      setError(language === "yo" 
        ? "Àṣìṣe ní piparẹ fáìlì" 
        : "Error deleting file");
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess(language === "yo" 
      ? "URL ti dá kó pẹ̀lú àṣeyọrí!" 
      : "URL copied successfully!");
  };

  const toggleFileSelection = (fileId) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const deleteSelected = () => {
    if (selectedFiles.size === 0) return;
    
    if (window.confirm(language === "yo" 
      ? `Ṣe o da ọ́ lọ́kàn pé o fẹ́ parẹ àwọn fáìlì ${selectedFiles.size} yìí?` 
      : `Are you sure you want to delete ${selectedFiles.size} files?`)) {
      
      setFiles(prev => prev.filter(file => !selectedFiles.has(file.id)));
      setSelectedFiles(new Set());
      setSuccess(language === "yo" 
        ? "Àwọn fáìlì ti parẹ!" 
        : "Files deleted successfully!");
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image": return <FaImage className="text-primary" />;
      case "video": return <FaVideo className="text-danger" />;
      case "audio": return <FaMusic className="text-success" />;
      default: return <FaFile className="text-secondary" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const fileTypes = [
    { value: "all", label: language === "yo" ? "Gbogbo Rẹ̀" : "All Types" },
    { value: "image", label: language === "yo" ? "Àwòrán" : "Images" },
    { value: "video", label: language === "yo" ? "Fídíò" : "Videos" },
    { value: "audio", label: language === "yo" ? "Orin" : "Audio" },
    { value: "document", label: language === "yo" ? "Ìwé" : "Documents" }
  ];

  return (
    <div className="media-manager">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-2">
            {language === "yo" ? "Àwọn Fáìlì" : "Media Files"}
          </h1>
          <p className="text-muted mb-0">
            {language === "yo" 
              ? "Ṣàkóso àwọn àwòrán, fídíò, àti orin fún àwọn àkọ́ọ́lẹ̀" 
              : "Manage images, videos, and audio files for articles"}
          </p>
        </div>
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

      {/* Upload Area */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="text-center p-5">
          <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
            <FaCloudUploadAlt size={60} className="text-primary mb-3" />
            <h5 className="mb-2">
              {language === "yo" ? "Fá fáìlì sí ibi yìí" : "Drag & drop files here"}
            </h5>
            <p className="text-muted mb-4">
              {language === "yo" 
                ? "Tàbí tẹ̀ láti yan fáìlì láti ẹ̀rọ rẹ" 
                : "Or click to select files from your device"}
            </p>
            <Button variant="primary" size="lg">
              <FaUpload className="me-2" />
              {language === "yo" ? "Yan Àwọn Fáìlì" : "Select Files"}
            </Button>
            <p className="text-muted small mt-3">
              {language === "yo" 
                ? "JPG, PNG, GIF, MP4, MP3, PDF títí dé 50MB" 
                : "JPG, PNG, GIF, MP4, MP3, PDF up to 50MB"}
            </p>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            style={{ display: "none" }}
            accept="image/*,video/*,audio/*,.pdf"
          />

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`}
                animated
                className="mb-2"
              />
              <p className="small text-muted mb-0">
                {language === "yo" 
                  ? "Ó ń gbé fáìlì lọ sókè..." 
                  : "Uploading files..."}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder={language === "yo" ? "Ṣàwárí fáìlì..." : "Search files..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFolder />
                </InputGroup.Text>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {fileTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-danger" 
                onClick={deleteSelected}
                disabled={selectedFiles.size === 0}
                className="w-100"
              >
                <FaTrash className="me-2" />
                {language === "yo" ? "Parẹ" : "Delete"} ({selectedFiles.size})
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Files Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">{language === "yo" ? "Ó ń ṣe..." : "Loading files..."}</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <FaImage size={48} className="text-muted mb-3" />
            <h5>{language === "yo" ? "Kò Sí Fáìlì" : "No Files Found"}</h5>
            <p className="text-muted mb-4">
              {searchTerm 
                ? (language === "yo" 
                    ? "Kò sí fáìlì tó bá ìwádìí rẹ dára" 
                    : "No files match your search")
                : (language === "yo" 
                    ? "Bẹ̀rẹ̀ pẹ̀lú gbígbe fáìlì àkọ́kọ́ rẹ lọ sókè" 
                    : "Start by uploading your first file")}
            </p>
            <Button 
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
            >
              {language === "yo" ? "Gbé Fáìlì Lọ Sókè" : "Upload File"}
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredFiles.map(file => (
            <Col key={file.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className={`file-card border-0 shadow-sm ${selectedFiles.has(file.id) ? "selected" : ""}`}>
                <div className="file-checkbox">
                  <Form.Check
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                  />
                </div>
                
                <div 
                  className="file-preview" 
                  onClick={() => handlePreview(file)}
                  style={{ cursor: "pointer" }}
                >
                  {file.type === "image" ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="file-icon-preview d-flex align-items-center justify-content-center bg-light" style={{ height: "150px" }}>
                      {getFileIcon(file.type)}
                      <h4 className="ms-2 mb-0">{file.type.toUpperCase()}</h4>
                    </div>
                  )}
                </div>
                
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="file-info">
                      <h6 className="file-name fw-bold mb-1 text-truncate" title={file.name}>
                        {file.name}
                      </h6>
                      <div className="d-flex align-items-center text-muted small">
                        {getFileIcon(file.type)}
                        <span className="ms-2">{file.size}</span>
                      </div>
                    </div>
                    <Badge bg="light" text="dark" className="file-type">
                      {file.type}
                    </Badge>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {new Date(file.uploaded).toLocaleDateString()}
                    </small>
                    <div className="file-actions">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => copyToClipboard(file.url)}
                        title={language === "yo" ? "Dá URL kó" : "Copy URL"}
                      >
                        <FaCopy />
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handlePreview(file)}
                        title={language === "yo" ? "Wo" : "Preview"}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        title={language === "yo" ? "Parẹ" : "Delete"}
                        className="text-danger"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* File Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{previewFile?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewFile && (
            <div className="text-center">
              {previewFile.type === "image" ? (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "500px" }}
                />
              ) : previewFile.type === "video" ? (
                <video 
                  controls 
                  className="w-100 rounded"
                  style={{ maxHeight: "500px" }}
                >
                  <source src={previewFile.url} type="video/mp4" />
                  {language === "yo" 
                    ? "Ẹ̀rọ rẹ kò ṣàtìlẹ́yìn fídíò" 
                    : "Your browser does not support the video tag."}
                </video>
              ) : previewFile.type === "audio" ? (
                <div className="p-4">
                  <FaMusic size={60} className="text-primary mb-3" />
                  <audio controls className="w-100">
                    <source src={previewFile.url} type="audio/mpeg" />
                    {language === "yo" 
                      ? "Ẹ̀rọ rẹ kò ṣàtìlẹ́yìn orin" 
                      : "Your browser does not support the audio tag."}
                  </audio>
                </div>
              ) : (
                <div className="p-4">
                  <FaFile size={60} className="text-secondary mb-3" />
                  <p>
                    {language === "yo" 
                      ? "Ìwé àkọsílẹ̀: " 
                      : "Document: "}
                    {previewFile.name}
                  </p>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-light rounded">
                <Row>
                  <Col md={6}>
                    <p className="mb-1">
                      <strong>{language === "yo" ? "Orúkọ:" : "Name:"}</strong> {previewFile.name}
                    </p>
                    <p className="mb-1">
                      <strong>{language === "yo" ? "Ìwọn:" : "Size:"}</strong> {previewFile.size}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <strong>{language === "yo" ? "Irú:" : "Type:"}</strong> {previewFile.type}
                    </p>
                    <p className="mb-1">
                      <strong>{language === "yo" ? "Ọjọ́:" : "Date:"}</strong> {new Date(previewFile.uploaded).toLocaleDateString()}
                    </p>
                  </Col>
                </Row>
                
                <InputGroup className="mt-3">
                  <Form.Control
                    value={previewFile.url}
                    readOnly
                  />
                  <Button 
                    variant="primary"
                    onClick={() => copyToClipboard(previewFile.url)}
                  >
                    <FaCopy className="me-2" />
                    {language === "yo" ? "Dá URL Kó" : "Copy URL"}
                  </Button>
                </InputGroup>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            {language === "yo" ? "Pa" : "Close"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MediaManager;