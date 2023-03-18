import InvoiceDetails from '@/components/ui/InvoiceDetails';
import { useAppSelector } from '@/global.redux/hooks';
import InvoiceClient from '@/components/ui/InvoiceClient';
import InvoiceSender from '@/components/ui/InvoiceSender';
import InvoiceItems from '@/components/ui/InvoiceItems';
import InvoiceBottomContainer from '@/components/ui/InvoiceBottom';
import InvoiceSettings from '@/components/ui/invoiceSettings';
import { Login } from '@/components/ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { render } from 'react-dom';
export default function Home() {
  const invoice = useAppSelector((state) => state.invoiceForm);
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);
let renderTemplate = <div>Nahi Chala</div>
  if (session){
     renderTemplate = 
             <>
          <Box>
            <Typography variant='h1' >{session.user.name} chala</Typography>
          </Box>
        </>

  }
  return (
    <>
      <div>
      <Typography variant='h1'>
        Chalaaaa
      </Typography>
      {renderTemplate}

      </div>

      
    </>
  );
}
