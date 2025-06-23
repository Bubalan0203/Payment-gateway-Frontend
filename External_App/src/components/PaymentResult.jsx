import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ReceiptCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-weight: 700;
  color: #16a34a;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Item = styled.p`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #374151;

  & strong {
    font-weight: 600;
    color: #111827;
  }
`;

export default function PaymentResult() {
  const [params] = useSearchParams();

  const txId = params.get('txId');
  const reference = params.get('reference');
  const merchant = params.get('merchant');
  const name = params.get('name');
  const accountNumber = params.get('accountNumber');
  const ifsc = params.get('ifsc');
  const amount = params.get('amount');
  const status = params.get('status');
  const timestamp = params.get('timestamp');

  return (
    <Wrapper>
      <ReceiptCard>
        <Title>Payment Receipt</Title>
        <Item><strong>Transaction ID:</strong> {txId}</Item>
        <Item><strong>Reference:</strong> {reference}</Item>
        <Item><strong>Merchant:</strong> {merchant}</Item>
        <Item><strong>Name:</strong> {name}</Item>
        <Item><strong>Account:</strong> {accountNumber}</Item>
        <Item><strong>IFSC:</strong> {ifsc}</Item>
        <Item><strong>Amount:</strong> ₹{amount}</Item>
        <Item><strong>Status:</strong> {status}</Item>
        <Item><strong>Timestamp:</strong> {timestamp}</Item>
      </ReceiptCard>
    </Wrapper>
  );
}