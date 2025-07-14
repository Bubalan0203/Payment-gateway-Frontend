import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import UserLogin from './components/UserLogin';
import AdminLogin from './components/AdminLogin';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import PublicPayment from './components/PublicPayment';
import AdminUserInfo from './components/AdminUserInfo';
import SignupSuccess from './components/SignupSuccess';
import PaymentReceipt from './components/PaymentReceipt';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import ForgetPassword from './components/Forgetpassword';
import PrivateRoute from './components/privateRoute';
import EnterAmount from './components/EnterAmount'; 
import ForgotPassword from './components/Forgetpassword';

function App() {
  return (
    <>
    <Header/>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user/dashboard" element={<PrivateRoute> <UserDashboard /> </PrivateRoute>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/payment/:code" element={<EnterAmount />} /> 
        <Route path="/payment/:code/:amount" element={<PublicPayment />} />
        <Route path="/admin/user/:userId" element={<AdminUserInfo />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
        <Route path="/payment/receipt" element={<PaymentReceipt />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:email" element={<ResetPassword />} />
      </Routes>
    </Router>
    <Footer />
    </>
  );
}

export default App;