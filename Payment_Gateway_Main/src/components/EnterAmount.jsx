// src/components/EnterAmount.jsx
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
  const { code } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

  const valid = /^\d+(\.\d{1,2})?$/.test(amount) && parseFloat(amount) > 0;

  return (
    <Wrapper>
      <H2>Pay to {code}</H2>

      <Input
        type="text"
        placeholder="Enter amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Button
        disabled={!valid}
        onClick={() => navigate(`/payment/${code}/${amount}`)}
      >
        Continue →
      </Button>
    </Wrapper>
  );
}