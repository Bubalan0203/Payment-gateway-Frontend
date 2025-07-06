// === src/pages/AdminDashboard.jsx ===
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';
import {
  FaRupeeSign,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';

/* ─────────────────────  STYLES  ───────────────────── */

const PagerBtn = styled.button`
  background: #e5e7eb;
  color: #111827;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 1rem;
  margin: 0 .25rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 80px;
  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: .6;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
`;

const Sidebar = styled.div`
  width: 240px;
  background: #fff;
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
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ active }) => (active ? '#e8f0fe' : 'transparent')};
  &:hover { background: #e8f0fe; }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  min-width: 0; /* 🧠 important when using flex + overflow */
  overflow: hidden; /* prevents sidebar bleed */
`;
const HeaderCard = styled.div`
  background: linear-gradient(90deg,#4f46e5,#9333ea);
  color:#fff;
  border-radius:16px;
  padding:2rem;
  display:flex;
  justify-content:space-between;
  align-items:center;
`;

const StatsGrid = styled.div`
  display:flex;
  gap:1.5rem;
  margin:2rem 0;
  flex-wrap:wrap;
`;

const StatBox = styled.div`
  flex:1 1 200px;
  background:#fff;
  padding:1.5rem;
  border-radius:12px;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
  display:flex;
  justify-content:space-between;
  align-items:center;
`;

const StatText = styled.div`
  font-size:1.2rem;
  font-weight:700;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1400px;     /* prevents squeezing                       */
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  table-layout: fixed;    /* equal-width grid cells                   */
`;

const Th = styled.th`
  padding: 0.8rem;
  background: #f3f4f6;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.9rem;
  text-align: center;
  white-space: nowrap;
  overflow: visible;
  text-overflow: ellipsis;
`;

const WideCol = styled(Td)`max-width:200px;`;

const StatusBadge = styled.span`
  padding:0.3rem 0.75rem;
  border-radius:999px;
  font-size:0.8rem;
  font-weight:600;
  color:#fff;
  background:${({status})=>status==='success'
      ?'#10b981':status==='failed'
      ?'#ef4444':status==='refunded'
      ?'#f97316':'#f59e0b'};
  cursor:pointer;
`;

const ScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  margin-top: 1rem;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ModalOverlay = styled.div`
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:10;
`;
const ModalContent = styled.div`
  background:#fff;
  padding:2rem;
  border-radius:12px;
  width:400px;
  max-width:90%;
`;

const ActionBtn = styled.button`
  
  font-size:0.85rem;
  font-weight:600;
  border-radius:8px;
  border:none;
  cursor:pointer;
  color:#fff;
  transition:transform .15s,box-shadow .15s;
  ${({$variant})=>{
    switch($variant){
      case'danger':return`background:#ef4444;&:hover{background:#dc2626;}&:active{background:#b91c1c;}`;
      case'secondary':return`background:#4b5563;&:hover{background:#374151;}&:active{background:#1f2937;}`;
      default:return`background:linear-gradient(90deg,#6b21a8,#9333ea);&:hover{background:linear-gradient(90deg,#5b21a3,#7c3aed);}&:active{background:linear-gradient(90deg,#4c1d95,#6d28d9);}`;
    }
  }}
  &:hover{box-shadow:0 2px 6px rgba(0,0,0,.15);transform:translateY(-1px);}
  &:active{box-shadow:0 1px 4px rgba(0,0,0,.2);transform:translateY(0);}
