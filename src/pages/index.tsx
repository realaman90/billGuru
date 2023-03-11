import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import InvoiceDetails from '@/components/ui/InvoiceDetails'
import { useAppSelector } from '@/global.redux/hooks'
import DatePickerComponent from '@/components/ui.micro/DatePicker'

import InvoiceClient from '@/components/ui/InvoiceClient'
import { useGetClientsQuery } from '@/global.redux'
import InvoiceSender from '@/components/ui/InvoiceSender'
import InvoiceItems from '@/components/ui/InvoiceItems'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const invoice = useAppSelector((state) => state.invoiceForm)



  return (
    <>
    <div></div>
     <InvoiceDetails invoice={invoice}/>
    <InvoiceClient invoice={invoice} />
    <InvoiceSender invoice={invoice} />
    <InvoiceItems invoice={invoice} />
     
    </>
  )
}
