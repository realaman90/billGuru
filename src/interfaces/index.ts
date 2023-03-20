export type Client = {
  id: string;
  name: string;
  email: string;
  address: string;
  pinCode: string;
  phone: string;
  businessNumber: string;
  vat: string;
};
export type Sender = {
  id: string;
  name: string;
  email: string;
  address: string;
  pinCode: string;
  phone: string;
  businessNumber: string;
  vat: string;
};
interface ItemTax  {
  name: string;
  cgst: number 
  sgst: number
  igst: number 
  rate: number;
  amount: number ;
}
export type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  amount: number;
  rate: number;
  discountAmount: number;
  itemTax:ItemTax;
  discount: number;
};
export type Details = {
  invoiceName: string;
  invoiceNumber: string;
  logo: string;
  invoiceDate: string;
  dueDate: string;
};
export type InvoiceForm = {
  id?: string;
  status: string;
  details: Details;
  client: Client;
  sender: Sender;
  items: Item[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  total: number;
  payments: { name: string; amount: number; date: string; notes:string; method:string}[];
  fee: { name: string; amount: number; tax: number }[];
  balanceDue: number;
  notes: string;
  terms: string;
  currency: string;
  attachments: string;
  locale:string;
};
export interface User {
  name?: string | null | undefined;
  role?: string;
  userName?: string;
  accessToken?: string;
}
export type Fee ={
  name?: string;
  amount?: number;
  tax?: number;

}

