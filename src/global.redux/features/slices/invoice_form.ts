'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../..';
import dayjs from 'dayjs';
import {
  Client,
  Sender,
  Item,
  InvoiceForm,
  Details,
} from '../../../interfaces/index';

const Invoice = {
  status: 'unpaid',
  details: {
    invoiceName: '',
    invoiceNumber: '',
    logo: '',
    invoiceDate: dayjs(Date.now()).format(),
    dueDate: '',
  },
  client: {
    id: '',
    name: '',
    email: '',
    address: '',
    pinCode: '',
    phone: '',
    businessNumber: '',
    vat: '',
  },
  sender: {
    id: '',
    name: '',
    email: '',
    address: '',
    pinCode: '',
    phone: '',
    businessNumber: '',
    vat: '',
  },
  items: [
    {
      id: '',
      name: '',
      description: '',
      quantity: 0,
      amount: 0,
      rate: 0,
      discountAmount: 0,
      itemTax: {  name: '', cgst:0, sgst:0, igst:0, rate: 0, amount: 0 },
      discount: 0,
    },
  ],
  subtotal: 0,
  totalTax: 0,
  totalDiscount: 0,
  total: 0,
  fee: [{ name: '', amount: 0, tax: 0 }],
  payments: [
    {
      
      name: '',
      amount: 0,
      date: dayjs().format('YYYY-MM-DD'),
      method: '',
      notes: '',
      
    },
  ],
  balanceDue: 0,
  notes: '',
  terms: '',
  currency: '₹',
  attachments: '',
  locale: 'en-IN',
};

const initialState = Invoice;

export const invoiceFormSlice = createSlice({
  name: 'invoiceForm',
  initialState,
  reducers: {
    updateDetails: (state, action: PayloadAction<Details>) => {
      const { invoiceNumber, logo, invoiceDate, dueDate } = action.payload;
      state.details.invoiceNumber = invoiceNumber;
      state.details.logo = logo;
      state.details.invoiceDate = invoiceDate;
      state.details.dueDate = dueDate;
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      state.client = action.payload;
    },
    updateSender: (state, action: PayloadAction<Sender>) => {
      const { id, name, email, address, pinCode, phone, businessNumber, vat } =
        action.payload;

      state.sender.name = name;
      state.sender.email = email;
      state.sender.address = address;
      state.sender.pinCode = pinCode;
      state.sender.phone = phone;
      state.sender.businessNumber = businessNumber;
      state.sender.vat = vat;
    },
    addItem(state, action: PayloadAction<Item>) {
      state.items.push(action.payload);
    },
    // remove item
    // removeItem(state, action: PayloadAction<number>)) {
    //   const{index} = action.payload;      
    //   state.items.splice(index, 1);
    // },
    // update item

    
    
    addItemTax(
      state,
      action: PayloadAction<{
        item: Item;
        tax: {
          id: string;
          name: string;
          cgst: number;
          sgst: number;
          igst: number;
          rate: number;
          amount: number;
        };
      }>
    ) {
      const { item, tax } = action.payload;
      const itemIndex = state.items.findIndex((i) => i.id === item.id);
      state.items[itemIndex].itemTax = tax;
    },

    updateItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload;
      state.subtotal =
        Math.round(
          (state.items
            .map((item) => item.amount)
            .reduce((accum, currVal) => accum + currVal, 0) +
            Number.EPSILON) *
            100
        ) / 100;
      state.totalTax =
        Math.round(
          (state.items
            .map((item) =>
              item.itemTax.amount
            )
            .reduce((accum, currVal) => accum + currVal, 0) +
            Number.EPSILON) *
            100
        ) / 100;
      state.totalDiscount =
        Math.round(
          (state.items
            .map((item) => item.discountAmount)
            .reduce((accum, currVal) => accum + currVal, 0) +
            Number.EPSILON) *
            100
        ) / 100;
      const feeArr = state.fee.map((fee) => {
        return fee.amount + fee.tax;
      });

      state.total =
        Math.round(
          (state.subtotal -
            state.totalDiscount +
            state.totalTax +
            feeArr.reduce((a: number, b: number) => a + b, 0) +
            Number.EPSILON) *
            100
        ) / 100;
      state.balanceDue =
        state.total -
        state.payments
          .map((payment) => payment.amount)
          .reduce((a, b) => a + b, 0);
    },
    addFee(
      state,
      action: PayloadAction<{ name: string; amount: number; tax: number }>
    ) {
      state.fee.push(action.payload);
      const feeArr = state.fee.map((fee) => {
        return fee.amount + fee.tax;
      });
      state.total =
        state.total +
        Math.round((feeArr.reduce((a, b) => a + b, 0) + Number.EPSILON) * 100) /
          100;
      state.balanceDue =
        state.total -
        state.payments
          .map((payment) => payment.amount)
          .reduce((a, b) => a + b, 0);
    },

    removeFee(
      state,
      action: PayloadAction<number>
    ) {
      state.fee = state.fee.splice(action.payload,1)
    },
    changeCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
  },
});
export const {
  updateDetails,
  updateClient,
  updateSender,
  addItem,
  addItemTax,
  updateItems,
  changeCurrency,
  addFee,
  removeFee,
} = invoiceFormSlice.actions;
export const selectInvoiceForm = (state: RootState) => state.invoiceForm;

export const invoiceFormReducer = invoiceFormSlice.reducer;
