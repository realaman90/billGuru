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
import { signIn } from 'next-auth/react';
import { LoadingButton } from '@mui/lab';

// base url for api and redirect
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  marginTop: 10,
  paddingTop: 20,
  paddingBottom: 30,
}));
type errors = {
  email?: string;
  password?: string;
  userError?: string;
};

function Login() {
  const router = useRouter();
  // set form data
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [terms, setTerms] = useState(true);
  // set Loading state
  const [loading, setLoading] = useState(false);

  // set errors with type errors or null
  const [errors, setErrors] = useState<errors | null>(null);

  // When error is set, show snackbar
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let formErrors = validateForm(userData, touched);
    setErrors({ ...errors, ...formErrors });
  }, [userData, touched]);

  // handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Iam running');
    // validate form
    //chechk all the inputs are touched
    
    let formErrors = validateForm(userData, touched);

    setErrors({ ...formErrors });


    // if there are no errors, submit the form
    if (!errors?.email && !errors?.password) {
      // submit form

        setLoading(true);
      const { email, password } = userData;
      try {
        const status = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        console.log(status);
        if (status?.status === 200) {
          router.push('/dashboard');
        } else {
          setOpen(true);
          setLoading(false);          
          setErrors({ userError: 'Invalid Credentials' });
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };
  // handle google login
  const handleGoogle = async () => {
    signIn('google', { callbackUrl: `${baseUrl}/dashboard` });
  };
  // handle snackbar close
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
              Login
            </Typography>

            <Typography variant="body2" sx={{ width: '100%' }}>
              Don't have an account? <Link href="/auth/register">Register</Link>
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

                <LoadingButton
                  disabled={!terms}
                  loading={loading}
                  variant="contained"
                  type="submit"
                  sx={{ width: '100%', marginTop: 2 }}
                >
                  Login
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
                    label={'Sign in with Google'}
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
            {errors?.userError}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default Login;
