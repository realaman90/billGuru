import React, { useEffect, useState } from 'react';
import { Sender, InvoiceForm } from '@/interfaces';
import { useAppDispatch, useAppSelector } from '@/global.redux/hooks';
import { useCreateSenderMutation, useGetSendersQuery } from '@/global.redux';
import { updateSender } from '@/global.redux';

import {
  Autocomplete,
  createFilterOptions,
  Box,
  TextFieldProps,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Input from '../ui.micro/Input';
interface InvoiceProps {
  invoice: InvoiceForm;
}
interface CurrentSenderType {
  inputValue?: string;
  id: string;
  name: string;
  address: string;
  email: string;
  businessNumber: string;
  phone: string;
  pinCode: string;
  vat: string;
}

const filter = createFilterOptions<CurrentSenderType>();

export default function InvoiceSender({ invoice }: InvoiceProps) {
  //Redux
  const dispatch = useAppDispatch();
  const [createSender, { isLoading }] = useCreateSenderMutation();

  //Component States
  const [sender, setSender] = useState<CurrentSenderType | null>(null);

  const [open, setOpen] = useState(false);
  const [openToast, setOpenToast] = useState(false);

  const [dialogueValue, setDialogueValue] = useState({
    id: '',
    address: '',
    email: '',
    businessNumber: '',
    phone: '',
    pinCode: '',
    vat: '',
    name: '',
  });

  //Use Effect Hook
  let data: Sender[] = [];
  data = useGetSendersQuery(undefined).data;
  useEffect(() => {
    if (data) {
      setSender(
        data[0]
        )}
  }, [data]);
  //Use Effect when invoice changes
  useEffect(() => {    
    setSender(invoice.sender);
  }, [invoice.sender]);


  
  

  //Autocomplete Value change
  const handleInputChange = (newValue: any) => {
    if (typeof newValue === 'string' && newValue != null) {
      setTimeout(() => {
        setOpen(true);
        setDialogueValue({
          id: '',
          name: newValue,
          address: '',
          email: '',
          businessNumber: '',
          phone: '',
          pinCode: '',
          vat: '',
        });
      });
    } else if (newValue && newValue.inputValue) {
      setOpen(true);
      setDialogueValue({
        id: '',
        name: newValue.inputValue,
        address: '',
        email: '',
        businessNumber: '',
        phone: '',
        pinCode: '',
        vat: '',
      });
    } else if (typeof newValue === 'object' && newValue != null) {
      const { id, name, address, email, businessNumber, phone, pinCode, vat } =
        newValue;
      const client: Sender = {
        id,
        name,
        address,
        email,
        businessNumber,
        phone,
        pinCode,
        vat,
      };

      dispatch(updateSender(client));
    }
  };

  // close new client form
  const handleDialogueClose = () => {
    setOpen(false);
  };

  //Create new client Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (regex.test(dialogueValue.email)) {
      e.preventDefault();
      try {
        const data: Sender = await createSender(dialogueValue).unwrap();
        dispatch(updateSender(data));
        setSender(data);
      } catch (error) {
        setOpenToast(true);
      }
    } else {
      e.preventDefault();
      setOpen(true);
      setOpenToast(true);
    }
  };
  //error message function

  //email validation
  let emailErrorVal = '';
  let dialogueEmailErrorVal = '';
  const regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regex.test(invoice.client.email) && invoice.client.email.length > 0) {
    emailErrorVal = 'Please enter valid mail';
  }
  if (!regex.test(dialogueValue.email) && dialogueValue.email.length > 0) {
    dialogueEmailErrorVal = 'Please enter valid email';
  }

  //Render
  return (
    <>
      <Box>
        <Typography variant="h6">From</Typography>
        {data && (
          <Autocomplete
            size="small"
            freeSolo={true}
            id="sender-name"
            value={sender}
            options={data}
            getOptionLabel={(option: any) => {
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            renderInput={(params: TextFieldProps) => (
              <TextField {...params} label="Sender Name" />
            )}
            onChange={(event, newValue) => handleInputChange(newValue)}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              if (params.inputValue !== '') {
                filtered.push({
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}"`,
                  id: '',
                  address: '',
                  email: '',
                  businessNumber: '',
                  phone: '',
                  pinCode: '',
                  vat: '',
                });
              }
              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={(props, data) => <li {...props}>{data.name}</li>}
          />
        )}
        <Input
          input={{
            id: 'sender-address',
            label: 'Sender Address',
            type: 'text',
            value: `${sender?.address}`,
          }}
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          variant="outlined"
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Sender = {
              ...invoice.sender,
              address: e.target.value,
            };
            dispatch(updateSender(data));
          }}
        />
        <Input
          input={{
            id: 'sender-email',
            label: 'Sender Email',
            type: 'email',
            value: `${sender?.email}`,
          }}
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          variant="outlined"
          size="small"
          error={emailErrorVal.length > 0 ? true : false}
          helperText={emailErrorVal}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Sender = {
              ...invoice.sender,
              email: e.target.value,
            };
            dispatch(updateSender(data));
          }}
        />
        <Input
          input={{
            id: 'sender-business-number',
            label: 'Sender Business Number',
            type: 'text',
            value: `${sender?.businessNumber}`,
          }}
          variant="outlined"
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Sender = {
              ...invoice.sender,
              businessNumber: e.target.value,
            };
            dispatch(updateSender(data));
          }}
        />
        <Input
          input={{
            id: 'sender-phone',
            label: 'Sender Phone',
            type: 'text',
            value: `${sender?.phone}`,
          }}
          variant="outlined"
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Sender = {
              ...invoice.sender,
              phone: e.target.value,
            };
            dispatch(updateSender(data));
          }}
        />
        <Input
          input={{
            id: 'sender-pin-code',
            label: 'Sender Pin Code',
            type: 'text',
            value: `${sender?.pinCode}`,
          }}
          variant="outlined"
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Sender = {
              ...invoice.sender,
              pinCode: e.target.value,
            };
            dispatch(updateSender(data));
          }}
        />
        <Input
          input={{
            id: 'sender-vat',
            label: 'Sender Vat',
            type: 'text',
            value: `${sender?.vat}`,
          }}
          variant="outlined"
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Sender = {
              ...invoice.sender,
              vat: e.target.value,
            };
            dispatch(updateSender(data));
          }}
        />
      </Box>

      {/* Add new sender */}
      <Dialog
        open={open}
        onClose={handleDialogueClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              textAlign: 'center',
            }}
          >
            Add New Business Name
            {openToast && (
              <Typography color={'red'}>Please enter valid email</Typography>
            )}
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              margin: '5px 0',
              alignContent: 'center',
            }}
          >
            <Input
              input={{
                id: 'sender-name',
                label: 'sender Name',
                type: 'text',
                value: `${dialogueValue?.name}`,
              }}
              sx={{
                width: '100%',
                margin: '10px 0',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                const { value }: { value: string } = e.target;

                setDialogueValue({ ...dialogueValue, name: value });
              }}
            />
            <Input
              input={{
                id: 'sender-address',
                label: 'sender Address',
                value: `${dialogueValue?.address}`,
              }}
              sx={{
                width: '100%',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setDialogueValue({ ...dialogueValue, address: e.target.value });
              }}
            />
            <Input
              input={{
                id: 'sender-email',
                label: 'sender Email',
                value: `${dialogueValue?.email}`,
              }}
              sx={{
                width: '100%',
                margin: '10px 0',
              }}
              error={dialogueEmailErrorVal.length > 0 ? true : false}
              helperText={dialogueEmailErrorVal}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setDialogueValue({ ...dialogueValue, email: e.target.value });
              }}
              onFocus={() => {
                setOpenToast(false);
              }}
            />
            <Input
              input={{
                id: 'sender-business-number',
                label: 'sender Business Number',
                value: `${dialogueValue?.businessNumber}`,
              }}
              sx={{
                width: '100%',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setDialogueValue({
                  ...dialogueValue,
                  businessNumber: e.target.value,
                });
              }}
            />
            <Input
              input={{
                id: 'sender-phone',
                label: 'sender Phone',
                value: `${dialogueValue?.phone}`,
              }}
              sx={{
                width: '100%',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setDialogueValue({ ...dialogueValue, phone: e.target.value });
              }}
            />
            <Input
              input={{
                id: 'sender-pin-code',
                label: 'sender Pin Code',
                value: `${dialogueValue?.pinCode}`,
              }}
              sx={{
                width: '100%',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setDialogueValue({ ...dialogueValue, pinCode: e.target.value });
              }}
            />
            <Input
              input={{
                id: 'sender-vat',
                label: 'sender Vat',
                value: `${dialogueValue?.vat}`,
              }}
              sx={{
                width: '100%',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setDialogueValue({ ...dialogueValue, vat: e.target.value });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogueClose}>Cancel</Button>
            <LoadingButton
              loading={isLoading}
              type="submit"
              variant="contained"
            >
              Save
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
