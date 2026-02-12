// src/admin/components/ArticleList.jsx
import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Badge, Form, InputGroup, Dropdown, Modal, 
    Spinner, Alert, Pagination, Card } from "react-bootstrap";
import { FaSearch, FaFilter,  FaEdit, FaTrash, FaEye, FaPlus, FaSort,
    FaCalendarAlt, FaUserCircle, FaTag } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import api from "../../services/api";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useContext(LanguageContext);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: searchParams.get("status") || "all",
    category: searchParams.get("category") || "all",
    page: parseInt(searchParams.get("page")) || 1,
    limit: 20,
    sort: "-createdAt"
  });

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1
  });

  // Fetch articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.category !== "all") params.append("category", filters.category);
      params.append("page", filters.page);
      params.append("limit", filters.limit);
      params.append("sort", filters.sort);

      const response = await api.get(`/admin/articles?${params}`);
      
      if (response.data.success) {
        setArticles(response.data.articles);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(language === "yo" ? "Àṣìṣe ní gbígbà àwọn àkọ́ọ́lẹ̀" 
        : "Error fetching articles");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // Update URL params
    const params = new URLSearchParams();
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.page > 1) params.set("page", filters.page);
    setSearchParams(params);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/articles/${articleToDelete._id}`);
      setShowDeleteModal(false);
      setArticleToDelete(null);
      fetchArticles(); // Refresh list
    } catch (err) {
      setError(language === "yo" ? "Àṣìṣe ní piparẹ àkọ́ọ́lẹ̀" : "Error deleting article");
    }
  };

  const updateArticleStatus = async (articleId, newStatus) => {
    try {
      await api.put(`/admin/articles/${articleId}/status`, { status: newStatus });
      fetchArticles(); // Refresh list
    } catch (err) {
      setError(language === "yo" ? "Àṣìṣe ní ìyípadà ipò" : "Error updating status");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      published: "success",
      draft: "warning",
      archived: "secondary"
    };
    
    const labels = {
      published: language === "yo" ? "Tí A Tẹ̀" : "Published",
      draft: language === "yo" ? "Ìṣẹ́ṣe" : "Draft",
      archived: language === "yo" ? "Ìfi Sí" : "Archived"
    };
    
    return (
      <Badge bg={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const statusOptions = [
    { value: "all", label: language === "yo" ? "Gbogbo Ipò" : "All Status" },
    { value: "published", label: language === "yo" ? "Tí A Tẹ̀" : "Published" },
    { value: "draft", label: language === "yo" ? "Ìṣẹ́ṣe" : "Draft" },
    { value: "archived", label: language === "yo" ? "Ìfi Sí" : "Archived" }
  ];

  const categoryOptions = [
    { value: "all", label: language === "yo" ? "Gbogbo Ẹ̀ka" : "All Categories" },
    { value: "physics", label: language === "yo" ? "Físíksì" : "Physics" },
    { value: "biology", label: language === "yo" ? "Báyólójì" : "Biology" },
    { value: "chemistry", label: language === "yo" ? "Kẹ́místrì" : "Chemistry" },
    { value: "earth", label: language === "yo" ? "Ilẹ̀ Ayé" : "Earth Science" },
    { value: "technology", label: language === "yo" ? "Ẹ̀rọ" : "Technology" }
  ];

  const sortOptions = [
    { value: "-createdAt", label: language === "yo" ? "Tuntun Sí" : "Newest First" },
    { value: "createdAt", label: language === "yo" ? "Àtijọ́ Sí" : "Oldest First" },
    { value: "-views", label: language === "yo" ? "Ìwòye Púpọ̀" : "Most Viewed" },
    { value: "title.en", label: language === "yo" ? "Àkọ́lé (A-Y)" : "Title (A-Z)" }
  ];

  return (
    <div className="article-list">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-2">
            {language === "yo" ? "Àwọn Àkọ́ọ́lẹ̀" : "Articles"}
          </h1>
          <p className="text-muted mb-0">
            {language === "yo" ? "Ṣàkóso gbogbo àwọn àkọ́ọ́lẹ̀ ìmọ̀ ìjìnlẹ̀" : "Manage all science articles"}
          </p>
        </div>
        <Button 
          as={Link}
          to="/admin/articles/new"
          variant="primary"
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" />
          {language === "yo" ? "Àkọ́ọ́lẹ̀ Tuntun" : "New Article"}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder={language === "yo" ? "Ṣàwárí àkọ́ọ́lẹ̀..." : "Search articles..."}
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="col-md-3">
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </div>
            <div className="col-md-3">
              <InputGroup>
                <InputGroup.Text>
                  <FaTag />
                </InputGroup.Text>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </div>
            <div className="col-md-3">
              <InputGroup>
                <InputGroup.Text>
                  <FaSort />
                </InputGroup.Text>
                <Form.Select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Articles Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">{language === "yo" ? "Ó ń ṣe..." : "Loading articles..."}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-5">
              <FaSearch size={48} className="text-muted mb-3" />
              <h5>{language === "yo" ? "Kò Sí Àkọ́ọ́lẹ̀" : "No Articles Found"}</h5>
              <p className="text-muted mb-4">
                {language === "yo" ? "Kò sí àkọ́ọ́lẹ̀ tó bá àwọn àṣàyàn rẹ dára" 
                  : "No articles match your filters"}
              </p>
              <Button 
                as={Link}
                to="/admin/articles/new"
                variant="primary"
              >
                {language === "yo" ? "Kọ Àkọ́ọ́lẹ̀ Àkọ́kọ́ Rẹ" : "Create Your First Article"}
              </Button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: "40%" }}>
                        {language === "yo" ? "Àkọ́lé" : "Article"}
                      </th>
                      <th>{language === "yo" ? "Olùkọ̀wé" : "Author"}</th>
                      <th>{language === "yo" ? "Ọjọ́" : "Date"}</th>
                      <th>{language === "yo" ? "Ipò" : "Status"}</th>
                      <th>{language === "yo" ? "Ìṣe" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(article => (
                      <tr key={article._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {article.featuredImage && (
                              <img 
                                src={article.featuredImage} 
                                alt="" 
                                className="me-3 rounded"
                                style={{ 
                                  width: "60px", 
                                  height: "40px", 
                                  objectFit: "cover" 
                                }}
                              />
                            )}
                            <div>
                              <div className="fw-bold">
                                {language === "yo" ? article.title?.yo : article.title?.en}
                              </div>
                              <div className="small text-muted">
                                {article.category} • {article.readTime || 5} min
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaUserCircle className="me-2 text-muted" />
                            <span>{article.author?.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="me-2 text-muted" />
                            <span className="small">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {getStatusBadge(article.status)}
                            <Badge bg="info" className="ms-2">
                              {article.views || 0} {language === "yo" ? "ìwòye" : "views"}
                            </Badge>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              as={Link}
                              to={`/articles/${article._id}`}
                              variant="outline-primary"
                              size="sm"
                              target="_blank"
                              title={language === "yo" ? "Wo ní ojúewé" : "View on site"}
                            >
                              <FaEye />
                            </Button>
                            <Button
                              as={Link}
                              to={`/admin/articles/${article._id}/edit`}
                              variant="outline-success"
                              size="sm"
                              title={language === "yo" ? "Ṣàtúnṣe" : "Edit"}
                            >
                              <FaEdit />
                            </Button>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="outline-secondary"
                                size="sm"
                                id="status-dropdown">{language === "yo" ? "Ipò" : "Status"}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item 
                                  onClick={() => updateArticleStatus(article._id, "draft")}
                                >
                                  {language === "yo" ? "Ṣe Ìṣẹ́ṣe" : "Set as Draft"}
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => updateArticleStatus(article._id, "published")}
                                >
                                  {language === "yo" ? "Tẹ̀ jáde" : "Publish"}
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => updateArticleStatus(article._id, "archived")}
                                >
                                  {language === "yo" ? "Fi Sí" : "Archive"}
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteClick(article)}
                              title={language === "yo" ? "Parẹ" : "Delete"}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="border-top p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      {language === "yo" 
                        ? `Àwọn ${articles.length} nínú ${pagination.total} àkọ́ọ́lẹ̀` 
                        : `Showing ${articles.length} of ${pagination.total} articles`}
                    </div>
                    <Pagination className="mb-0">
                      <Pagination.Prev 
                        disabled={filters.page === 1}
                        onClick={() => handleFilterChange("page", filters.page - 1)}
                      />
                      {[...Array(pagination.pages).keys()].map(num => (
                        <Pagination.Item
                          key={num + 1}
                          active={num + 1 === filters.page}
                          onClick={() => handleFilterChange("page", num + 1)}
                        >
                          {num + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next 
                        disabled={filters.page === pagination.pages}
                        onClick={() => handleFilterChange("page", filters.page + 1)}
                      />
                    </Pagination>
                  </div>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "yo" ? "Ìparẹ Àkọ́ọ́lẹ̀" : "Delete Article"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {language === "yo" 
            ? `Ṣe o da ọ́ lọ́kàn pé o fẹ́ parẹ àkọ́ọ́lẹ̀ "${
                articleToDelete?.title?.[language] || articleToDelete?.title?.en
              }"? Kò ní ṣeé ṣàgbàgbọ padà.`
            : `Are you sure you want to delete "${
                articleToDelete?.title?.[language] || articleToDelete?.title?.en
              }"? This action cannot be undone.`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {language === "yo" ? "Fagilé" : "Cancel"}
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            {language === "yo" ? "Bẹ́ẹ̀ ni, Parẹ" : "Yes, Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ArticleList;