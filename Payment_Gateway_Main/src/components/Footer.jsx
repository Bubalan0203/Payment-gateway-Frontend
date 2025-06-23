// === src/components/Footer.jsx ===
import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: #1e1b4b;
  color: #e0e7ff;
  padding: 3rem 2rem 1rem;
  font-size: 0.95rem;
`;

const FooterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
`;

const Column = styled.div`
  flex: 1;
  min-width: 250px;
`;

const Title = styled.h4`
  color: #c4b5fd;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Link = styled.a`
  display: block;
  color: #e0e7ff;
  text-decoration: none;
  margin-bottom: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid #4c1d95;
  text-align: center;
  padding-top: 1rem;
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #a5b4fc;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterGrid>
        <Column>
          <Title>About PayGate</Title>
          <p>
            PayGate is a secure and scalable offline payment gateway platform designed to support modern digital businesses.
            Easily accept and manage payments with confidence, backed by bank-grade security and admin control.
          </p>
        </Column>

        <Column>
          <Title>Quick Links</Title>
          <Link href="/">Home</Link>
          <Link href="/admin-login">Admin Login</Link>
          <Link href="/user-login">User Login</Link>
          <Link href="/signup">User Sign Up</Link>
        </Column>

        <Column>
          <Title>Contact Us</Title>
          <p>Email: support@paygate.com</p>
          <p>Phone: +91-9876543210</p>
          <p>Address: 123 Payment Street, FinTech City, India</p>
        </Column>
      </FooterGrid>

      <BottomBar>
        © {new Date().getFullYear()} PayGate. All rights reserved. | Designed and Developed by Team PayGate 💜
      </BottomBar>
    </FooterWrapper>
  );
}