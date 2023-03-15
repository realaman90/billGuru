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
export default function Home() {
  const invoice = useAppSelector((state) => state.invoiceForm);
  const router = useRouter();
  const { data: session } = useSession();
  if (session){
    console.log(session)
  }
  return (
    <>
      <div></div>

      <Login />
    </>
  );
}
