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
  margin-bottom: 0.5rem;
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
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, #7c3aed, #9333ea);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
`;

export default function SignupStep1({ formData, setFormData, next }) {
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.securityQuestion?.trim()) newErrors.securityQuestion = 'Security question is required';
    if (!formData.securityAnswer?.trim()) newErrors.securityAnswer = 'Answer is required';

    return newErrors;
  };

  const handleNext = e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      next(); // All validations passed
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Step 1: Personal Information</Title>
        <form onSubmit={handleNext}>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}

          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}

          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          {errors.phone && <ErrorText>{errors.phone}</ErrorText>}

          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          <Input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}

          <Input
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            placeholder="Security Question"
          />
          {errors.securityQuestion && <ErrorText>{errors.securityQuestion}</ErrorText>}

          <Input
            name="securityAnswer"
            value={formData.securityAnswer}
            onChange={handleChange}
            placeholder="Answer"
          />
          {errors.securityAnswer && <ErrorText>{errors.securityAnswer}</ErrorText>}

          <Button type="submit">Next</Button>
        </form>
      </Card>
    </Wrapper>
  );
}