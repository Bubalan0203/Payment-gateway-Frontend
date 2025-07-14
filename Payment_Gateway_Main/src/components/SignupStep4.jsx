import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  background: #f9f9fb;
  min-height: 100vh;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #4c1d95;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd6fe;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;

  &:focus {
    border-color: #8b5cf6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  margin: -0.8rem 0 1rem 0;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: white;
`;

const BackButton = styled(Button)`
  background: #6b7280;
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(to right, #7c3aed, #9333ea);
`;

export default function SignupStep4({ formData, setFormData, back }) {
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
const handleChange = e => {
  const { name, value } = e.target;

  // Strip all spaces from Aadhaar and PAN
  let cleanedValue = value;
  if (name === 'aadhaarCard' || name === 'panCard') {
    cleanedValue = value.replace(/\s+/g, '');
  }

  setFormData({ ...formData, [name]: cleanedValue });
  setErrors({ ...errors, [name]: '' }); // Clear error on change
};

  const validate = () => {
    const { panCard, aadhaarCard } = formData;
    const newErrors = {};

    if (!panCard)
      newErrors.panCard = 'PAN number is required';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panCard.toUpperCase()))
      newErrors.panCard = 'Enter a valid PAN (e.g., ABCDE1234F)';

    if (!aadhaarCard)
      newErrors.aadhaarCard = 'Aadhaar number is required';
    else if (!/^\d{12}$/.test(aadhaarCard))
      newErrors.aadhaarCard = 'Aadhaar must be 12 digits';

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
  name: formData.name,
  email: formData.email,
  password: formData.password,
  phone: formData.phone,
  securityQuestion: formData.securityQuestion,
  securityAnswer: formData.securityAnswer,
  bankAccountNumber: formData.bankAccountNumber,
  bankName: formData.bankName, // ✅ newly added
  accountHolderName: formData.accountHolderName, // ✅ newly added
  ifsc: formData.ifsc,
  address: {
    line1: formData.addressLine1,
    line2: formData.addressLine2,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    zip: formData.zip,
  },
  kyc: {
    panCardNumber: formData.panCard.toUpperCase(),
    aadhaarNumber: formData.aadhaarCard
  }
};
    setSubmitting(true);
    try {
      await api.post('/auth/signup', payload);
      alert('Signup successful. Admin will verify and activate your account.');
      navigate('/signup-success');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Step 4: KYC Details</Title>
        <form onSubmit={handleSubmit}>
          <Input
            name="panCard"
            value={formData.panCard}
            onChange={handleChange}
            placeholder="PAN Card Number"
          />
          {errors.panCard && <ErrorText>{errors.panCard}</ErrorText>}

          <Input
            name="aadhaarCard"
            value={formData.aadhaarCard}
            onChange={handleChange}
            placeholder="Aadhaar Number"
          />
          {errors.aadhaarCard && <ErrorText>{errors.aadhaarCard}</ErrorText>}

          <ButtonGroup>
            <BackButton type="button" onClick={back}>Back</BackButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </Card>
    </Wrapper>
  );
}