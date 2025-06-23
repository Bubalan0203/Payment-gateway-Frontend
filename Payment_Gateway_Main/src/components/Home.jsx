// === src/pages/Home.jsx ===
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  font-family: 'Segoe UI', sans-serif;
`;

const Hero = styled.section`
  background: linear-gradient(to right, #4f46e5, #9333ea);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const CTAButton = styled.button`
  background: white;
  color: #6b21a8;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  margin: 0 0.5rem;
  cursor: pointer;
`;

const Section = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #4f46e5;
  margin-bottom: 1rem;
`;

const SectionText = styled.p`
  font-size: 1rem;
  color: #4b5563;
  max-width: 800px;
  margin: auto;
`;

const FeatureGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
  justify-content: center;
`;

const FeatureCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 2rem;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Hero>
        <HeroTitle>Welcome to PayGate</HeroTitle>
        <HeroSubtitle>
          A secure and smart way to collect payments via your unique link. Offline banking simplified for modern merchants.
        </HeroSubtitle>
        <div>
          <CTAButton onClick={() => navigate('/signup')}>Sign Up</CTAButton>
          <CTAButton onClick={() => navigate('/user-login')}>Login</CTAButton>
        </div>
      </Hero>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <SectionText>
          Sign up as a merchant, get your unique PayGate link, and start collecting payments. It's that simple.
        </SectionText>
        <FeatureGrid>
          <FeatureCard>
            <h4>Step 1: Register</h4>
            <p>Provide your business and KYC details. Secure and easy onboarding in minutes.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>Step 2: Get Your Link</h4>
            <p>Get a unique payment link that customers can use to pay via bank transfer.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>Step 3: Receive Funds</h4>
            <p>Payments go to our system, and we settle the final amount to your account after a 2% commission.</p>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Section>
        <SectionTitle>Why Choose PayGate?</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <h4>Secure Transactions</h4>
            <p>We use bank-level security and verification protocols for all transfers.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>Admin Settlement Control</h4>
            <p>All payments are verified and released by admins ensuring transparency.</p>
          </FeatureCard>
          <FeatureCard>
            <h4>Real-Time Dashboard</h4>
            <p>Track your earnings, transactions, and performance in one place.</p>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Section>
        <SectionTitle>Get Started Today</SectionTitle>
        <SectionText>
          Join hundreds of merchants simplifying their payments with PayGate. Sign up now and get your free integration link.
        </SectionText>
        <CTAButton onClick={() => navigate('/signup')}>Join Now</CTAButton>
      </Section>
    </Wrapper>
  );
};

export default Home;
