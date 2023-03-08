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
export type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  amount: number;
  rate: number;
  discountAmount: number;
  itemTax: { id: string; name: string; rate: number; amount: number }[];
  discount: number;
};
export type Details = {
  invoiceName: string;
  invoiceNumber: string;
  logo: string;
  invoiceDate: string;
  dueDate: string;
}
export type InvoiceForm = {
  id: string;
  details: Details;
  client: Client;
  sender: Sender;
  items: Item[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  total: number;
  payments: { id: string; name: string; amount: number; date: string }[];
  fee: { name: string; amount: number; tax: number }[];
  balanceDue: number;
  notes: string;
  terms: string;
  currency: string;
  attachments: string;
};
