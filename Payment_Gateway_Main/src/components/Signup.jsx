import React, { useState } from 'react';
import SignupStep1 from './SignupStep1';
import SignupStep2 from './SignupStep2';
import SignupStep3 from './SignupStep3';
import SignupStep4 from './SignupStep4';
import SignupSuccess from './SignupSuccess';

export default function Signup() {
  const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  securityQuestion: '',
  securityAnswer: '',
  bankName: '',
  accountHolderName: '',
  bankAccountNumber: '',
  ifsc: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  panCard: '',
  aadhaarCard: ''
});

  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);

  switch (step) {
    case 1:
      return <SignupStep1 formData={formData} setFormData={setFormData} next={next} />;
    case 2:
      return <SignupStep3 formData={formData} setFormData={setFormData} next={next} back={back} />;
    case 3:
      return <SignupStep4 formData={formData} setFormData={setFormData} back={back} />;
    case 4:
      return <SignupSuccess />;
    default:
      return null;
  }
}