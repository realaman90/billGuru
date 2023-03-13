import { InvoiceForm } from '@/interfaces';
import React from 'react';
import {
  Autocomplete,
  Divider,
  Typography,
  TextField,
  IconButton,
  Checkbox,
} from '@mui/material';
import { Box } from '@mui/system';
import { Add } from '@mui/icons-material';
import { PrimaryButton, OutlineButton } from '../ui.micro/Buttons';
import { currencies } from '@/utils/currencies';
import Input from '../ui.micro/Input';
import { useState } from 'react';
import { useAppDispatch } from '@/global.redux/hooks';
import { addFee, changeCurrency } from '@/global.redux';

interface InvoiceProps {
  invoice: InvoiceForm;
}

export default function InvoiceSettings({ invoice }: InvoiceProps) {
  const dispatch = useAppDispatch();
  const [toggle, setToggle] = useState(false);
  const [feeName, setFeeName] = useState('');
  const [feeAmount, setFeeAmount] = useState(0);
  const [feeTax, setFeeTax] = useState(0);

  const handleAddFee = () => {
    if(typeof feeAmount !== 'number'){
        dispatch(addFee({
            name: feeName,
            amount: 0,
            tax: 0,}))
        return;
    }
    dispatch(
        addFee({
          name: feeName,
          amount: feeAmount,
          tax: (feeTax * feeAmount) / 100,
        })
      );
      setFeeName('');
      setFeeAmount(0);
      setFeeTax(0);
      setToggle(!toggle);
  };

  const handleCheckBoxChange = (): void => {
    setToggle(!toggle);
  };

  const handleInputChange = (value: any) => {
    if (value) {
      dispatch(changeCurrency(value.value));
    }
  };
  return (
    <>
      <Box
        sx={{
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Typography variant="subtitle1"> Choose Template</Typography>
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Typography>{'template name'}</Typography>
          <PrimaryButton>Change template</PrimaryButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          justifyContent: 'center',
          padding: '10px',
        }}
      >
        <Typography variant="subtitle1"> Currency</Typography>
        <Autocomplete
          value={currencies[0]}
          id="country-select-demo"
          size="small"
          fullWidth
          options={currencies}
          autoHighlight
          getOptionLabel={(option) =>
            option.emoji + ' ' + option.label + '  ' + option.value
          }
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              {option.emoji} {option.label} {option.value}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Type"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
          onChange={(event, value, reason) => handleInputChange(value)}
        />
      </Box>
      <Divider></Divider>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '10px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1">Add Fee</Typography>
        </Box>
        <Input
          size="small"
          input={{
            label: 'Fee Name',
            value: feeName,
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFeeName(e.target.value)
          }
        />
        <Input
          size="small"
          input={{
            label: 'Fee Amount',
            value: feeAmount,
            type:'number'
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFeeAmount(parseFloat(e.target.value))
          }
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onClick={handleCheckBoxChange}
        >
          <Typography>Add Tax on fee</Typography>
          <Checkbox
            checked={toggle}
            onChange={handleCheckBoxChange}
            size="small"
          />
        </Box>
        {toggle && (
          <Input
            size="small"
            input={{
              label: 'Fee Tax',
              value: feeTax,
                type:'number'
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFeeTax(parseFloat(e.target.value))
            }
          />
        )}
        <OutlineButton onClick={handleAddFee}>Add Fee</OutlineButton>
      </Box>
    </>
  );
}


