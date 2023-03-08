import { TextField, TextFieldProps } from '@mui/material';

interface InputTypeProps{
  input: any,
  variant:string,
  size:string,
  
  onChange:Function

}
export default function Input({ input, ...rest }: InputTypeProps) {
  return (
    <TextField {...input} {...rest} inputProps={{ fontFamily: 'monospace' }} />
  );
}
