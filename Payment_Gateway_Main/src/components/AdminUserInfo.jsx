import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api';

const Container = styled.div`
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  color: #6b21a8;
  font-size: 1.3rem;
  border-bottom: 1px solid #ddd6fe;
  padding-bottom: 0.5rem;
`;

const Label = styled.p`
  margin: 0.4rem 0;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Thead = styled.thead`
  background: #6b21a8;
  color: white;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 0.8rem 1rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
`;

const StatGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  flex: 1 1 200px;
  background: white;
  border: 2px solid #ddd6fe;
  border-left: 8px solid #6b21a8;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  font-size: 0.95rem;
`;

const BackButton = styled.button`
  background: #6b21a8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
`;

export default function AdminUserInfo() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bank, setBank] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res1 = await api.get(`/admin/user/${userId}`);
        setUser(res1.data.user);
        setBank(res1.data.bank);

        if (res1.data.bank?.accountNumber) {
          const res2 = await api.get(`/public/user-transactions/${res1.data.bank.accountNumber}`);
          setTransactions(res2.data);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchInfo();
  }, [userId]);

  if (!user || !bank) return <Container>Loading...</Container>;

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.originalAmount, 0);
  const successCount = transactions.filter(tx => tx.status === 'success').length;
  const failedCount = transactions.filter(tx => tx.status === 'failed').length;

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← Back</BackButton>

      <StatGrid>
        <StatBox><strong>Total Amount:</strong><br />₹{totalAmount}</StatBox>
        <StatBox><strong>Total Transactions:</strong><br />{transactions.length}</StatBox>
        <StatBox><strong>Successful:</strong><br />{successCount}</StatBox>
        <StatBox><strong>Failed:</strong><br />{failedCount}</StatBox>
      </StatGrid>

      <Section>
        <Title>User Details</Title>
        <Label><strong>Name:</strong> {user.name}</Label>
        <Label><strong>Email:</strong> {user.email}</Label>
        <Label><strong>Unique Code:</strong> {user.uniqueCode}</Label>
        <Label><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</Label>
        <Label><strong>Security Question:</strong> {user.securityQuestion}</Label>
        <Label><strong>Security Answer:</strong> {user.securityAnswer}</Label>
      </Section>

      <Section>
        <Title>Address</Title>
        <Label><strong>Line 1:</strong> {user.address?.line1}</Label>
        <Label><strong>Line 2:</strong> {user.address?.line2}</Label>
        <Label><strong>City:</strong> {user.address?.city}</Label>
        <Label><strong>State:</strong> {user.address?.state}</Label>
        <Label><strong>Country:</strong> {user.address?.country}</Label>
        <Label><strong>ZIP:</strong> {user.address?.zip}</Label>
      </Section>

      <Section>
        <Title>KYC</Title>
        <Label><strong>PAN:</strong> {user.kyc?.panCard}</Label>
        <Label><strong>Aadhaar:</strong> {user.kyc?.aadhaarCard}</Label>
      </Section>

      <Section>
        <Title>Bank Details</Title>
        <Label><strong>Account No:</strong> {bank.accountNumber}</Label>
        <Label><strong>IFSC:</strong> {bank.ifsc}</Label>
        <Label><strong>Balance:</strong> ₹{bank.balance}</Label>
      </Section>

      <Section>
        <Title>Transactions</Title>
        <Table>
          <Thead>
            <tr>
              <Th>Date</Th>
              <Th>From</Th>
              <Th>Amount</Th>
              <Th>Commission</Th>
              <Th>Status</Th>
            </tr>
          </Thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id}>
                <Td>{new Date(tx.timestamp).toLocaleString()}</Td>
                <Td>{tx.fromAccountNumber}</Td>
                <Td>₹{tx.originalAmount}</Td>
                <Td>₹{tx.commission}</Td>
                <Td>{tx.status}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
}