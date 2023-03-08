import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextFieldProps } from '@mui/material';
import { DesktopDatePicker, } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { Details } from '@/interfaces';
import getLocaleDateString from '../../utils/dateformat';
import dayjs from 'dayjs';

interface Props {
  details: Details;
  handleDate: (newValue: Date) => void;
  handleDueDate: (newValue: Date) => void;
}

export default function DatePickerComponent({
  details,
  handleDate,
  handleDueDate,
}: Props): JSX.Element {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Invoice Date"
          value={new Date(details.invoiceDate)}
          onChange={(value: Date | null) => handleDate(value as Date)}
          
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Invoice Due Date"
          value={new Date(details.dueDate)}
          onChange={(value: Date | null) => handleDueDate(value as Date)}
          
        />
      </LocalizationProvider>
    </>
  );
}
