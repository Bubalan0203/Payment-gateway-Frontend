import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f3f4f6;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const Title = styled.h2`
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #111827;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4f46e5;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #4338ca;
  }
`;

export default function PaymentForm() {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return alert('Enter a valid amount');

    const integrationId = 'preethika@paygate';
    const returnUrl = `${window.location.origin}/payment-result`;
    window.location.href = `http://localhost:3000/payment/${integrationId}/${amount}?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  return (
    <Wrapper>
      <FormCard>
        <Title>Send a Payment</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
          />
          <SubmitButton type="submit">Proceed to Payment</SubmitButton>
        </form>
      </FormCard>
    </Wrapper>
  );
}