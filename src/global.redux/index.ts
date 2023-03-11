'use client';

import { configureStore } from "@reduxjs/toolkit";
import {
    updateDetails,
  updateClient,
  updateSender,
  addItem,
  removeItem,
  addItemTax,
  updateItems,
  changeCurrency,
  addFee,
  removeFee,
 invoiceFormReducer
} from './features/slices/invoice_form';
import {
    invoiceApi,
    clientApi,
    senderApi,
    itemsApi,
    hsn_codesapi
} from './features/api/invoiceApis'


 const store = configureStore({
    reducer:{
        // Add your reducers here
        invoiceForm: invoiceFormReducer,
        [invoiceApi.reducerPath]: invoiceApi.reducer,
        [clientApi.reducerPath]: clientApi.reducer,
        [senderApi.reducerPath]: senderApi.reducer,
        [itemsApi.reducerPath]: itemsApi.reducer,
        [hsn_codesapi.reducerPath]:hsn_codesapi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            invoiceApi.middleware,
            clientApi.middleware,
            senderApi.middleware,
            itemsApi.middleware,
            hsn_codesapi.middleware,
        );




    }
});

export {
    store,
    updateDetails, 
    updateClient,
    updateSender,
    updateItems,
    removeItem,
    addItemTax,
    addItem,
    addFee,
    changeCurrency,

};
export {
    //Clients
    useGetClientsQuery,
    useGetClientQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
    //Invoices
    useGetInvoicesQuery,
    useGetInvoiceQuery,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useDeleteInvoiceMutation,
    //Senders
    useGetSendersQuery,
    useGetSenderQuery,
    useCreateSenderMutation,
    useUpdateSenderMutation,
    useDeleteSenderMutation,
    //Items
    useGetItemsQuery,
    useGetItemQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
    //
    useGetHsn_codesQuery,
    useGetHsn_codeQuery,
    

} from './features/api/invoiceApis';



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch