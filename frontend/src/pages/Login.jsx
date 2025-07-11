import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  InputGroup,
} from 'react-bootstrap';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Échec de la connexion');
      }

      const data = await res.json();
      // console.log('Tokens reçus:', data);
      localStorage.setItem('access_token', data.access || data.access_token);
      localStorage.setItem('refresh_token', data.refresh || data.refresh_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center bg-white">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Connexion</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </Button>
              </InputGroup>
            </Form.Group>

            <Button variant="" type="submit" className="w-100 bg-blue-600 text-white">
              Se connecter
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
