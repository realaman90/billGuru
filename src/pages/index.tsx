import InvoiceDetails from '@/components/ui/InvoiceDetails';
import { useAppSelector } from '@/global.redux/hooks';
import InvoiceClient from '@/components/ui/InvoiceClient';
import InvoiceSender from '@/components/ui/InvoiceSender';
import InvoiceItems from '@/components/ui/InvoiceItems';
import InvoiceBottomContainer from '@/components/ui/InvoiceBottom';
import InvoiceSettings from '@/components/ui/invoiceSettings';

export default function Home() {
  const invoice = useAppSelector((state) => state.invoiceForm);

  return (
    <>
      <div></div>
      <InvoiceDetails invoice={invoice} />
      <InvoiceClient invoice={invoice} />
      <InvoiceSender invoice={invoice} />
      <InvoiceItems invoice={invoice} />
      <InvoiceBottomContainer invoice={invoice} />
      <InvoiceSettings invoice={invoice} />
    </>
  );
}
