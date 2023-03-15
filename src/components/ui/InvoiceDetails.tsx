import React, { useState } from 'react';
import { Box, Divider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from '@/global.redux/hooks';

import getLocaleDateString from '../../utils/dateformat';
import { InvoiceForm } from '@/interfaces';

import axios from 'axios';

import Input from '../ui.micro/Input';
import { ImageUploader } from '../ui.micro/ImageUploader';

import { updateDetails } from '../../global.redux';
import { padding } from '@mui/system';
import DatePickerComponent from '../ui.micro/DatePicker';
import { generateUrl } from '@/aws/config';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

interface InvoiceProps {
  invoice: InvoiceForm;
}

export default function InvoiceDetails({ invoice }: InvoiceProps) {
  let { details } = invoice;
  const dispatch = useAppDispatch();

  //for Date picker
  const [value, setValue] = useState(dayjs(Date.now()));

  const handleInvoiceNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    details = { ...details, invoiceNumber: value };
    console.log(details);
    dispatch(updateDetails(details));
  };
  // For Invoice Name
  const handleInvoiceNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    details = { ...details, invoiceName: value };
    dispatch(updateDetails(details));
  };
  // for date
  const handleDate = (newValue: Dayjs | null) => {
    if (newValue) {
      const date = dayjs(newValue).format();
      console.log(date);
      dispatch(updateDetails({ ...details, invoiceDate: date }));
    }
  };

  const handleDueDate = (newValue: Dayjs | null) => {
    if (newValue) {
      const date = dayjs(newValue).format();
      dispatch(updateDetails({ ...details, dueDate: date }));
    }
  };

  const handleImage = async (file: File) => {
    // upload image to s3
    const imageUploadUrl = await generateUrl();

    await fetch(imageUploadUrl, {
      method: 'PUT',
      body: file,
    });
    const updatedDetails = { ...details, logo: imageUploadUrl.split('?')[0] };
    dispatch(updateDetails(updatedDetails));
   
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        columns={{ xs: 6 }}
        sx={{ marginBottom: '10px', padding: 1 }}
      >
        <Grid
          xs={6}
          md={3}
          sx={{
            display: { xs: 'flex', md: 'block' },
            justifyContent: 'center',
          }}
        >
          <ImageUploader
            styleProps={{
              width: { xs: 120, sm: 150, md: 200 },
              height: { xs: 120, sm: 150, md: 200 },
            }}
            hoverStyles={{
              cursor: 'pointer',
              border: 'solid 1px #6750a4',
            }}
            label="Logo or Image"
            handleImageUpload={handleImage}
          />
        </Grid>
        <Grid xs={6} md={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Input
              input={{
                id: 'input1',
                label: 'Invoice Number',
                value: `${details.invoiceNumber}`,
              }}
              variant="outlined"
              size="small"
              onChange={handleInvoiceNumberChange}
            />
            <Input
              input={{
                id: 'input2',
                label: 'Invoice Name',
                value: `${details.invoiceName}`,
              }}
              variant="outlined"
              size="small"
              onChange={handleInvoiceNameChange}
            />
            <DatePickerComponent
              size="small"
              className="InvoiceDate"
              currValue={details.invoiceDate}
              handleDate={handleDate}
              format={'DD/MM/YYYY'}
            />
            <DatePickerComponent
              size="small"
              className="invoiceDueDate"
              currValue={details.dueDate}
              handleDate={handleDueDate}
              format={'DD/MM/YYYY'}
            />
          </Box>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}
