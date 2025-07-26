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
  max-width: 600px;
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
`;

const ErrorText = styled.p`
  color: #dc2626;
  margin: -0.4rem 0 1rem 0;
  font-size: 0.875rem;
`;

const AccountWrapper = styled.div`
  padding: 1rem;
  border: 1px solid #ddd6fe;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: white;
  margin: 0.5rem 0;
`;

const BackButton = styled(Button)`
  background: #6b7280;
`;

const NextButton = styled(Button)`
  background: linear-gradient(to right, #7c3aed, #9333ea);
`;

const AddAccountButton = styled.button`
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 0.5rem;
  cursor: pointer;
`;

export default function SignupStep2({ formData, setFormData, next, back }) {
  const [errors, setErrors] = useState([]);

  const handleChange = (index, e) => {
    const updated = [...formData.bankAccounts];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, bankAccounts: updated });

    const newErrors = [...errors];
    if (newErrors[index]) newErrors[index][e.target.name] = '';
    setErrors(newErrors);
  };

  const addBankAccount = () => {
    const updated = [...(formData.bankAccounts || [])];
    updated.push({
      bankName: '',
      accountHolderName: '',
      bankAccountNumber: '',
      ifscCode: '',
      phoneNumber: ''
    });
    setFormData({ ...formData, bankAccounts: updated });
    setErrors([...errors, {}]);
  };

  const removeBankAccount = index => {
    const updated = [...formData.bankAccounts];
    updated.splice(index, 1);
    const newErrors = [...errors];
    newErrors.splice(index, 1);
    setFormData({ ...formData, bankAccounts: updated });
    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = [];

    (formData.bankAccounts || []).forEach((acc, idx) => {
      const err = {};
      if (!acc.bankName?.trim()) err.bankName = 'Bank name is required';
      if (!acc.accountHolderName?.trim()) err.accountHolderName = 'Account holder name is required';
      if (!acc.bankAccountNumber) err.bankAccountNumber = 'Account number is required';
      else if (!/^\d{9,18}$/.test(acc.bankAccountNumber)) err.bankAccountNumber = 'Invalid account number';
      if (!acc.ifscCode) err.ifscCode = 'IFSC code is required';
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(acc.ifscCode.toUpperCase())) err.ifscCode = 'Invalid IFSC';
      if (!acc.phoneNumber) err.phoneNumber = 'Phone number is required';
      else if (!/^\d{10}$/.test(acc.phoneNumber)) err.phoneNumber = 'Invalid phone number';

      newErrors[idx] = err;
    });

    return newErrors;
  };

  const handleNext = e => {
    e.preventDefault();
    const validationErrors = validate();
    const hasErrors = validationErrors.some(err => Object.keys(err).length > 0);
    if (hasErrors) {
      setErrors(validationErrors);
    } else {
      // Normalize IFSC codes
      const updatedAccounts = formData.bankAccounts.map(acc => ({
        ...acc,
        ifscCode: acc.ifscCode.toUpperCase()
      }));
      setFormData({ ...formData, bankAccounts: updatedAccounts });
      next();
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Step 2: Bank Details</Title>

        <AddAccountButton type="button" onClick={addBankAccount}>+ Add Bank Account</AddAccountButton>

        {(formData.bankAccounts || []).map((account, idx) => (
          <AccountWrapper key={idx}>
            <Input
              name="bankName"
              value={account.bankName}
              onChange={e => handleChange(idx, e)}
              placeholder="Bank Name"
            />
            {errors[idx]?.bankName && <ErrorText>{errors[idx].bankName}</ErrorText>}

            <Input
              name="accountHolderName"
              value={account.accountHolderName}
              onChange={e => handleChange(idx, e)}
              placeholder="Account Holder Name"
            />
            {errors[idx]?.accountHolderName && <ErrorText>{errors[idx].accountHolderName}</ErrorText>}

            <Input
              name="bankAccountNumber"
              value={account.bankAccountNumber}
              onChange={e => handleChange(idx, e)}
              placeholder="Bank Account Number"
            />
            {errors[idx]?.bankAccountNumber && <ErrorText>{errors[idx].bankAccountNumber}</ErrorText>}

            <Input
              name="ifscCode"
              value={account.ifscCode}
              onChange={e => handleChange(idx, e)}
              placeholder="IFSC Code"
            />
            {errors[idx]?.ifscCode && <ErrorText>{errors[idx].ifscCode}</ErrorText>}

            <Input
              name="phoneNumber"
              value={account.phoneNumber}
              onChange={e => handleChange(idx, e)}
              placeholder="Bank Registered Phone Number"
            />
            {errors[idx]?.phoneNumber && <ErrorText>{errors[idx].phoneNumber}</ErrorText>}

            {formData.bankAccounts.length > 1 && (
              <RemoveButton type="button" onClick={() => removeBankAccount(idx)}>
                Remove
              </RemoveButton>
            )}
          </AccountWrapper>
        ))}

        <ButtonGroup>
          <BackButton type="button" onClick={back}>Back</BackButton>
          <NextButton type="submit" onClick={handleNext}>Next</NextButton>
        </ButtonGroup>
      </Card>
    </Wrapper>
  );
}