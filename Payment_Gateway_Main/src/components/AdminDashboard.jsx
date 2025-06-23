import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';
import { FaRupeeSign, FaUsers, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
`;

const Sidebar = styled.div`
  width: 240px;
  background: white;
  padding: 2rem 1rem;
  border-right: 1px solid #ddd;
`;

const SidebarTitle = styled.h2`
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SidebarLink = styled.div`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  color: #333;
  background: ${props => props.active ? '#e8f0fe' : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: #e8f0fe;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const HeaderCard = styled.div`
  background: linear-gradient(to right, #4f46e5, #9333ea);
  color: white;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatsGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatBox = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
`;

const Thead = styled.thead`
  background: #f1f5f9;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  font-size: 0.9rem;
  color: #555;
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-top: 1px solid #eee;
  font-size: 0.95rem;
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
  background: ${props => props.status === 'Approved' ? '#10b981' : '#f59e0b'};
`;

const Button = styled.button`
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: ${props => props.variant === 'danger' ? '#ef4444' : '#3b82f6'};
  color: white;
  margin-right: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
`;
const UserTable = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1.2rem 2rem;
  border-top: 1px solid #f0f0f0;

  &:first-child {
    background: #f8f9fa;
    font-weight: bold;
    color: #6b7280;
    text-transform: uppercase;
    font-size: 0.85rem;
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const ContactInfo = styled.div`
  flex: 1;
  font-size: 0.9rem;
  color: #374151;
  display: flex;
  flex-direction: column;

  span {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.2rem;
  }
`;

const StatusPill = styled.div`
  background: ${props => props.status === 'active' ? '#d1fae5' : '#e5e7eb'};
  color: ${props => props.status === 'active' ? '#059669' : '#6b7280'};
  font-weight: 600;
  padding: 0.3rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  text-align: center;
`;

const Cell = styled.div`
  flex: 1;
  font-weight: 500;
  color: #111827;
  text-align: left;
`;
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await api.get('/admin/users');
      setUsers(res1.data);
      const res2 = await api.get('/admin/dashboard');
      setStats(res2.data);
      const res3 = await api.get('/public/all-transactions');
      setTransactions(res3.data);
    };
    fetchData();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    await api.put(`/admin/approve/${id}`, { isActive: !currentStatus });
    setUsers(prev =>
      prev.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u)
    );
  };

  // Real-time computed values
  const totalUsers = users.length;
  const totalActiveUsers = users.filter(u => u.isActive).length;
  const totalInactiveUsers = totalUsers - totalActiveUsers;

  const totalTransactions = transactions.length;
  const successTransactions = transactions.filter(tx => tx.status === 'success').length;
  const failedTransactions = transactions.filter(tx => tx.status === 'failed').length;

  return (
    <PageWrapper>
     <Sidebar>
  <SidebarTitle><FaChartLine /> PayGate</SidebarTitle>
  <SidebarLink active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
    <FaChartLine /> Dashboard
  </SidebarLink>
  <SidebarLink active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
    <FaCheckCircle /> Transactions
  </SidebarLink>
  <SidebarLink active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
    <FaUsers /> Users
  </SidebarLink>
  <SidebarLink onClick={() => {
    localStorage.removeItem('adminToken'); // or any auth key
    navigate('/admin-login'); // adjust route if needed
  }}>
    <FaClock /> Logout
  </SidebarLink>
</Sidebar>

      <MainContent>
        <HeaderCard>
          <div>
            <h2>Welcome back, Admin!</h2>
            <p>Here’s what’s happening with your payment gateway today.</p>
          </div>
          <FaChartLine size={40} />
        </HeaderCard>

        { stats && (
          <>
            <StatsGrid>
              <StatBox>
                <div><div>Total Revenue</div><StatText>₹{stats.totalAmountReceived}</StatText></div>
                <FaRupeeSign size={30} />
              </StatBox>
              <StatBox>
                <div><div>Total Commission</div><StatText>₹{stats.totalCommission}</StatText></div>
                <FaChartLine size={30} />
              </StatBox>
              <StatBox>
                <div><div>Total Paid</div><StatText>₹{stats.totalPaidToMerchants}</StatText></div>
                <FaCheckCircle size={30} />
              </StatBox>
            </StatsGrid>

            <StatsGrid>
              <StatBox>
                <div><div>Total Users</div><StatText>{totalUsers}</StatText></div>
                <FaUsers size={30} />
              </StatBox>
              <StatBox>
                <div><div>Active Users</div><StatText>{totalActiveUsers}</StatText></div>
                <FaCheckCircle size={30} />
              </StatBox>
              <StatBox>
                <div><div>Inactive Users</div><StatText>{totalInactiveUsers}</StatText></div>
                <FaClock size={30} />
              </StatBox>
            </StatsGrid>

            <StatsGrid>
              <StatBox>
                <div><div>Total Transactions</div><StatText>{totalTransactions}</StatText></div>
                <FaChartLine size={30} />
              </StatBox>
              <StatBox>
                <div><div>Successful Transactions</div><StatText>{successTransactions}</StatText></div>
                <FaCheckCircle size={30} />
              </StatBox>
              <StatBox>
                <div><div>Failed Transactions</div><StatText>{failedTransactions}</StatText></div>
                <FaClock size={30} />
              </StatBox>
            </StatsGrid>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <h4>User Details</h4>
            <Table>
              <Thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </Thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td><StatusBadge status={user.isActive ? 'Approved' : 'Pending'}>{user.isActive ? 'Approved' : 'Pending'}</StatusBadge></Td>
                    <Td>
                      <Button variant={user.isActive ? 'danger' : 'primary'} onClick={() => toggleStatus(user._id, user.isActive)}>
                        {user.isActive ? 'Deactivate' : 'Approve'}
                      </Button>
                      <Button onClick={() => navigate(`/admin/user/${user._id}`)}>View</Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {activeTab === 'transactions' && (
          <>
            <h4>Transactions Details</h4>
            <Table>
              <Thead>
                <tr>
                  <Th>Date</Th>
                  <Th>From</Th>
                  <Th>To</Th>
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
                    <Td>{tx.toAccountNumber}</Td>
                    <Td>₹{tx.originalAmount}</Td>
                    <Td>₹{tx.commission}</Td>
                    <Td>{tx.status}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </MainContent>
    </PageWrapper>
  );
}


