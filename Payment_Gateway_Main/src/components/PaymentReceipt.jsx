import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 3rem;
  background: linear-gradient(to right, #eef2ff, #f4f4f7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 0.8rem;
  color: #22c55e;
  font-weight: 700;
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #16a34a;
`;

const Item = styled.p`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #374151;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #7c3aed;
  }
`;

const TimerText = styled.p`
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #6b7280;
`;

export default function PaymentReceipt() {
  const { state } = useLocation();
  const [seconds, setSeconds] = useState(5);

  const {
    transactionId,
    name,
    accountNumber,
    ifsc,
    amount,
    status,
    timestamp,
    merchant,
    reference,
    returnUrl,
  } = state || {};

  useEffect(() => {
    if (!state) return window.location.href = '/';

    const countdown = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          try {
            const url = new URL(returnUrl);
            url.searchParams.append('txId', transactionId);
            url.searchParams.append('reference', reference);
            url.searchParams.append('merchant', merchant);
            url.searchParams.append('name', name);
            url.searchParams.append('accountNumber', accountNumber);
            url.searchParams.append('ifsc', ifsc);
            url.searchParams.append('amount', amount);
            url.searchParams.append('status', status);
            url.searchParams.append('timestamp', timestamp);
            window.location.href = url.toString();
          } catch (err) {
            console.error('Invalid return URL');
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [state, transactionId, returnUrl]);

  const handleDownload = () => {
    const text = `
🧾 Payment Receipt
---------------------
Transaction ID: ${transactionId}
Reference: ${reference}
Merchant: ${merchant}
Name: ${name}
Account: ${accountNumber}
IFSC: ${ifsc}
Amount: ₹${amount}
Status: ${status}
Date: ${timestamp}
    `;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `receipt_${reference}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <Wrapper>
      <Card>
        <Icon>✅</Icon>
        <Title>Payment Successful</Title>
        <Item><strong>Reference:</strong> {reference}</Item>
        <Item><strong>Merchant:</strong> {merchant}</Item>
        <Item><strong>Name:</strong> {name}</Item>
        <Item><strong>Account:</strong> {accountNumber}</Item>
        <Item><strong>IFSC:</strong> {ifsc}</Item>
        <Item><strong>Amount:</strong> ₹{amount}</Item>
        <Item><strong>Status:</strong> {status}</Item>
        <Item><strong>Date:</strong> {timestamp}</Item>
        <Button onClick={handleDownload}>Download Receipt</Button>
        <TimerText>Redirecting in {seconds} second{seconds !== 1 ? 's' : ''}...</TimerText>
      </Card>
    </Wrapper>
  );
}