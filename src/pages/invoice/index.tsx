import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Paper,
  Box,
  Typography,
  Divider,
  Drawer,
  SwipeableDrawer,
} from '@mui/material';

import { Close, Delete, Share } from '@mui/icons-material';
import {
  InvoiceDetails,
  InvoiceClient,
  InvoiceSender,
  InvoiceItems,
  InvoiceBottomContainer,
  InvoiceSettings,
} from '@/components/ui';
import { PrimaryButton, OutlineButton } from '@/components/ui.micro/Buttons';
import { useAppSelector } from '@/global.redux/hooks';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  marginTop:10,
}));


export default function CreateInvoice() {
  const invoice = useAppSelector((state) => state.invoiceForm);
  const handlePreview = ()=>{
    //call api
    
    
  }
  const handleRecordPayment = ()=>{
    //call api
  }

  return (
    <>
      <Box sx={{padding:'20px 10px', fontFamily:'Montserrat'}}>
        <Grid container spacing={1} columns={{ xs: 1,  md: 12 }}>
        <Grid xs={1} md={8} >
            <Box sx={{display:'flex', justifyContent:'space-between', gap:'10px'}}>
                <Box
                    sx={{
                        display: 'flex',                      
                        alignItems: 'flex-end',
                        gap: '10px',
                        width: '100%',
                    }}
                >
                    <OutlineButton onClick={handlePreview}>Preview</OutlineButton>
                <OutlineButton onClick={handleRecordPayment} >Record Payment</OutlineButton>
                </Box>
                <PrimaryButton endIcon={<Share />}> Share</PrimaryButton>
               
            </Box>
            <Item>
                <Divider sx={{ display:{xs:'none', md:'block'}, borderBottomWidth:'thick', background:'#6750a4',  borderTopRightRadius:100,borderTopLeftRadius:100}}/>
                <InvoiceDetails invoice={invoice} />
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs:'column', sm:'row'},
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding:1,
                    width: '100%',
                }}

                >
                <InvoiceClient invoice={invoice} />
                <InvoiceSender invoice={invoice} />
                </Box>
                <InvoiceItems invoice={invoice} />
                <InvoiceBottomContainer invoice={invoice} />

            </Item>
            <Box sx={{display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                {/* Add navigation to close and redirect user to Invoice list or back */}
                <OutlineButton startIcon={<Close/>} >Close</OutlineButton>
                <OutlineButton startIcon={<Delete />} > Delete</OutlineButton>
               
            </Box>
        </Grid>
            <Grid xs={1} md={4}>
                <Item sx={{marginTop:'55px'}}>
                    <InvoiceSettings invoice={invoice} />
                </Item>
                {/* Swipable drawer for mobile */}
                
            </Grid>

        </Grid>
        
    </Box>
    </>
  );
}