`;

/* ─────────────────────────  COMPONENT  ───────────────────────── */

export default function AdminDashboard() {
  const [users,setUsers]           = useState([]);
  const [stats,setStats]           = useState(null);
  const [transactions,setTransactions] = useState([]);
  const [activeTab,setActiveTab]   = useState('dashboard');

  const [showRejectModal,setShowRejectModal] = useState(false);
  const [rejectionReason,setRejectionReason] = useState('');
  const [selectedTxnId,setSelectedTxnId]     = useState('');
  const [statusDescModal,setStatusDescModal] = useState({show:false,type:'',description:''});

  const navigate  = useNavigate();

  /* pagination state */
  const ROWS_PER_PAGE = 10;
  const [usersPage, setUsersPage] = useState(1);
  const [txPage,    setTxPage]    = useState(1);

  /* ─── data fetch ─── */
  const refreshAll = async () => {
    const [uRes, sRes, tRes] = await Promise.all([
      api.get('/admin/users'),
      api.get('/admin/dashboard'),
      api.get('/public/all-transactions'),
    ]);
    setUsers(uRes.data);
    setStats(sRes.data);
    setTransactions(tRes.data);
  };
  useEffect(() => { refreshAll(); }, []);

  /* ─── quick actions ─── */
  const handleApproveTxn = async id => { await api.put(`/admin/transactions/approve/${id}`); refreshAll(); };
  const openRejectModal  = id => { setSelectedTxnId(id); setRejectionReason(''); setShowRejectModal(true); };
  const submitRejection  = async () => { await api.put(`/admin/transactions/reject/${selectedTxnId}`,{reason:rejectionReason}); setShowRejectModal(false); refreshAll(); };
  const toggleUserStatus = async (id,current) => { await api.put(`/admin/approve/${id}`,{isActive:!current}); refreshAll(); };
  const openStatusModal  = (type,desc) => setStatusDescModal({show:true,type,description:desc||'No description provided.'});

  /* ─── derived stats & pagination (ORDER MATTERS) ─── */
  const totalUsers   = users.length;
  const activeUsers  = users.filter(u=>u.isActive).length;

  const totalTx      = transactions.length;
  const successTx    = transactions.filter(t=>t.overallStatus==='success').length;
  const failedTx     = transactions.filter(t=>t.overallStatus==='failed').length;

  /* pagination helpers – must come AFTER totals above */
  const usersPageMax = Math.max(1, Math.ceil(totalUsers / ROWS_PER_PAGE));
  const usersSlice   = users.slice(
    (usersPage - 1) * ROWS_PER_PAGE,
    usersPage * ROWS_PER_PAGE
  );

  const txPageMax = Math.max(1, Math.ceil(totalTx / ROWS_PER_PAGE));
  const txSlice   = transactions.slice(
    (txPage - 1) * ROWS_PER_PAGE,
    txPage * ROWS_PER_PAGE
  );

  /* ─── render ─── */
  return (
    <>
      {/* ------------- Reject-reason modal ------------- */}
      {showRejectModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Why are you rejecting?</h3>
            <textarea
              rows={4}
              style={{width:'100%'}}
              value={rejectionReason}
              onChange={e=>setRejectionReason(e.target.value)} />
            <div style={{marginTop:'1rem',textAlign:'right'}}>
              <ActionBtn onClick={submitRejection} style={{marginRight:'.75rem'}}>Submit</ActionBtn>
              <ActionBtn $variant="secondary" onClick={()=>setShowRejectModal(false)}>Cancel</ActionBtn>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ------------- Status-description modal ------------- */}
      {statusDescModal.show && (
        <ModalOverlay>
          <ModalContent>
            <h3>{statusDescModal.type==='payee' ? 'Payee → Admin Description' : 'Admin → Merchant Description'}</h3>
            <p style={{marginTop:'1rem',whiteSpace:'pre-wrap'}}>{statusDescModal.description}</p>
            <div style={{marginTop:'1.25rem',textAlign:'right'}}>
              <ActionBtn $variant="secondary" onClick={()=>setStatusDescModal({...statusDescModal,show:false})}>Close</ActionBtn>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ------------- Layout ------------- */}
      <PageWrapper>
        {/* --- sidebar --- */}
        <Sidebar>
          <SidebarTitle><FaChartLine/> PayGate</SidebarTitle>
          <SidebarLink active={activeTab==='dashboard'}   onClick={()=>setActiveTab('dashboard')}   ><FaChartLine/> Dashboard</SidebarLink>
          <SidebarLink active={activeTab==='transactions'} onClick={()=>setActiveTab('transactions')}><FaCheckCircle/> Transactions</SidebarLink>
          <SidebarLink active={activeTab==='users'}        onClick={()=>setActiveTab('users')}       ><FaUsers/> Users</SidebarLink>
          <SidebarLink onClick={()=>{localStorage.removeItem('adminToken');navigate('/admin-login');}}><FaClock/> Logout</SidebarLink>
        </Sidebar>

        {/* --- main --- */}
        <MainContent>
          {/* header */}
          <HeaderCard>
            <div>
              <h2>Welcome back, Admin!</h2>
              <p>Here’s what’s happening with your gateway today.</p>
            </div>
            <FaChartLine size={40}/>
          </HeaderCard>

          {/* ====================== DASHBOARD ====================== */}
          {activeTab==='dashboard' && stats && (
            <>
              <StatsGrid>
                <StatBox><div><div>Total Revenue</div><StatText>₹{stats.totalAmountReceived}</StatText></div><FaRupeeSign size={28}/></StatBox>
                <StatBox><div><div>Total Commission</div><StatText>₹{stats.totalCommission}</StatText></div><FaChartLine size={28}/></StatBox>
                <StatBox><div><div>Total Paid</div><StatText>₹{stats.totalPaidToMerchants}</StatText></div><FaCheckCircle size={28}/></StatBox>
              </StatsGrid>

              <StatsGrid>
                <StatBox><div><div>Total Users</div><StatText>{totalUsers}</StatText></div><FaUsers size={28}/></StatBox>
                <StatBox><div><div>Active Users</div><StatText>{activeUsers}</StatText></div><FaCheckCircle size={28}/></StatBox>
                <StatBox><div><div>Inactive Users</div><StatText>{totalUsers-activeUsers}</StatText></div><FaClock size={28}/></StatBox>
              </StatsGrid>

              <StatsGrid>
                <StatBox><div><div>Total Transactions</div><StatText>{totalTx}</StatText></div><FaChartLine size={28}/></StatBox>
                <StatBox><div><div>Successful</div><StatText>{successTx}</StatText></div><FaCheckCircle size={28}/></StatBox>
                <StatBox><div><div>Failed</div><StatText>{failedTx}</StatText></div><FaClock size={28}/></StatBox>
              </StatsGrid>
            </>
          )}

          {/* ====================== USERS TAB ====================== */}
          {activeTab==='users' && (
            <>
              <h3>Users</h3>
             <ScrollWrapper>
  <Table style={{minWidth:'600px'}}>
    <thead>
      <tr>
        <Th>S No</Th>
        <Th>Name</Th>
        <Th>Email</Th>
        <Th>Status</Th>
        <Th>Actions</Th>
      </tr>
    </thead>
    <tbody>
      {usersSlice.map((u, idx) => (
        <tr key={u._id}>
          <Td>{(usersPage - 1) * ROWS_PER_PAGE + idx + 1}</Td> {/* 👈 S No */}
          <Td>{u.name}</Td>
          <Td>{u.email}</Td>
          <Td>
            <StatusBadge status={u.isActive ? 'success' : 'pending'}>
              {u.isActive ? 'Active' : 'Pending'}
            </StatusBadge>
          </Td>
          <Td>
            <ActionBtn
              $variant={u.isActive ? 'danger' : undefined}
              style={{ marginRight: '.5rem' }}
              onClick={() => toggleUserStatus(u._id, u.isActive)}
            >
              {u.isActive ? 'Deactivate' : 'Activate'}
            </ActionBtn>
            <ActionBtn
              $variant="secondary"
              onClick={() => navigate(`/admin/user/${u._id}`)}
            >
              View
            </ActionBtn>
          </Td>
        </tr>
      ))}
    </tbody>
  </Table>
</ScrollWrapper>

              {/* pagination */}
              <div style={{textAlign:'center',marginTop:'1rem'}}>
                <PagerBtn onClick={()=>setUsersPage(p=>Math.max(p-1,1))} disabled={usersPage===1}>← Prev</PagerBtn>
                <span style={{margin:'0 .5rem'}}>{usersPage}/{usersPageMax}</span>
                <PagerBtn onClick={()=>setUsersPage(p=>Math.min(p+1,usersPageMax))} disabled={usersPage===usersPageMax}>Next →</PagerBtn>
              </div>
            </>
          )}

          {/* ====================== TRANSACTIONS TAB ====================== */}
          {activeTab==='transactions' && (
            <>
              <h3>Transactions</h3>
              <ScrollWrapper>
                <Table>
                  <thead>
                    <tr>
                      <Th style={{width:'60px'}}>S No</Th>
                       <Th style={{width:'120px'}}>Merchant Id</Th>
                      <Th style={{width:'120px'}}>Incoming<br/>Status</Th>
                      <Th style={{width:'170px'}}>Customer Time</Th>
                      <Th style={{width:'110px'}}>Amount</Th>
                      <Th style={{width:'110px'}}>Comm.</Th>
                      <Th style={{width:'140px'}}>Settlement Status</Th>
                      <Th style={{width:'170px'}}>Settlement Time</Th>
                      <Th style={{width:'130px'}}>Settlement Amt</Th>
                      <Th style={{width:'120px'}}>Txn Status</Th>
                      <Th style={{width:'140px'}}>Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {txSlice.map((tx,idx)=>(
                      <tr key={tx._id}>
                        <Td>{(txPage-1)*ROWS_PER_PAGE + idx + 1}</Td>
                        <Td>{tx.integrationCode??'–'}</Td>
                        <Td><StatusBadge status={tx.payeeToAdminStatus} onClick={()=>openStatusModal('payee',tx.payeeToAdminDescription)}>{tx.payeeToAdminStatus}</StatusBadge></Td>
                        <WideCol>{tx.payeeToAdminTime ? new Date(tx.payeeToAdminTime).toLocaleString() : '–'}</WideCol>
                        <Td>₹{tx.originalAmount??'–'}</Td>
                        <Td>₹{tx.commission??'–'}</Td>
                        <Td><StatusBadge status={tx.adminToMerchantStatus} onClick={()=>openStatusModal('admin',tx.adminToMerchantDescription)}>{tx.adminToMerchantStatus}</StatusBadge></Td>
                        <WideCol>{tx.adminToMerchantTime ? new Date(tx.adminToMerchantTime).toLocaleString() : '–'}</WideCol>
                        <Td>₹{tx.amountToMerchant??'–'}</Td>
                        <Td><StatusBadge status={tx.overallStatus}>{tx.overallStatus}</StatusBadge></Td>
                        <Td>
                          {tx.overallStatus==='pending'
                            ? (<>
                                <ActionBtn style={{marginRight:'.5rem'}} onClick={()=>handleApproveTxn(tx._id)}>Approve</ActionBtn>
                                <ActionBtn $variant="danger" onClick={()=>openRejectModal(tx._id)}>Reject</ActionBtn>
                              </>)
                            : '—'}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollWrapper>

              {/* pagination */}
              <div style={{textAlign:'center',marginTop:'1rem'}}>
                <PagerBtn onClick={()=>setTxPage(p=>Math.max(p-1,1))} disabled={txPage===1}>← Prev</PagerBtn>
                <span style={{margin:'0 .5rem'}}>{txPage}/{txPageMax}</span>
                <PagerBtn onClick={()=>setTxPage(p=>Math.min(p+1,txPageMax))} disabled={txPage===txPageMax}>Next →</PagerBtn>
              </div>
            </>
          )}
        </MainContent>
      </PageWrapper>
    </>
  );
}