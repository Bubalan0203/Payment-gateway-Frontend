import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  min-height: 100vh;
  background: #f3f4f6;
`;

const Card = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const Title = styled.h2`
  color: #16a34a;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #374151;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #7c3aed, #9333ea);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
`;

export default function SignupSuccess() {
  return (
    <Wrapper>
      <Card>
        <Title>Signup Successful!</Title>
        <Message>Your details have been submitted successfully.</Message>
        <Message>An admin will review and activate your account shortly.</Message>
        <StyledLink to="/user-login">Go to Login</StyledLink>
      </Card>
    </Wrapper>
  );
}