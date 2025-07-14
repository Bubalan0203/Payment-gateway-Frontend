import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import jwtEncode from 'jwt-encode'; 

const SECRET_KEY = '80-QTH5GkLN9Kg_fUcVl7qsGnqV2TP6ffNnT2XFoH-EAFOA5wc5fuPlc1BOJ1jmAOtUXyyidtkp44kmxqpvy3A'; 
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  background: #f9f9fb;
  min-height: 100vh;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #4c1d95;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd6fe;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;

  &:focus {
    border-color: #8b5cf6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: white;
`;

const BackButton = styled(Button)`
  background: #6b7280;
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(to right, #7c3aed, #9333ea);
`;

export default function SignupStep4({ formData, setFormData, back }) {
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const verifyPan = async () => {
  const { panCard } = formData;
  if (!panCard) return alert('Enter PAN number');

  const payload = { panCard };
  const token = jwtEncode(payload, SECRET_KEY, 'HS512');

  try {
    const res = await axios.post('http://192.168.162.246:8000/pancard/validate', {
      token, 
    });

    const decoded = jwtDecode(res.data.token); 
    alert(decoded ? ' PAN Verified' : ' Invalid PAN');
  } catch (err) {
    console.error(err);
    alert('PAN verification failed');
  }
};

  const verifyAadhaar = async () => {
  const { aadhaarCard } = formData;
  if (!aadhaarCard) return alert('Enter Aadhaar number');

  try {
    const res = await axios.post('https://j6s1rnmt-5000.inc1.devtunnels.ms/check/aadhaar', {
      "uniqueID":aadhaarCard,
    });

    // Assuming API returns something like: { valid: true } or { valid: false }
    if (res.data) {
      alert('Aadhaar Verified');
    } else {

      alert('Invalid Aadhaar');
    }
  } catch (err) {
    console.error(err);
    alert('Aadhaar verification failed');
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.panCard || !formData.aadhaarCard) {
      alert('Please fill both PAN and Aadhaar fields');
      return;
    }

    alert('Signup Step 4 submitted');
  };

  return (
    <Wrapper>
      <Card>
        <Title>Step 4: KYC Details</Title>
        <form onSubmit={handleSubmit}>
          <Row>
            <Input
              name="panCard"
              value={formData.panCard}
              onChange={handleChange}
              placeholder="PAN Card Number"
              required
            />
            <SubmitButton type="button" onClick={verifyPan}>
              Verify
            </SubmitButton>
          </Row>

          <Row>
            <Input
              name="aadhaarCard"
              value={formData.aadhaarCard}
              onChange={handleChange}
              placeholder="Aadhaar Number"
              required
            />
            <SubmitButton type="button" onClick={verifyAadhaar}>
              Verify
            </SubmitButton>
          </Row>

          <ButtonGroup>
            <BackButton type="button" onClick={back}>
              Back
            </BackButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </Card>
    </Wrapper>
  );
}
