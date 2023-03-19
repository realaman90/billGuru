import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import { useRouter } from 'next/router';

import {
  Alert,
  Box,
  Checkbox,
  Divider,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import Input from '@/components/ui.micro/Input';
import { PrimaryButton } from '@/components/ui.micro/Buttons';
import { validateForm } from '@/lib/validation';
import GoogleButton from '@/components/ui.micro/GoogleBtn';
import { useSession, signIn } from 'next-auth/react';
import { LoadingButton } from '@mui/lab';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  marginTop: 10,
  paddingTop: 20,
  paddingBottom: 30,
}));
type errors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  existingUser?: string;
};
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

function Register() {
  const router = useRouter();
  // set form data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [terms, setTerms] = useState(true);

  // set errors with type errors or null
  const [errors, setErrors] = useState<errors | null>(null);

  //toggle snackbar when user already exists
  const [open, setOpen] = useState(false);

  //set loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let formErrors = validateForm(userData, touched);
    setErrors({ ...errors, ...formErrors });
  }, [userData, touched]);

  // handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate form
    //check all the inputs are touched
    if (
      !touched.name ||
      !touched.email ||
      !touched.password ||
      !touched.confirmPassword
    ) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
    }
    let formErrors = validateForm(userData, touched);

    setErrors({ ...formErrors });
    // console.log(errors);
    // if there are no errors, submit the form
    if (
      errors?.name === '' &&
      errors?.email === '' &&
      errors?.password === '' &&
      errors?.confirmPassword === ''
    ) {
      // submit form
      setLoading(true);
      // console.log('Iam running');

      const { name, email, confirmPassword, newsletter } = userData;
      try {
        const res = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password: confirmPassword,
            newsletter,
          }),
        });
        const data = await res.json();

        if (data.message === 'User created successfully') {
          // call next auth login
          const res = await signIn('credentials', {
            email,
            password: confirmPassword,
            redirect: false,
          });
          if (res?.status === 200) {            
            router.push('/dashboard');
          } else {
            console.log(res?.error);
          }
        } else if (data.message === 'User already exists') {
          setOpen(true);
          setLoading(false);
          setErrors({ ...errors, existingUser: 'Email already registered' });
        } else {
          setOpen(true);
          setLoading(false);
          setErrors({ ...errors, existingUser: 'Please fill all values' });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  // handle google login
  const handleGoogle = async () => {
    const res = await signIn('google', {
      callbackUrl: `${baseUrl}/dashboard`,
    });
  };
  //handle snackbar close
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Item
          elevation={2}
          sx={{
            width: { xs: '350px', sm: '400px', md: '600px' },
            height: 'fit-content',
            padding: '10px 50px',
            borderRadius: 3,
            alignContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'start',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ width: '100%' }}>
              Create an account
            </Typography>

            <Typography variant="body2" sx={{ width: '100%' }}>
              Already have an account? <Link href="/auth/login">Sign in</Link>
            </Typography>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'start',
                flexDirection: 'column',
                gap: 2,
                marginTop: 2,
              }}
            >
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Input
                  input={{
                    id: 'name',
                    label: 'Full Name*',
                    value: `${userData.name}`,
                  }}
                  sx={{ width: '100%' }}
                  error={touched.name && errors?.name ? true : false}
                  helperText={errors?.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUserData({ ...userData, name: e.target.value });
                    setTouched({ ...touched, name: true });
                  }}
                />

                <Input
                  input={{
                    id: 'email',
                    label: 'Email',
                    value: userData.email,
                  }}
                  sx={{ width: '100%', marginTop: 2 }}
                  error={errors?.email ? true : false}
                  helperText={errors?.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUserData({ ...userData, email: e.target.value });
                    setTouched({ ...touched, email: true });
                  }}
                />

                <Input
                  input={{
                    id: 'password',
                    label: 'Password',
                    value: userData.password,
                    type: 'password',
                  }}
                  sx={{ width: '100%', marginTop: 2 }}
                  error={touched.password && errors?.password ? true : false}
                  helperText={errors?.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUserData({ ...userData, password: e.target.value });
                    setTouched({ ...touched, password: true });
                  }}
                />

                <Input
                  input={{
                    id: 'confirmPassword',
                    label: 'Confirm Password',
                    value: userData.confirmPassword,
                    type: 'password',
                  }}
                  sx={{ width: '100%', marginTop: 2 }}
                  error={
                    touched.confirmPassword && errors?.confirmPassword
                      ? true
                      : false
                  }
                  helperText={errors?.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUserData({
                      ...userData,
                      confirmPassword: e.target.value,
                    });
                    setTouched({ ...touched, confirmPassword: true });
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    checked={userData.newsletter}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUserData({ ...userData, newsletter: e.target.checked })
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ display: 'inline-block', marginLeft: 1 }}
                  >
                    Subscribe to our newsletter
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    checked={terms}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTerms(e.target.checked)
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ display: 'inline-block', marginLeft: 1 }}
                  >
                    I agree to the{' '}
                    <Link href="/terms" underline="hover">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" underline="hover">
                      Privacy Policy
                    </Link>
                  </Typography>
                </Box>
                <LoadingButton
                  disabled={!terms}
                  type="submit"
                  variant="contained"
                  loading={loading}
                  sx={{ width: '100%', marginTop: 2 }}
                >
                  <span>Create Account</span>
                </LoadingButton>
              </form>
              {/* Continue with Google */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 2,
                  marginTop: 2,
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    height: 1,
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Divider
                    sx={{
                      mt: 1,
                      width: '30%',
                      height: 1,
                      backgroundColor: '#e0e0e0',
                    }}
                  />
                  <Typography variant="body2">0R</Typography>
                  <Divider
                    sx={{
                      mt: 1,
                      width: '30%',
                      height: 1,
                      backgroundColor: '#e0e0e0',
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 2,
                    marginTop: 2,
                  }}
                >
                  <GoogleButton
                    onClick={handleGoogle}
                    label={'CONTINUE WITH GOOGLE'}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Item>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ minWidth: '340px', maxWidth: '400px' }}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            elevation={6}
            sx={{ width: '100%' }}
          >
            {errors?.existingUser}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default Register;
