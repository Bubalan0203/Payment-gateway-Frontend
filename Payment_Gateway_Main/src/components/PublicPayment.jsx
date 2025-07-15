import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';
import { Modal, Button as BSButton } from 'react-bootstrap';
import OTPFlow from 'raj-otp';

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

export default function PublicPayment() {
  const { code, amount } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',
    phoneNumber: ''
  });

  const [integrationValid, setIntegrationValid] = useState(false);
  const [modal, setModal] = useState({ show: false, success: false, message: '' });
  const [showOTP, setShowOTP] = useState(false); // 🔒 OTP flow disabled

  const queryParams = new URLSearchParams(location.search);
  const returnUrl = queryParams.get('returnUrl');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

const handleSubmit = async e => {
  e.preventDefault();

  try {
    const res = await api.post(`/public/pay/${code}/${amount}`, form);
    navigate('/payment/receipt', {
      state: {
        transactionId: res.data?.transaction?._id || Math.random().toString(36).substring(2),
        ...form,
        amount,
        status: 'Success',
        timestamp: new Date().toLocaleString(),
        merchant: res.data?.merchantName || 'Merchant',
        reference: res.data?.reference || Math.random().toString(36).substring(2, 10).toUpperCase(),
        returnUrl: returnUrl || null
      }
    });
  } catch (err) {
    const reason = err.response?.data?.error || 'Transaction failed';

    if (returnUrl) {
      // 🔁 Redirect to returnUrl with failure status and reason
      try {
        const url = returnUrl.startsWith('http')
          ? new URL(returnUrl)
          : new URL(`${window.location.origin}${returnUrl}`);

        url.searchParams.append('status', 'Failed');
        url.searchParams.append('reason', reason);
        url.searchParams.append('amount', amount);
        url.searchParams.append('timestamp', new Date().toISOString());

        window.location.href = url.toString();
      } catch (error) {
        console.error('❌ Invalid returnUrl format:', returnUrl);
        alert(reason);
        navigate('/');
      }
    } else {
      // If no returnUrl, fallback to homepage with optional state
      navigate('/', {
        state: {
          status: 'Failed',
          reason
        }
      });
    }
  }
};

  // 🔒 OTP complete handler (not used now)
  /*
  const handleOTPComplete = async (data) => {
    if (data.stage === 'verified') {
      try {
        const res = await api.post(`/public/pay/${code}/${amount}`, form);
        navigate('/payment/receipt', {
          state: {
            transactionId: res.data?.transaction?._id || Math.random().toString(36).substring(2),
            ...form,
            amount,
            status: 'Success',
            timestamp: new Date().toLocaleString(),
            merchant: res.data?.merchantName || 'Merchant',
            reference: res.data?.reference || Math.random().toString(36).substring(2, 10).toUpperCase(),
            returnUrl: returnUrl || null
          }
        });
      } catch (err) {
        navigate(returnUrl || '/', {
          state: {
            status: 'Failed',
            reason: err.response?.data?.error || 'OTP Verified but transaction failed.'
          }
        });
      }
    } else if (data.stage === 'error') {
      alert('❌ OTP verification failed or expired. Transaction aborted.');
      navigate(returnUrl || '/', {
        state: {
          status: 'Failed',
          reason: 'OTP verification failed'
        }
      });
    }
  };
  */

  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    navigate('/');
  };

  if (!integrationValid)
    return <h5 className="text-danger text-center mt-4">This merchant is not active or code is invalid.</h5>;

return (
  <Wrapper>
    {showOTP ? (
      <FormCard>
        <Title>Verifying OTP</Title>
        <OTPFlow
          secretKey="9D941AF69FAA5E041172D29A8B459BB4"
          apiEndpoint="http://10.34.231.43:3002/api/check-otp-availability"
          // onComplete={handleOTPComplete}
          initialTheme="light"
        />
      </FormCard>
    ) : (
      <FormCard>
        <Title>Enter Payment Details</Title>
        <Subtitle>Fill in your bank details to proceed with ₹{amount}</Subtitle>

        <form onSubmit={handleSubmit}>
          <Label>Amount (₹)</Label>
          <Input type="text" value={amount} readOnly disabled />

          <Label>Bank Name</Label>
          <Input
            name="bankName"
            placeholder="Enter your bank name"
            value={form.bankName}
            onChange={handleChange}
            required
          />

          <Label>Account Holder Name</Label>
          <Input
            name="accountHolderName"
            placeholder="Enter the account holder's name"
            value={form.accountHolderName}
            onChange={handleChange}
            required
          />

          <Label>Account Number</Label>
          <Input
            name="accountNumber"
            placeholder="Enter your bank account number"
            value={form.accountNumber}
            onChange={handleChange}
            required
          />

          <Label>IFSC Code</Label>
          <Input
            name="ifsc"
            placeholder="Enter IFSC code"
            value={form.ifsc}
            onChange={handleChange}
            required
          />

          <Label>Phone Number</Label>
          <Input
            name="phoneNumber"
            placeholder="Enter your mobile number"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />

          <SubmitButton type="submit">Continue to Pay</SubmitButton>
        </form>
      </FormCard>
    )}

    <Modal
      show={modal.show}
      onHide={handleModalClose}
      centered
      backdrop="static"
    >
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