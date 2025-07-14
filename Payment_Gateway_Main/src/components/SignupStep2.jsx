import React, { useState } from 'react';
import styled from 'styled-components';

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
  margin-bottom: 1.2rem;
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

const NextButton = styled(Button)`
  background: linear-gradient(to right, #7c3aed, #9333ea);
`;

export default function SignupStep2({ formData, setFormData, next, back }) {
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const { bankName, accountHolderName, bankAccountNumber, ifsc } = formData;
    const newErrors = {};

    if (!bankName?.trim()) newErrors.bankName = 'Bank name is required';

    if (!accountHolderName?.trim())
      newErrors.accountHolderName = 'Account holder name is required';

    if (!bankAccountNumber)
      newErrors.bankAccountNumber = 'Bank account number is required';
    else if (!/^\d{9,18}$/.test(bankAccountNumber))
      newErrors.bankAccountNumber = 'Enter a valid account number (9–18 digits)';

    if (!ifsc)
      newErrors.ifsc = 'IFSC code is required';
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase()))
      newErrors.ifsc = 'Enter a valid IFSC code (e.g., SBIN0001234)';

    return newErrors;
  };

  const handleNext = e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setFormData({
        ...formData,
        ifsc: formData.ifsc.toUpperCase()
      });
      next();
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Step 2: Bank Details</Title>
        <form onSubmit={handleNext}>
          <Input
            name="bankName"
            value={formData.bankName || ''}
            onChange={handleChange}
            placeholder="Bank Name"
          />
          {errors.bankName && <ErrorText>{errors.bankName}</ErrorText>}

          <Input
            name="accountHolderName"
            value={formData.accountHolderName || ''}
            onChange={handleChange}
            placeholder="Account Holder Name"
          />
          {errors.accountHolderName && <ErrorText>{errors.accountHolderName}</ErrorText>}

          <Input
            name="bankAccountNumber"
            value={formData.bankAccountNumber || ''}
            onChange={handleChange}
            placeholder="Bank Account Number"
          />
          {errors.bankAccountNumber && <ErrorText>{errors.bankAccountNumber}</ErrorText>}

          <Input
            name="ifsc"
            value={formData.ifsc || ''}
            onChange={handleChange}
            placeholder="IFSC Code (e.g., SBIN0001234)"
          />
          {errors.ifsc && <ErrorText>{errors.ifsc}</ErrorText>}

          <ButtonGroup>
            <BackButton type="button" onClick={back}>Back</BackButton>
            <NextButton type="submit">Next</NextButton>
          </ButtonGroup>
        </form>
      </Card>
    </Wrapper>
  );
}