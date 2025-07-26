// === src/pages/UserDashboard.jsx (updated with improved design) ===
import React, { useEffect, useState } from 'react';
import api from '../api';
import styled from 'styled-components';
import { QRCodeCanvas } from 'qrcode.react';
import { HiOutlineClipboardCopy } from 'react-icons/hi'; // top of your file
/* ───────── styles ───────── */
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
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #dc2626; }
`;
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const StatBox = styled.div`
  flex: 1 1 200px;
  background: #fff;
  border-left: 6px solid #6b21a8;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;
const Section = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;
const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
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
  padding: 1rem;
  text-align: center;
  white-space: nowrap;
`;
const Td = styled.td`
  padding: 0.8rem 1rem;
  text-align: center;
  border-top: 1px solid #eee;
  white-space: nowrap;
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
/* ───────── component ───────── */
export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [showUpi, setShowUpi] = useState(false);
const [showBank, setShowBank] = useState(false);
const [showAddress, setShowAddress] = useState(false);
const [showKyc, setShowKyc] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const totalPages = Math.ceil(transactions.length / itemsPerPage);
const currentData = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('user'));
    if (!data?.user) return;
    setUser(data.user);
    const fetchInfo = async () => {
      try {
        const res1 = await api.get(`/admin/user/${data.user._id}`);
        console.log('User data from backend:', res1.data);
setBankAccounts(res1.data.user.bankAccounts || []);


        if (res1.data.bank?.accountNumber) {
          const res2 = await api.get(`/public/user-transactions/${res1.data.bank.accountNumber}`);
          setTransactions(res2.data);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };
    fetchInfo();
  }, []);

  if (!user) return <Container>Loading...</Container>;


  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.originalAmount || 0), 0);
  const successCount = transactions.filter(tx => tx.overallStatus === 'success').length;
  const failedCount = transactions.filter(tx => tx.overallStatus === 'failed').length;

  return (
    <Container>
      <Header>
        <h3>Welcome, {user.name}</h3>
        <LogoutButton onClick={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/user-login';
        }}>Logout</LogoutButton>
      </Header>

      <Grid>
        <StatBox><strong>Transaction Amount:</strong><br/>₹{totalAmount}</StatBox>
        <StatBox><strong>Total Transactions:</strong><br/>{transactions.length}</StatBox>
        <StatBox><strong>Successful:</strong><br/>{successCount}</StatBox>
        <StatBox><strong>Failed:</strong><br/>{failedCount}</StatBox>
      </Grid>
<Accordion>
  {/* Header */}
  <AccordionHeader onClick={() => setShowUpi(!showUpi)}>
    <span>UPI&nbsp;QR&nbsp;Scanner</span>
    <span>{showUpi ? '−' : '+'}</span>
  </AccordionHeader>

  {/* Collapsible body */}
  <AccordionContent open={showUpi}>
    <Section style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: '1.2rem' }}>Make your Payments with UPI</h4>

      {/* QR + Copy block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <QRCodeCanvas
          value={`${window.location.origin}/payment/${user.uniqueCode}`}
          size={180}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />

        {/* link + copy icon */}
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            background: '#f3f4f6',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '0.4rem 1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <span
            style={{
              fontSize: '0.95rem',
              color: '#1f2937',
              fontWeight: 600,
              marginRight: '0.5rem',
            }}
          >
            {user.uniqueCode}
          </span>

          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/payment/${user.uniqueCode}`
              );
              alert('Link copied!');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            title="Copy"
          >
            <HiOutlineClipboardCopy size={20} color="#4b5563" />
          </button>
        </div>

        <p
          style={{
            marginTop: '0.75rem',
            fontSize: '0.85rem',
            color: '#6b7280',
          }}
        >
          Scan the QR or tap to copy your payment link
        </p>
      </div>
    </Section>
  </AccordionContent>
</Accordion>

     <Accordion>
  <AccordionHeader onClick={() => setShowBank(!showBank)}>
    <span>Bank Details</span>
    <span>{showBank ? '−' : '+'}</span>
  </AccordionHeader>
<AccordionContent open={showBank}>
  {bankAccounts.length > 0 ? (
  bankAccounts.map((bank, index) => (
    <div key={index} style={{ marginBottom: '1rem' }}>
      <p><strong>Bank Name:</strong> {bank.bankName}</p>
      <p><strong>Account Holder:</strong> {bank.accountHolderName}</p>
      <p><strong>Account No:</strong> {bank.bankAccountNumber}</p>
      <p><strong>IFSC:</strong> {bank.ifscCode}</p>
      <p><strong>UPI ID:</strong> {bank.uniqueCode}</p>
      <hr />
    </div>
  ))
) : (
  <p style={{ color: '#9ca3af' }}>No bank account added yet.</p>
)}


  <hr style={{ margin: '1rem 0' }} />
  <h4>Add Another Bank Account</h4>
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        email: user.email,
        bankAccountNumber: formData.get('accountNumber'),
        bankName: formData.get('bankName'),
        accountHolderName: formData.get('holderName'),
        ifscCode: formData.get('ifsc'),
        phoneNumber: user.phone,
      };
      try {
        const res = await api.post('/auth/add-bank-account', data);
        alert(res.data.message);
        window.location.reload(); // Refresh to load new account
      } catch (err) {
        alert(err?.response?.data?.error || 'Failed to add bank account');
      }
    }}
    style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
  >
    <input name="holderName" placeholder="Account Holder Name" required />
    <input name="bankName" placeholder="Bank Name" required />
    <input name="accountNumber" placeholder="Account Number" required />
    <input name="ifsc" placeholder="IFSC Code" required />
    <button type="submit">Add Bank Account</button>
  </form>
</AccordionContent>


</Accordion>

     <Accordion>
  <AccordionHeader onClick={() => setShowAddress(!showAddress)}>
    <span>Address</span>
    <span>{showAddress ? '−' : '+'}</span>
  </AccordionHeader>
  <AccordionContent open={showAddress}>
    <p><strong>Line&nbsp;1:</strong> {user.address?.line1}</p>
    <p><strong>Line&nbsp;2:</strong> {user.address?.line2 || '-'}</p>
    <p><strong>City:</strong> {user.address?.city}</p>
    <p><strong>State:</strong> {user.address?.state}</p>
    <p><strong>Country:</strong> {user.address?.country}</p>
    <p><strong>ZIP:</strong> {user.address?.zip}</p>
  </AccordionContent>
</Accordion>

    <Accordion>
  <AccordionHeader onClick={() => setShowKyc(!showKyc)}>
    <span>KYC Details</span>
    <span>{showKyc ? '−' : '+'}</span>
  </AccordionHeader>
  <AccordionContent open={showKyc}>
    <p><strong>PAN Card:</strong> {user.kyc?.panCardNumber}</p>
    <p><strong>Aadhaar:</strong> {user.kyc?.aadhaarNumber ? 'XXXX-XXXX-' + user.kyc.aadhaarNumber.slice(-4) : ''}</p>
  </AccordionContent>
</Accordion>

      <Section>
        <h4>Transaction History</h4>
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
            {currentData.map((tx) => (
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