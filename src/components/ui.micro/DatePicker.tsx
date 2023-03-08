import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import dayjs, { Dayjs } from 'dayjs';
import { TextFieldProps, Box, TextField } from '@mui/material';

interface Props {
  className: string;
    size: 'small' | "medium";
  format: string;
  currValue: string;
  handleDate: (newValue: Dayjs) => void;
}




export default function DatePickerComponent({
  format,
    size,
  currValue,
  className,
  handleDate,
}: Props): JSX.Element {
  const [value, setValue] = useState<Dayjs | null>(dayjs(currValue));
  const dateInput = (props: TextFieldProps) => (
    <TextField
        {...props}
        size={size}       
        inputProps={{
            ...props.inputProps,
        
        }}
    />
);
 
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Invoice Date"
          className={className}
          format={format}
          value={value}
          onChange={(value: Dayjs | null) => {
            handleDate(value as Dayjs);
            setValue(value);
          }}
          slots={{
            
            textField:dateInput
            
          }}
          
        />
      </LocalizationProvider>
    </>
  );
}
