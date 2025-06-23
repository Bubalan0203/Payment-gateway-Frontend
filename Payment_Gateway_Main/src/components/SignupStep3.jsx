import React from 'react';
import styled from 'styled-components';

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
  max-width: 550px;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: white;
`;

const BackButton = styled(Button)`
  background: #6b7280;
`;

const NextButton = styled(Button)`
  background: linear-gradient(to right, #7c3aed, #9333ea);
`;

export default function SignupStep3({ formData, setFormData, next, back }) {
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = e => {
    e.preventDefault();
    const { addressLine1, city, state, country, zip } = formData;
    if (!addressLine1 || !city || !state || !country || !zip)
      return alert('All address fields are required');
    next();
  };

  return (
    <Wrapper>
      <Card>
        <Title>Step 3: Address Details</Title>
        <form onSubmit={handleNext}>
          <Input
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Address Line 1"
            required
          />
          <Input
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Address Line 2"
          />
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
          <Input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
          <Input
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="ZIP Code"
            required
          />

          <ButtonGroup>
            <BackButton type="button" onClick={back}>Back</BackButton>
            <NextButton type="submit">Next</NextButton>
          </ButtonGroup>
        </form>
      </Card>
    </Wrapper>
  );
}