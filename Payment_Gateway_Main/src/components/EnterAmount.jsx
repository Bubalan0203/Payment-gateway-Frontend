import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 420px;
  margin: 6rem auto;
  background: #ffffff;
  padding: 2.25rem 2rem 2.75rem;
  border-radius: 16px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.06);
  text-align: center;
`;

const H2 = styled.h2`
  margin-bottom: 1.5rem;
  color: #4f46e5;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1.25rem;
  &:focus { outline: 2px solid #8b5cf6; }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(90deg,#6b21a8,#9333ea);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  &:hover   { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
  &:active  { transform: translateY(0);   box-shadow: 0 2px 6px  rgba(0,0,0,0.10); }
  &:disabled{ background:#e5e7eb; cursor:not-allowed; }
`;

export default function EnterAmount() {
  const { email, code } = useParams(); // ✅ include `email`
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

  const amountValue = parseFloat(amount);
  const valid =
    /^\d+(\.\d{1,2})?$/.test(amount) &&
    amountValue >= 1 &&
    amountValue <= 100000;

  const showError = amount && !valid;

  const handleSubmit = () => {
    if (valid) {
      navigate(`/payment/${email}/${code}/${amount}`); // ✅ updated path
    }
  };

  return (
    <Wrapper>
      <H2>Pay to {code}</H2>

      <Input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />

      {showError && (
        <ErrorText>
          Amount must be between ₹1 and ₹1,00,000 with up to 2 decimal places.
        </ErrorText>
      )}

      <Button
        disabled={!valid}
        onClick={handleSubmit}
      >
        Continue →
      </Button>
    </Wrapper>
  );
}