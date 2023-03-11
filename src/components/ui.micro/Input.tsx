import { TextField, TextFieldProps } from '@mui/material';

interface InputTypeProps {
  input?: any,
  variant?:string,
  size?:string,
  sx?:any,  
  onChange?:Function,
  error?:Boolean,
  helperText?:string,
  onFocus?:Function,
  params?:TextFieldProps

}
export default function Input({ input, ...rest }: InputTypeProps) {
  return (
    <TextField {...input} {...rest}  />
  );
}
