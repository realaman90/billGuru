
import React from 'react';

import { Box, Divider, IconButton, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AttachFile, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';

import { PrimaryButton } from '../ui.micro/Buttons';
import getLocaleDateString from '../../utils/dateformat';
import { InvoiceForm } from '@/interfaces';
import { removeFee } from '@/global.redux';
import { useAppDispatch } from '@/global.redux/hooks';

interface InvoiceBottomContainerProps {
  invoice: InvoiceForm;
}

export default function InvoiceBottomContainer({
  invoice,
}: InvoiceBottomContainerProps) {
  const dispatch = useAppDispatch();
  const handleDeleteFee = (index: number) => () => {
    dispatch(removeFee(index))
  };

  const renderFee = (label: string) =>
    invoice.fee.map((fee: any, index: number) => {
      if (label === 'label') {
        return (
          <React.Fragment key={index}>
            {fee.name && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                  <IconButton onClick={handleDeleteFee(index)}><Delete /></IconButton>  
                  <Typography>{fee.name}</Typography>
                  </Box>
                  <Typography variant="subtitle1">
                    {invoice.currency}
                    {fee.amount}
                  </Typography>
                </Box>
                {fee.tax > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>Tax on {fee.name}</Typography>
                    <Typography variant="subtitle1">
                      {invoice.currency}
                      {fee.tax}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </React.Fragment>
        );
      }
    });
  return (
    <>
      <Grid container columns={{ xs: 8, sm: 12 }}>
        <Grid xsOffset={1} xs={7} sm={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '5px',
                margin: '10px 0',
              }}
            >
              <Typography variant="subtitle1">Subtotal</Typography>
              <Typography variant="subtitle1">
                {invoice.currency}
                {invoice.subtotal}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '5px',
              }}
            >
              {invoice.totalTax >= 0 && <Typography>Taxes</Typography>}
              <Typography variant="subtitle1">
                {invoice.currency}
                {invoice.totalTax}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '5px',
              }}
            >
              {invoice.totalDiscount > 0 && <Typography>Discount</Typography>}
              {invoice.totalDiscount > 0 && (
                <Typography variant="subtitle1">
                  {invoice.currency}
                  {invoice.totalDiscount}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                justifyContent: 'space-between',
                paddingRight: '5px',
              }}
            >
              {renderFee('label')}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Grid container columns={{ xs: 8, sm: 12 }}>
        <Grid xsOffset={1} xs={7} sm={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingRight: '5px',
            }}
          >
            <Typography marginTop={2} variant="subtitle1">
              Total
            </Typography>
            <Typography marginTop={2} variant="subtitle1">
              {invoice.currency}
              {invoice.total}
            </Typography>
          </Box>
          {invoice.payments.length > 1 && (
            <Box
              sx={{
                margin: '10px 0px',
              }}
            >
              <Typography variant="subtitle1">Payment Record</Typography>
              <Box
                sx={{
                  margin: '10px 0px',
                }}
              >
                {invoice.payments.map(
                  (payment: any, index: number) =>
                    payment.amount > 0 && (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">{`${dayjs(
                          payment.date
                        ).format(getLocaleDateString())}`}</Typography>
                        <Typography variant="subtitle1">
                          {invoice.currency}
                          {payment.amount}
                        </Typography>
                      </Box>
                    )
                )}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
      <Divider />
      <Grid container columns={{ xs: 8, sm: 12 }}>
        <Grid xsOffset={1} xs={7} sm={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingRight: '5px',
              margin: '10px 0px',
            }}
          >
            <Typography variant="subtitle1">Balance Due</Typography>
            <Typography variant="subtitle1">
              {invoice.currency}
              {invoice.balanceDue}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container columns={{ xs: 8, md: 12 }}>
        <Grid xsOffset={1} xs={7} sm={10}>
          <Box>
            <TextField label="Additional Notes" fullWidth multiline />
          </Box>
        </Grid>
      </Grid>
      <Box margin={2}>
        <PrimaryButton
          css={{ cursor: 'pointer', marginBottom: '20px' }}
          startIcon={<AttachFile fontSize="small"></AttachFile>}
        >
          <label htmlFor="files" style={{ cursor: 'pointer' }}>
            Attach File
          </label>
          <input
            name="uploads"
            id="files"
            type="file"
            style={{ display: 'none' }}
            accept=".jpg, .jpeg, .png, .svg, .gif , .pdf , .docx"
          />
        </PrimaryButton>
      </Box>
    </>
  );
}
