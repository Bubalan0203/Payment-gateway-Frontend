import React, { useEffect, useState } from 'react';
import api from '../api';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoutButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;
const Grid = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  flex: 1;
  min-width: 200px;
  background: white;
  border: 2px solid #ddd6fe;
  border-left: 8px solid #6b21a8;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
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
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.8rem 1rem;
  border-top: 1px solid #eee;
`;

const InputBox = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-right: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #6b21a8;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
`;

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bank, setBank] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('user'));
    setUser(data.user);

    const fetchInfo = async () => {
      const res1 = await api.get(`/admin/user/${data.user._id}`);
      setBank(res1.data.bank);
      const res2 = await api.get(`/public/user-transactions/${res1.data.bank?.accountNumber}`);
      setTransactions(res2.data);
    };

    fetchInfo();
  }, []);

  if (!user || !bank) return <Container>Loading...</Container>;

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.originalAmount, 0);
  const successCount = transactions.filter(tx => tx.status === 'success').length;
  const failedCount = transactions.filter(tx => tx.status === 'failed').length;

  return (
    <Container>
      <Header>
  <h3>Welcome, {user.name}</h3>
  <LogoutButton
    onClick={() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/user-login';
    }}
  >
    Logout
  </LogoutButton>
</Header>

      <Grid>
        <StatBox><strong>Total Amount:</strong> ₹{totalAmount}</StatBox>
        <StatBox><strong>Total Transactions:</strong> {transactions.length}</StatBox>
        <StatBox><strong>Successful:</strong> {successCount}</StatBox>
        <StatBox><strong>Failed:</strong> {failedCount}</StatBox>
      </Grid>

      <Section>
        <h4>Integration Link</h4>
        <InputBox>
          <Input
            type="text"
            value={`${user.uniqueCode}`}
            readOnly
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/payment/${user.uniqueCode}`);
              alert('Link copied!');
            }}
          >
            Copy
          </Button>
        </InputBox>
      </Section>

      <Section>
        <h4>Bank Details</h4>
        <p><strong>Account No:</strong> {bank.accountNumber}</p>
        <p><strong>IFSC:</strong> {bank.ifsc}</p>
        <p><strong>Balance:</strong> ₹{bank.balance}</p>
      </Section>

      <Section>
        <h4>Transaction History</h4>
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
