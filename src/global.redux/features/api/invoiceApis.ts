import { Client, Sender, InvoiceForm, Item } from '../../../interfaces/index';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// add process.env.NODE_ENV === 'production' ? 'https://api.example.com' : 'http://localhost:3001' to baseUrl

 const invoiceApi = createApi({
    reducerPath: 'invoiceApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: () => '/invoices',
        }),
        getInvoice: builder.query({
            query: (id: string) => `/invoices/${id}`,
        }),
        createInvoice: builder.mutation({
            query: (body: InvoiceForm) => ({
                url: '/invoices',
                method: 'POST',
                body,
            }),
        }),
        updateInvoice: builder.mutation({
            query: (body: InvoiceForm) => ({

                url: `/invoices/${body.id}`,
                method: 'PUT',
                body,
            }),
        }),
        deleteInvoice: builder.mutation({
            query: (id: string) => ({
                url: `/invoices/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

const clientApi = createApi({
    reducerPath: 'clientApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    endpoints: (builder) => ({
        getClients: builder.query({
            query: () => '/clients',
        }),
        getClient: builder.query({
            query: (id: string) => `/clients/${id}`,
        }),
        createClient: builder.mutation({
            query: (body: Client) => ({
                url: '/clients',
                method: 'POST',
                body,
            }),
        }),
        updateClient: builder.mutation({
            query: (body: Client) => ({
                url: `/clients/${body.id}`,
                method: 'PUT',
                body,
            }),
        }),
        deleteClient: builder.mutation({
            query: (id: string) => ({
                url: `/clients/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});
const senderApi = createApi({
    reducerPath: 'senderApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    endpoints: (builder) => ({
        getSenders: builder.query({
            query: () => '/senders',
        }),
        getSender: builder.query({
            query: (id: string) => `/senders/${id}`,
        }),
        createSender: builder.mutation({
            query: (body: Sender) => ({
                url: '/senders',
                method: 'POST',
                body,
            }),
        }),
        updateSender: builder.mutation({
            query: (body: Sender) => ({
                url: `/senders/${body.id}`,
                method: 'PUT',
                body,
            }),
        }),
        deleteSender: builder.mutation({
            query: (id: string) => ({
                url: `/senders/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});
const itemsApi = createApi({
    reducerPath: 'itemsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    endpoints: (builder) => ({
        getItems: builder.query({
            query: () => '/items',
        }),
        getItem: builder.query({
            query: (id: string) => `/items/${id}`,
        }),
        createItem: builder.mutation({
            query: (body: Item) => ({
                url: '/items',
                method: 'POST',
                body,
            }),
        }),
        updateItem: builder.mutation({
            query: (body: Item) => ({
                url: `/items/${body.id}`,
                method: 'PUT',
                body,
            }),
        }),
        deleteItem: builder.mutation({
            query: (id: string) => ({
                url: `/items/${id}`,
                method: 'DELETE',
            }),
        }),
    }),

})

export const {
    useGetInvoicesQuery,
    useGetInvoiceQuery,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useDeleteInvoiceMutation,
} = invoiceApi;
export const {
    useGetClientsQuery,
    useGetClientQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
} = clientApi;
export const {
    useGetSendersQuery,
    useGetSenderQuery,
    useCreateSenderMutation,
    useUpdateSenderMutation,
    useDeleteSenderMutation,
} = senderApi;
export const {
    useGetItemsQuery,
    useGetItemQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = itemsApi;

export {
    invoiceApi,
    clientApi,
    senderApi,
    itemsApi

}

