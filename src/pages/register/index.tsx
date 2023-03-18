import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import { useRouter } from 'next/router';

import { Box, Checkbox, Divider, Paper, Typography } from '@mui/material';
import styled from '@emotion/styled';
import Input from '@/components/ui.micro/Input';
import { PrimaryButton } from '@/components/ui.micro/Buttons';
import { validateForm } from '@/lib/validation';
import GoogleButton from '@/components/ui.micro/GoogleBtn';
import { signIn, } from 'next-auth/react';

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
};

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
  const[touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  })
  const[terms, setTerms] = useState(true)


  // set errors with type errors or null
  const [errors, setErrors] = useState<errors | null>(null);



  useEffect(() => {
    let formErrors = validateForm(userData, touched);
    setErrors({...errors, ...formErrors});
    
  }, [userData, touched]);

  // handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate form
    //chechk all the inputs are touched
    if (!touched.name || !touched.email || !touched.password || !touched.confirmPassword || !touched.terms) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        terms: true,
      });
    }
    let formErrors = validateForm(userData, touched);
   
    setErrors({...formErrors});
    console.log(errors)
    

    // if there are no errors, submit the form
    if (errors?.name === '' && errors?.email === '' && errors?.password === '' && errors?.confirmPassword === '' ) {
      // submit form
      console.log('Iam running');
      const { name, email, confirmPassword, newsletter } = userData;
     try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
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
      console.log(data);
      
      if(data.message === 'User created successfully'){
        // login user using next-auth
        const status =await signIn('credentials', {
          email,
          password: confirmPassword,
          callbackUrl: 'http://localhost:3000/',
      
        });
       

      }else{
        console.log(data.message)
      }
      
     } catch (error) {
        console.log(error)
      
     }
    }

  };
  // handle google login
  const handleGoogle = async() => {
    signIn('google', { callbackUrl: 'http://localhost:3000/' });
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
              Already have an account? <Link href="/login">Sign in</Link>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    {setUserData({ ...userData, name: e.target.value })
                    setTouched({...touched, name: true})
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    {setUserData({ ...userData, email: e.target.value })
                    setTouched({...touched, email: true})}
                  }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    {setUserData({ ...userData, password: e.target.value })
                    setTouched({...touched, password: true})

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
                  error={touched.confirmPassword && errors?.confirmPassword ? true : false}
                  helperText={errors?.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    {setUserData({
                      ...userData,
                      confirmPassword: e.target.value,
                    })
                    setTouched({...touched, confirmPassword: true})}
                  }
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
                     setTerms (e.target.checked )
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
                <PrimaryButton
                  disabled={!terms}
                  type="submit"
                  sx={{ width: '100%', marginTop: 2 }}
                >
                  Create Account
                </PrimaryButton>

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
                  <Typography variant="body2" >
                  0R
                </Typography>
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
                <GoogleButton onClick={handleGoogle} label={"CONTINUE WITH GOOGLE"} />
                
              </Box>
              </Box>


                  

            </Box>
          </Box>
        </Item>
      </Box>
    </>
  );
}

export default Register;
