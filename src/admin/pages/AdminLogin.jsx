// src/admin/pages/AdminLogin.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import { LanguageContext } from '../../context/LanguageContext';
import api from '../../services/api';
import '../styles/admin.css';
// ./AdminLogin.css

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Check if user is admin
        if (!['admin', 'editor'].includes(response.data.user.role)) {
          setError(language === 'yo' 
            ? 'Àléébù rẹ kò ní àṣẹ fún ibi ìṣàkóso.' 
            : 'Your account does not have admin privileges.');
          localStorage.clear();
          return;
        }
        
        // Redirect to admin dashboard
        navigate('/admin');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
        (language === 'yo' 
          ? 'Àṣìṣe ìwé-àṣẹ. Jọ̀wọ́ ṣe àyẹ̀wò àwọn ìkọ̀lé rẹ.' 
          : 'Login failed. Please check your credentials.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">
            {language === 'yo' ? 'Ìmọ̀ Ìjìnlẹ̀ ní Yorùbá' : 'Science in Yorùbá'}
          </h1>
          <p className="lead text-muted">
            {language === 'yo' 
              ? 'Ibi Ìṣàkóso Olùṣàkóso' 
              : 'Administrator Control Panel'}
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <Card className="shadow border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="login-icon mb-3">
                    <FaLock size={40} className="text-primary" />
                  </div>
                  <h3 className="fw-bold">
                    {language === 'yo' ? 'Ìwé-àṣẹ' : 'Admin Login'}
                  </h3>
                  <p className="text-muted small">
                    {language === 'yo' 
                      ? 'Tẹ àwọn ìkọ̀lé inú rẹ sí ibi yìí' 
                      : 'Enter your credentials below'}
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="text-center">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">
                      <FaEnvelope className="me-1" />
                      {language === 'yo' ? 'Imeeli' : 'Email Address'}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={language === 'yo' ? 'imẹẹli@apẹẹrẹ.com' : 'email@example.com'}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">
                      <FaLock className="me-1" />
                      {language === 'yo' ? 'Ọ̀rọ̀ìgbaniwọlé' : 'Password'}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        {language === 'yo' ? 'Ó ń ṣe...' : 'Signing in...'}
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" />
                        {language === 'yo' ? 'Bẹ̀rẹ̀ Ìwé-àṣẹ' : 'Sign In'}
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link 
                      to="/" 
                      className="text-decoration-none small text-muted"
                    >
                      ← {language === 'yo' ? 'Padà sí ilé' : 'Back to Homepage'}
                    </Link>
                  </div>
                </Form>

                <div className="mt-4 pt-3 border-top text-center">
                  <small className="text-muted">
                    {language === 'yo' 
                      ? 'Ṣe o ní ìṣòro? Kan si: support@scienceinyoruba.org' 
                      : 'Need help? Contact: support@scienceinyoruba.org'}
                  </small>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <div className="login-info bg-light p-3 rounded">
                <h6 className="fw-bold mb-2">
                  {language === 'yo' ? 'Àwọn Ìkọ̀lé Ìbẹ̀rẹ̀' : 'Default Credentials'}
                </h6>
                <p className="mb-1 small">
                  <strong>Email:</strong> admin@scienceinyoruba.org
                </p>
                <p className="mb-0 small">
                  <strong>Password:</strong> admin123
                </p>
                <p className="mt-2 text-danger small">
                  {language === 'yo' ? 'Jọ̀wọ́ yí àwọn padà ìkọ̀lé wọ̀nyí lẹ́yìn ìwé-àṣẹ àkọ́kọ́!' 
                    : 'Please change these credentials after first login!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminLogin;