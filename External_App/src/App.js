// === 3. src/App.js ===
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaymentForm from './components/PaymentForm';
import PaymentResult from './components/PaymentResult';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaymentForm />} />
        <Route path="/payment-result" element={<PaymentResult />} />
      </Routes>
    </BrowserRouter>
  );
}

