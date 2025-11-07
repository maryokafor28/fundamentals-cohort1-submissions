// components/auth/RegisterLogin.tsx
import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Users } from '../../services/user.service';
import toast from 'react-hot-toast';
import validator from 'validator';
import { useRouter } from 'next/router';
import { Context } from '../../context';

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  result?: T;
};

type UserResult = {
  user?: any;
  token?: string;
};

interface IRegisterLoginProps {
  isResgisterForm?: boolean; // legacy typo support
  isRegisterForm?: boolean;
}

const initialForm = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
};

const getErrorMessage = (err: any) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';

const RegisterLogin: FC<IRegisterLoginProps> = (props) => {
  const isRegister = props.isRegisterForm ?? props.isResgisterForm ?? false;

  const [authForm, setAuthForm] = useState({ ...initialForm });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForgotPwd, setIsLoadingForgotPwd] = useState(false);
  const [otpTime, setOtpTime] = useState(false);
  const [otpForm, setOtpForm] = useState({ email: '', otp: '' });

  const { state, dispatch } = useContext(Context) as any;
  const user = state?.user;

  const router = useRouter();

  useEffect(() => {
    if (user && user.email) {
      router.push('/my-account');
    }
  }, [user, router]);

  /** Register new user */
  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const { email, name, password, confirmPassword } = authForm;

      if (!name) throw new Error('Invalid name');
      if (!validator.isEmail(email)) throw new Error('Invalid email');
      if (password !== confirmPassword) throw new Error('Passwords do not match');
      if (password.length < 6) throw new Error('Password must be at least 6 characters');

      setIsLoading(true);

      const payload = { email, name, password };
      const res = (await Users.registerNewUser(payload)) as ApiResponse;

      if (!res.success) throw new Error(res.message);

      // Show OTP input
      setOtpForm(prev => ({ ...prev, email }));
      setOtpTime(true);

      toast.success(res.message);
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /** Login existing user */
  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const { email, password } = authForm;
      if (!validator.isEmail(email)) throw new Error('Invalid email');
      if (password.length < 6) throw new Error('Password must be at least 6 characters');

      setIsLoading(true);

      const payload = { email, password };
      const res = (await Users.loginUser(payload)) as ApiResponse<UserResult>;

      if (!res.success) throw new Error(res.message);

      dispatch?.({ type: 'LOGIN', payload: res.result?.user });

      toast.success(res.message);
      router.push('/');
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /** Resend OTP */
  const otpResend = async () => {
    try {
      if (!validator.isEmail(otpForm.email)) throw new Error('Invalid email');

      setIsLoading(true);
      const res = (await Users.resendOTP(otpForm.email)) as ApiResponse;
      if (!res.success) throw new Error(res.message);

      toast.success(res.message);
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /** Verify user OTP */
  const verifyUser = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      if (!validator.isEmail(otpForm.email)) throw new Error('Invalid email');

      setIsLoading(true);
      const res = (await Users.verifyOTP(otpForm.otp, otpForm.email)) as ApiResponse;

      if (!res.success) throw new Error(res.message);

      toast.success(res.message);
      setOtpTime(false);
      setAuthForm({ ...initialForm });
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /** Forgot password */
  const forgotPassword = async (e?: React.MouseEvent | React.FormEvent) => {
    e?.preventDefault();
    try {
      if (!validator.isEmail(authForm.email)) throw new Error('Invalid email');

      setIsLoadingForgotPwd(true);
      const res = (await Users.forgotUserPassword(authForm.email)) as ApiResponse;

      if (!res.success) throw new Error(res.message);

      toast.success(res.message);
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoadingForgotPwd(false);
    }
  };

  /** Central form submit handler */
  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpTime) return verifyUser();
    if (isRegister) return handleRegister();
    await handleLogin();
  };

  return (
    <Card>
      <Card.Header>{isRegister ? 'Register' : 'Login'}</Card.Header>
      <Card.Body>
        <Form onSubmit={onFormSubmit}>
          {isRegister && (
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your full name"
                disabled={otpTime}
                value={authForm.name}
                onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              disabled={otpTime}
              value={authForm.email}
              onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              disabled={otpTime}
              value={authForm.password}
              onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))}
            />
          </Form.Group>

          {isRegister && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Re-type password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-type your password"
                  disabled={otpTime}
                  value={authForm.confirmPassword}
                  onChange={e =>
                    setAuthForm(p => ({ ...p, confirmPassword: e.target.value }))
                  }
                />
              </Form.Group>

              {otpTime && (
                <Form.Group className="mb-3">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otpForm.otp}
                    onChange={e => setOtpForm(p => ({ ...p, otp: e.target.value }))}
                  />
                  <Button variant="link" className="resendOtpBtn p-0" onClick={otpResend}>
                    Resend OTP
                  </Button>
                </Form.Group>
              )}
            </>
          )}

          <Form.Group className="mb-3">
            <Button variant="info" type="submit" disabled={isLoading}>
              {isLoading && <span className="spinner-border spinner-border-sm me-2" />}
              {otpTime ? 'Submit OTP' : isRegister ? 'Register' : 'Login'}
            </Button>
          </Form.Group>
        </Form>

        {!isRegister && (
          <div>
            <button
              style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
              onClick={forgotPassword}
              disabled={isLoadingForgotPwd}
            >
              {isLoadingForgotPwd && <span className="spinner-border spinner-border-sm me-2" />}
              Forgot your password?
            </button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RegisterLogin;
