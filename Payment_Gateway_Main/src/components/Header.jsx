// === src/components/Header.jsx ===
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderWrapper = styled.header`
  background: #8b5cf6;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: white;
  color: #8b5cf6;
  font-weight: 600;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f3e8ff;
  }
`;

export default function Header() {


  return (
    <HeaderWrapper>
      <Logo>PayGate</Logo>
    
    </HeaderWrapper>
  );
}