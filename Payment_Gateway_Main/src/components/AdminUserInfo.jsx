// === src/pages/AdminUserInfo.jsx (updated with collapsible design and styled status) ===
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api';

/* ───────── styles ───────── */
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
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;
const Thead = styled.thead`
  background: #6b21a8;
  color: #fff;
`;
const Th = styled.th`
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
`;
const Td = styled.td`
  text-align: center;
  padding: 0.8rem 1rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  white-space: nowrap;
`;
const StatGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const StatBox = styled.div`
  flex: 1 1 200px;
  background: #fff;
  border: 2px solid #ddd6fe;
  border-left: 8px solid #6b21a8;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  font-size: 0.95rem;
`;
const BackButton = styled.button`
  background: #6b21a8;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
`;
const StatusBadge = styled.span`
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: ${({ status }) =>
    status === 'success' ? '#10b981' :
    status === 'failed' ? '#ef4444' :
    '#f59e0b'};
`;
const Accordion = styled.div`
  margin-bottom: 1rem;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #fff;
`;
const AccordionHeader = styled.div`
  padding: 1rem;
  background: #ede9fe;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AccordionContent = styled.div`
  padding: 1rem;
  border-top: 1px solid #ddd;
  display: ${({ open }) => (open ? 'block' : 'none')};
`;
const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #6b21a8;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #5b21a3; }
  &:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
`;
export default function AdminUserInfo() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bank, setBank] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [showKyc, setShowKyc] = useState(false);
  const [showBank, setShowBank] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const transactionsPerPage = 10;
const indexOfLastTx = currentPage * transactionsPerPage;
const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
const currentTransactions = transactions.slice(indexOfFirstTx, indexOfLastTx);

const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res1 = await api.get(`/admin/user/${userId}`);
        setUser(res1.data.user);
        setBank(res1.data.bank);
        if (res1.data?.bank?.accountNumber) {
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

  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.originalAmount || 0), 0);
  const successCount = transactions.filter(tx => tx.overallStatus === 'success').length;
  const failedCount = transactions.filter(tx => tx.overallStatus === 'failed').length;

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
        <Label><strong>UPI ID:</strong> {user.uniqueCode}</Label>
        <Label><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</Label>
        <Label><strong>Security Question:</strong> {user.securityQuestion}</Label>
        <Label><strong>Security Answer:</strong> {user.securityAnswer}</Label>
      </Section>

      <Accordion>
        <AccordionHeader onClick={() => setShowAddress(!showAddress)}>
          <span>Address</span><span>{showAddress ? '−' : '+'}</span>
        </AccordionHeader>
        <AccordionContent open={showAddress}>
          <Label><strong>Line 1:</strong> {user.address?.line1}</Label>
          <Label><strong>Line 2:</strong> {user.address?.line2 || '-'}</Label>
          <Label><strong>City:</strong> {user.address?.city}</Label>
          <Label><strong>State:</strong> {user.address?.state}</Label>
          <Label><strong>Country:</strong> {user.address?.country}</Label>
          <Label><strong>ZIP:</strong> {user.address?.zip}</Label>
        </AccordionContent>
      </Accordion>

      <Accordion>
        <AccordionHeader onClick={() => setShowKyc(!showKyc)}>
          <span>KYC Details</span><span>{showKyc ? '−' : '+'}</span>
        </AccordionHeader>
        <AccordionContent open={showKyc}>
          <Label><strong>PAN:</strong> {user.kyc?.panCardNumber}</Label>
          <Label><strong>Aadhaar:</strong> {user.kyc?.aadhaarNumber}</Label>
        </AccordionContent>
      </Accordion>

      <Accordion>
        <AccordionHeader onClick={() => setShowBank(!showBank)}>
          <span>Bank Details</span><span>{showBank ? '−' : '+'}</span>
        </AccordionHeader>
        <AccordionContent open={showBank}>
         <p><strong>Bank&nbsp;Name:</strong> {bank.bankName || '\u00A0'}</p>
      <p><strong>Account&nbsp;Holder:</strong> {bank.accountHolderName || '\u00A0'}</p>
  <p><strong>Account&nbsp;No:</strong> {bank.accountNumber}</p>
  <p><strong>IFSC:</strong> {bank.ifsc}</p>
        </AccordionContent>
      </Accordion>

      <Section>
        <Title>Transactions</Title>
        <Table>
          <Thead>
            <tr>
              <Th>Customer Transfer Time</Th>
              <Th>Transaction Amount</Th>
              <Th>Transaction Status</Th>
              <Th>Settlement Amt</Th>
              <Th>Settlement Status</Th>
            </tr>
          </Thead>
          <tbody>
  {currentTransactions.map((tx) => (
    <tr key={tx._id}>
                <Td>{new Date(tx.payeeToAdminTime || tx.createdAt || Date.now()).toLocaleString()}</Td>
                <Td>₹{tx.originalAmount}</Td>
                <Td><StatusBadge status={tx.payeeToAdminStatus}>{tx.payeeToAdminStatus}</StatusBadge></Td>
                <Td>₹{tx.amountToMerchant}</Td>
                <Td><StatusBadge status={tx.overallStatus}>{tx.overallStatus}</StatusBadge></Td>
              </tr>
  ))}
</tbody>
        </Table>
 <div style={{ marginTop: '1rem', textAlign: 'center' }}>
  <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
    Prev
  </Button>
  <span style={{ margin: '0 1rem' }}>
    Page {currentPage} of {totalPages}
  </span>
  <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
    Next
  </Button>
</div>
      </Section>
    </Container>
  );
}