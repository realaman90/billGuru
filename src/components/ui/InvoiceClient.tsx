import React, { useEffect, useState } from 'react';
import { Client, InvoiceForm } from '@/interfaces';
import { useAppDispatch, useAppSelector } from '@/global.redux/hooks';
import { useCreateClientMutation, useGetClientsQuery } from '@/global.redux';
import { updateClient } from '@/global.redux';

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
interface CurrentClientType {
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

const filter = createFilterOptions<CurrentClientType>();

export default function InvoiceClient({ invoice }: InvoiceProps) {
  //Redux
  const dispatch = useAppDispatch();
  const [createClient, { isLoading }] = useCreateClientMutation();

  //Component States
  const [client, setClient] = useState<CurrentClientType | null>(null);

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

  useEffect(() => {
    setClient(invoice.client);
  }, [invoice.client]);

  let data: Client[] = [];
  data = useGetClientsQuery(undefined).data;

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
      const client: Client = {
        id,
        name,
        address,
        email,
        businessNumber,
        phone,
        pinCode,
        vat,
      };

      dispatch(updateClient(client));
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
        const data: Client = await createClient(dialogueValue).unwrap();
        dispatch(updateClient(data));
        setClient(data);
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
        <Typography variant="h6">Client</Typography>
        {data && (
          <Autocomplete
            size="small"
            freeSolo={true}
            id="client-name"
            value={client}
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
              <TextField {...params} label="Client Name" />
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
            id: 'client-address',
            label: 'Client Address',
            type: 'text',
            value: `${client?.address}`,
          }}
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          variant="outlined"
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Client = {
              ...invoice.client,
              address: e.target.value,
            };
            dispatch(updateClient(data));
          }}
        />
        <Input
          input={{
            id: 'client-email',
            label: 'Client Email',
            type: 'email',
            value: `${client?.email}`,
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
            const data: Client = {
              ...invoice.client,
              email: e.target.value,
            };
            dispatch(updateClient(data));
          }}
        />
        <Input
          input={{
            id: 'client-business-number',
            label: 'Client Business Number',
            type: 'text',
            value: `${client?.businessNumber}`,
          }}
          variant="outlined"
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Client = {
              ...invoice.client,
              businessNumber: e.target.value,
            };
            dispatch(updateClient(data));
          }}
        />
        <Input
          input={{
            id: 'client-phone',
            label: 'Client Phone',
            type: 'text',
            value: `${client?.phone}`,
          }}
          variant="outlined"
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Client = {
              ...invoice.client,
              phone: e.target.value,
            };
            dispatch(updateClient(data));
          }}
        />
        <Input
          input={{
            id: 'client-pin-code',
            label: 'Client Pin Code',
            type: 'text',
            value: `${client?.pinCode}`,
          }}
          variant="outlined"
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Client = {
              ...invoice.client,
              pinCode: e.target.value,
            };
            dispatch(updateClient(data));
          }}
        />
        <Input
          input={{
            id: 'client-vat',
            label: 'Client Vat',
            type: 'text',
            value: `${client?.vat}`,
          }}
          variant="outlined"
          sx={{
            width: '100%',
            margin: '10px 0',
          }}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const data: Client = {
              ...invoice.client,
              vat: e.target.value,
            };
            dispatch(updateClient(data));
          }}
        />
      </Box>

      {/* Add new Client */}
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
            Add New Client
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
                id: 'client-name',
                label: 'Client Name',
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
                id: 'client-address',
                label: 'Client Address',
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
                id: 'client-email',
                label: 'Client Email',
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
                id: 'client-business-number',
                label: 'Client Business Number',
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
                id: 'client-phone',
                label: 'Client Phone',
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
                id: 'client-pin-code',
                label: 'Client Pin Code',
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
                id: 'client-vat',
                label: 'Client Vat',
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
