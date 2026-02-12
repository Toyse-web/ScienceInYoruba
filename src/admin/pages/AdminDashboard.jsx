// src/admin/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { 
  FaNewspaper, 
  FaBook, 
  FaUsers, 
  FaEye, 
  FaChartLine,
  FaCalendarAlt,
  FaUserCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalTopics: 0,
    totalUsers: 0
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, articlesRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/articles/featured/latest')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.dashboard.stats);
        setRecentArticles(statsRes.data.dashboard.recentArticles || []);
      }
      
      if (articlesRes.data.success && !recentArticles.length) {
        setRecentArticles(articlesRes.data.articles);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: language === 'yo' ? 'Gbogbo Àkọ́ọ́lẹ̀' : 'Total Articles',
      value: stats.totalArticles,
      icon: <FaNewspaper />,
      color: 'primary',
      link: '/admin/articles'
    },
    {
      title: language === 'yo' ? 'Àkọ́ọ́lẹ̀ Tí A Tẹ̀' : 'Published Articles',
      value: stats.publishedArticles,
      icon: <FaEye />,
      color: 'success',
      link: '/admin/articles?status=published'
    },
    {
      title: language === 'yo' ? 'Àkọ́ọ́lẹ̀ Ìṣẹ́ṣe' : 'Draft Articles',
      value: stats.draftArticles,
      icon: <FaExclamationCircle />,
      color: 'warning',
      link: '/admin/articles?status=draft'
    },
    {
      title: language === 'yo' ? 'Àwọn Ọ̀ràn' : 'Topics',
      value: stats.totalTopics,
      icon: <FaBook />,
      color: 'info',
      link: '/admin/topics'
    },
    {
      title: language === 'yo' ? 'Àwọn Oníṣe' : 'Users',
      value: stats.totalUsers,
      icon: <FaUsers />,
      color: 'secondary',
      link: '/admin/users'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      published: 'success',
      draft: 'warning',
      archived: 'secondary'
    };
    
    const labels = {
      published: language === 'yo' ? 'Tí A Tẹ̀' : 'Published',
      draft: language === 'yo' ? 'Ìṣẹ́ṣe' : 'Draft',
      archived: language === 'yo' ? 'Ìfi Sí' : 'Archived'
    };
    
    return (
      <Badge bg={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header mb-4">
        <h1 className="h2 fw-bold">
          {language === 'yo' ? 'Dáshíbọ́ọ̀dù' : 'Dashboard'}
        </h1>
        <p className="text-muted">
          {language === 'yo' 
            ? 'Àkíyèsí gbogbo ohun tí ó ń ṣẹlẹ̀ nínú àwòrán' 
            : 'Overview of everything happening in your website'}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">{language === 'yo' ? 'Ó ń ṣe...' : 'Loading dashboard...'}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <Row className="mb-4">
            {statCards.map((card, index) => (
              <Col key={index} xs={12} sm={6} lg={3} className="mb-3">
                <Card className={`border-0 shadow-sm bg-${card.color}-subtle`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title text-muted mb-2">{card.title}</h6>
                        <h2 className="fw-bold mb-0">{card.value}</h2>
                      </div>
                      <div className={`text-${card.color} display-6`}>
                        {card.icon}
                      </div>
                    </div>
                    <Button 
                      as={Link}
                      to={card.link}
                      variant={`outline-${card.color}`}
                      size="sm"
                      className="mt-3 w-100"
                    >
                      {language === 'yo' ? 'Wo Gbogbo Rẹ̀' : 'View All'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Recent Articles Table */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <FaCalendarAlt className="me-2" />
                  {language === 'yo' ? 'Àwọn Àkọ́ọ́lẹ̀ Tuntun' : 'Recent Articles'}
                </h5>
                <Button 
                  as={Link}
                  to="/admin/articles"
                  variant="outline-primary"
                  size="sm"
                >
                  {language === 'yo' ? 'Wo Gbogbo Rẹ̀' : 'View All'}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentArticles.length > 0 ? (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>{language === 'yo' ? 'Àkọ́lé' : 'Title'}</th>
                      <th>{language === 'yo' ? 'Olùkọ̀wé' : 'Author'}</th>
                      <th>{language === 'yo' ? 'Ọjọ́' : 'Date'}</th>
                      <th>{language === 'yo' ? 'Ìwòye' : 'Views'}</th>
                      <th>{language === 'yo' ? 'Ipò' : 'Status'}</th>
                      <th>{language === 'yo' ? 'Ìṣe' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentArticles.map((article) => (
                      <tr key={article._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {article.featuredImage && (
                              <img 
                                src={article.featuredImage} 
                                alt="" 
                                className="me-2 rounded"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <div className="fw-bold">
                                {language === 'yo' ? article.title?.yo : article.title?.en}
                              </div>
                              <small className="text-muted">
                                {article.category}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaUserCircle className="me-2" />
                            {article.author?.name || 'Unknown'}
                          </div>
                        </td>
                        <td>
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <Badge bg="info">
                            {article.views || 0}
                          </Badge>
                        </td>
                        <td>
                          {getStatusBadge(article.status)}
                        </td>
                        <td>
                          <Button
                            as={Link}
                            to={`/admin/articles/${article._id}/edit`}
                            variant="outline-primary"
                            size="sm"
                          >
                            {language === 'yo' ? 'Ṣàtúnṣe' : 'Edit'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <FaBook size={48} className="text-muted mb-3" />
                  <h5>{language === 'yo' ? 'Kò Sí Àkọ́ọ́lẹ̀' : 'No Articles Yet'}</h5>
                  <p className="text-muted">
                    {language === 'yo' 
                      ? 'Kọ àkọ́ọ́lẹ̀ àkọ́kọ́ rẹ̀!' 
                      : 'Create your first article!'}
                  </p>
                  <Button 
                    as={Link}
                    to="/admin/articles/new"
                    variant="primary"
                  >
                    {language === 'yo' ? 'Kọ Àkọ́ọ́lẹ̀ Tuntun' : 'Create New Article'}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <FaChartLine className="me-2" />
                {language === 'yo' ? 'Ìṣe Ní Kíákíá' : 'Quick Actions'}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <Button 
                    as={Link}
                    to="/admin/articles/new"
                    variant="primary"
                    className="w-100 py-3"
                  >
                    <FaNewspaper className="me-2" />
                    {language === 'yo' ? 'Kọ Àkọ́ọ́lẹ̀ Tuntun' : 'Create New Article'}
                  </Button>
                </Col>
                <Col md={4} className="mb-3">
                  <Button 
                    as={Link}
                    to="/admin/topics"
                    variant="success"
                    className="w-100 py-3"
                  >
                    <FaBook className="me-2" />
                    {language === 'yo' ? 'Ṣàtúnṣe Àwọn Ọ̀ràn' : 'Manage Topics'}
                  </Button>
                </Col>
                <Col md={4} className="mb-3">
                  <Button 
                    as={Link}
                    to="/admin/media"
                    variant="info"
                    className="w-100 py-3"
                  >
                    <FaEye className="me-2" />
                    {language === 'yo' ? 'Wo Àwọn Fáìlì' : 'View Media Files'}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;