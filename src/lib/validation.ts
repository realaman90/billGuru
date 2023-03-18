// validation for email and password
export const validateEmail = (email?: string) => {
  const re = /\S+@\S+\.\S+/;
  if (email !== undefined) {
    return re.test(email);
  }
};

export const validatePassword = (password?: string) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password !== undefined) {
    return re.test(password);
  }
};
interface userData {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: Boolean;
}
interface touched {
  name?: Boolean;
  email?: Boolean;
  password?: Boolean;
  confirmPassword?: Boolean;
}
interface errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

//validate register form
export const validateForm = (userData: userData, touched: touched) => {
  let errors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
   
  };
  if (touched.email) {
    
    const emailError = validateEmail(userData.email);
    if (emailError === false) {
      errors.email = 'Email is invalid';
    }
  }
  if (touched.password) {
    const passwordError = validatePassword(userData.password);
    if (passwordError === false) {
      errors.password =
        'Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

  }
  if (touched.confirmPassword) {
    const confirmPasswordError =
      userData.password === userData.confirmPassword ? true : false;
    if (confirmPasswordError === false) {
      errors.confirmPassword = 'Passwords must match';
    }

  }
  if (touched.name) {
    const nameError =
      userData.name === undefined || userData.name.length === 0 ? true : false;
    if (nameError === true) {
      errors.name = 'Name is required';
    }
  }
 



  return errors;
};
