import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';
import { Modal, Button as BSButton } from 'react-bootstrap';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to right, #ede9fe, #f5f3ff);
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-weight: 700;
  color: #4c1d95;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const Label = styled.label`
  display: block;
  text-align: left;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #8b5cf6;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #7c3aed;
  }
`;

const ErrorScreen = styled.div`
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
  max-width: 500px;
`;

const ErrorText = styled.p`
  font-size: 1.1rem;
  color: #b91c1c;
  margin-top: 1rem;
`;

export default function PublicPayment() {
  const { code, amount } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: '', accountNumber: '', ifsc: '' });
  const [integrationValid, setIntegrationValid] = useState(false);
  const [modal, setModal] = useState({ show: false, success: false, message: '' });

  const queryParams = new URLSearchParams(location.search);
  const returnUrl = queryParams.get('returnUrl');
  const parsedAmount = parseFloat(amount);

  useEffect(() => {
    const checkIntegration = async () => {
      try {
        await api.get(`/public/integration/${code}`);
        setIntegrationValid(true);
      } catch (err) {
        alert(err.response?.data?.error || 'Invalid integration link');
        navigate('/');
      }
    };
    checkIntegration();
  }, [code, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔴 Check max limit
  if (parsedAmount > 100000) {
    const message = `Amount ₹${amount} exceeds the ₹1,00,000 limit.`;

    if (returnUrl) {
      const redirectUrl = new URL(returnUrl);
      redirectUrl.searchParams.set('status', 'failed');
      redirectUrl.searchParams.set('message', message);
      redirectUrl.searchParams.set('amount', amount);
      redirectUrl.searchParams.set('timestamp', new Date().toISOString());
      window.location.href = redirectUrl.toString();
    }

    return (
      <Wrapper>
        <ErrorScreen>
          <Title>Transaction Blocked</Title>
          <ErrorText>{message}</ErrorText>
        </ErrorScreen>
      </Wrapper>
    );
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post(`/public/pay/${code}/${amount}`, form);

      navigate('/payment/receipt', {
        state: {
          transactionId: res.data?._id || Math.random().toString(36).substring(2),
          name: form.name,
          accountNumber: form.accountNumber,
          ifsc: form.ifsc,
          amount,
          status: 'Success',
          timestamp: new Date().toLocaleString(),
          merchant: res.data?.merchantName || 'Merchant',
          reference: res.data?.reference || Math.random().toString(36).substring(2, 10).toUpperCase(),
          returnUrl: returnUrl || null
        }
      });
    } catch (err) {
      setModal({
        show: true,
        success: false,
        message: err.response?.data?.error || 'Payment failed'
      });
    }
  };

  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    navigate('/');
  };

  if (!integrationValid)
    return <h5 className="text-danger text-center mt-4">This merchant is not active or code is invalid.</h5>;

  return (
    <Wrapper>
      <FormCard>
        <Title>Enter Payment Details</Title>
        <Subtitle>Fill in your bank details to proceed with ₹{amount}</Subtitle>

        <form onSubmit={handleSubmit}>
          <Label>Amount (₹)</Label>
          <Input type="text" value={amount} readOnly disabled />

          <Label>Your Name</Label>
          <Input
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
          />

          <Label>Account Number</Label>
          <Input
            name="accountNumber"
            placeholder="Enter your bank account number"
            onChange={handleChange}
            required
          />

          <Label>IFSC Code</Label>
          <Input
            name="ifsc"
            placeholder="Enter IFSC code"
            onChange={handleChange}
            required
          />

          <SubmitButton type="submit">Continue to Pay</SubmitButton>
        </form>
      </FormCard>

      <Modal show={modal.show} onHide={handleModalClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{modal.success ? 'Success' : 'Failed'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.message}</Modal.Body>
        <Modal.Footer>
          <BSButton
            variant={modal.success ? 'success' : 'danger'}
            onClick={handleModalClose}
          >
            Close
          </BSButton>
        </Modal.Footer>
      </Modal>
    </Wrapper>
  );
}