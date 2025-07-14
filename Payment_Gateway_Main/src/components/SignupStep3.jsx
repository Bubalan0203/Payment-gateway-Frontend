import React, { useState } from 'react';
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

const ErrorText = styled.p`
  color: #dc2626;
  margin: -0.8rem 0 1rem 0;
  font-size: 0.875rem;
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
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const { addressLine1, city, state, country, zip } = formData;
    const newErrors = {};

    if (!addressLine1?.trim())
      newErrors.addressLine1 = 'Address Line 1 is required';
    else if (addressLine1.length < 5)
      newErrors.addressLine1 = 'Address must be at least 5 characters';

    if (!city?.trim())
      newErrors.city = 'City is required';
    else if (!/^[A-Za-z\s]{2,50}$/.test(city))
      newErrors.city = 'City must contain only letters and be 2–50 characters';

    if (!state?.trim())
      newErrors.state = 'State is required';
    else if (!/^[A-Za-z\s]{2,50}$/.test(state))
      newErrors.state = 'State must contain only letters and be 2–50 characters';

    if (!country?.trim())
      newErrors.country = 'Country is required';

    if (!zip)
      newErrors.zip = 'ZIP code is required';
    else if (!/^\d{5,6}$/.test(zip))
      newErrors.zip = 'ZIP code must be 5 or 6 digits';

    return newErrors;
  };

  const handleNext = e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      next();
    }
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
          />
          {errors.addressLine1 && <ErrorText>{errors.addressLine1}</ErrorText>}

          <Input
            name="addressLine2"
            value={formData.addressLine2 || ''}
            onChange={handleChange}
            placeholder="Address Line 2"
          />

          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
          {errors.city && <ErrorText>{errors.city}</ErrorText>}

          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
          />
          {errors.state && <ErrorText>{errors.state}</ErrorText>}

          <Input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
          {errors.country && <ErrorText>{errors.country}</ErrorText>}

          <Input
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="ZIP Code"
          />
          {errors.zip && <ErrorText>{errors.zip}</ErrorText>}

          <ButtonGroup>
            <BackButton type="button" onClick={back}>Back</BackButton>
            <NextButton type="submit">Next</NextButton>
          </ButtonGroup>
        </form>
      </Card>
    </Wrapper>
  );
}