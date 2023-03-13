import React, { useState, useEffect } from 'react';
import { Item, InvoiceForm } from '@/interfaces';
import { useAppDispatch, useAppSelector } from '@/global.redux/hooks';
import {
  useGetItemsQuery,
  useCreateItemMutation,
  useGetHsn_codeQuery,
  useGetHsn_codesQuery,
  updateItems,
} from '@/global.redux';
import { updateClient } from '@/global.redux';

import {
  Autocomplete,
  createFilterOptions,
  Box,
  TextFieldProps,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { LoadingButton } from '@mui/lab';
import { PrimaryButton } from '../ui.micro/Buttons';
import Input from '../ui.micro/Input';
import { Add, Delete } from '@mui/icons-material';

interface InvoiceProps {
  invoice: InvoiceForm;
}
interface HSN {
  id: number;
  code: string;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
}
interface NewItem {
  name?: string | null;
  description?: string | null;
  rate?: number | null;
  HSN?: HSN | null;
  index: number;
}
const filter = createFilterOptions<NewItem>();
export default function InvoiceItems({ invoice }: InvoiceProps) {
  const dispatch = useAppDispatch();
  let [items, setItems] = useState<Item[]>(invoice.items);
  useEffect(()=>{
    setItems(invoice.items)
  }, [invoice])

  const [dialogueValue, setDialogueValue] = useState<NewItem>({
    name: '',
    description: '',
    rate: 0,
    HSN: null,
    index: 0,
  });
  const [dialogueOpen, setDialogueOpen] = useState(false);

  // Items store
  const { data, isLoading } = useGetItemsQuery(undefined);
  const { data: hsnData, isLoading: hsnLoading } =
    useGetHsn_codesQuery(undefined);

  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();

  //handle Add Item
  const handleAddItem = () => {
    const item: Item = {
      id: '',
      name: '',
      description: '',
      quantity: 0,
      amount: 0,
      rate: 0,
      discountAmount: 0,
      itemTax: { name: '', cgst: 0, sgst: 0, igst: 0, rate: 0, amount: 0 },
      discount: 0,
    };
    const newItems = [...items, item];

    dispatch(updateItems(newItems));
  };

  //Autocomplete Value change
  const handleInputChange = (newValue: any, index: number) => {
    if (typeof newValue === 'string' && newValue != null) {
      setTimeout(() => {
        setDialogueOpen(true);
        setDialogueValue({
          name: newValue,
          index,
        });
      });
    } else if (newValue && newValue.inputValue) {
      setDialogueOpen(true);
      setDialogueValue({
        name: newValue.inputValue,
        index,
      });
    } else if (typeof newValue === 'object' && newValue != null) {
      const { id, name, description, rate, itemTax } = newValue;

      const item: Item = {
        id,
        name,
        description,
        quantity: 0,
        rate,
        discount: 0,
        amount: 0,
        itemTax,
        discountAmount: 0,
      };
      const newItems = [...items];
      newItems[index] = item;
      dispatch(updateItems(newItems));
    }
  };

  //Handle Create new item
  const handleCreateItem = async () => {
    if (dialogueValue) {
      const { name, description, rate, HSN, index } = dialogueValue;
      const itemTax = {
        cgst: HSN?.cgst,
        sgst: HSN?.sgst,
        igst: HSN?.igst,
        name: HSN?.code,
      };
      let item = await createItem({
        name,
        description,
        rate,
        itemTax,
      }).unwrap();
      item = {
        ...item,
        amount: 0,
        discount: 0,
        discountAmount: 0,
        quantity: 0,
      };
      let newItems: Item[] = [...items];
      newItems[index] = item;
      dispatch(updateItems(newItems));
      setDialogueOpen(false);
    }
  };
  //handle item rate change
  const handleRateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newItems = [...items];
    const rate = parseFloat(value);
    const amount = newItems[index].quantity * rate;
    const discountAmount = (amount * newItems[index].discount) / 100;
    const taxAmount =
      ((amount - discountAmount) * newItems[index].itemTax.igst) / 100;
    newItems[index] = {
      ...newItems[index],
      rate,
      discountAmount,
      amount,
      itemTax: {
        ...newItems[index].itemTax,
        amount: taxAmount,
      },
    };
    dispatch(updateItems(newItems));
  };
  //handle item quantity change
  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (value === '') {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        quantity: 0,
        discountAmount: 0,
        amount: 0,
        itemTax: {
          ...newItems[index].itemTax,
          amount: 0,
        },
      };
      dispatch(updateItems(newItems));
      return;
    }
    const newItems = [...items];
    const quantity = parseFloat(value);
    const amount =
      Math.round((newItems[index].rate * quantity + Number.EPSILON) * 100) /
      100;
    const discountAmount =
      Math.round(
        (amount * (newItems[index].discount / 100) + Number.EPSILON) * 100
      ) / 100;
    const taxAmount =
      Math.round(
        ((amount - discountAmount) * (newItems[index].itemTax.igst / 100) +
          Number.EPSILON) *
          100
      ) / 100;
    newItems[index] = {
      ...newItems[index],
      quantity,
      discountAmount,
      amount,
      itemTax: {
        ...newItems[index].itemTax,
        amount: taxAmount,
      },
    };

    dispatch(updateItems(newItems));
  };
  //handle item discount change
  const handleDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (value === '') {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], discount: 0, discountAmount: 0 };

      dispatch(updateItems(newItems));
      return;
    }
    const newItems = [...items];
    const discount = parseFloat(value);
    const discountAmount =
      Math.round(
        (newItems[index].amount * (discount / 100) + Number.EPSILON) * 100
      ) / 100;
    const taxAmount =
      Math.round(
        ((newItems[index].amount - discountAmount) *
          (newItems[index].itemTax.igst / 100) +
          Number.EPSILON) *
          100
      ) / 100;
    newItems[index] = {
      ...newItems[index],
      discount,
      discountAmount,
      itemTax: { ...newItems[index].itemTax, amount: taxAmount },
    };

    dispatch(updateItems(newItems));
  };
  //handle item description change
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], description: value };
    setItems(newItems);
    dispatch(updateItems(items));
  };
  //handle item CGST change
  const handleCGSTChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newItems = [...items];
    const cgst = parseFloat(value);
    const sgst = newItems[index].itemTax.sgst;
    const igst = cgst + sgst;
    const amount =
      Math.round(
        (newItems[index].amount * (igst / 100) + Number.EPSILON) * 100
      ) / 100;
    newItems[index] = {
      ...newItems[index],
      itemTax: { ...newItems[index].itemTax, igst, cgst, amount },
    };
    dispatch(updateItems(newItems));
  };
  //handle item SGST change
  const handleSGSTChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newItems = [...items];
    const sgst = parseFloat(value);
    const igst = newItems[index].itemTax.cgst + sgst;
    const amount =
      Math.round(
        (newItems[index].amount * (igst / 100) + Number.EPSILON) * 100
      ) / 100;
    newItems[index] = {
      ...newItems[index],
      itemTax: { ...newItems[index].itemTax,  sgst,igst, amount },
    };
    dispatch(updateItems(newItems));

  
  };

  //handle item IGST change -----> Check here
  const handleIGSTChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (value === '') {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        itemTax: {
          ...newItems[index].itemTax,
          igst: 0,
          amount: 0,
        },
      };

      dispatch(updateItems(newItems));
      return;
    }
    const newItems = [...items];
    const igst = parseFloat(value);
    const amount =
      Math.round(
        (newItems[index].amount * (igst / 100) + Number.EPSILON) * 100
      ) / 100;
    newItems[index] = {
      ...newItems[index],
      itemTax: { ...newItems[index].itemTax, igst, amount },
    };
    dispatch(updateItems(newItems));
  };

  //handle Delete item
  const handleDeleteItem = (index: number): void => {
    const newItems = [...items];
    newItems.splice(index, 1);
    dispatch(updateItems(newItems));
  };

  //Render Invoice Items

  const renderInputs = items.map((item, index) => {
    return (
      <Box key={index} sx={{ padding: 1 }}>
        <Grid container columns={{ xs: 8, sm: 12 }} spacing={2}>
          <Grid xs={1} sm={1}>
            <IconButton
              size="small"
              onClick={() => handleDeleteItem(index)}
              sx={{ border: 'solid 1px #6750A4', color: '#6750A4' }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Grid>
          <Grid xs={7} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data && (
                <Autocomplete
                  freeSolo
                  value={item}
                  options={data}
                  getOptionLabel={(option: any) => {
                    if (typeof option === 'string') {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.name;
                  }}
                  filterOptions={(options, params) => {
                    const filtered = createFilterOptions({
                      stringify: (option: any) => option.name,
                    })(options, params);
                    if (params.inputValue !== '') {
                      filtered.push({
                        inputValue: params.inputValue,
                        name: `Add "${params.inputValue}"`,
                      });
                    }
                    return filtered;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Item"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  onChange={(event, newValue) => {
                    handleInputChange(newValue, index);
                  }}
                  renderOption={(props, data: any) => (
                    <li {...props}>{data.name}</li>
                  )}
                />
              )}
              <Input
                input={{
                  label: 'Description',
                  value: item.description,
                }}
                variant="outlined"
                size="small"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  handleDescriptionChange(e, index);
                }}
              />
            </Box>
          </Grid>
          <Grid xsOffset={1} smOffset={0} xs={8} sm={8}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '10px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Input
                    input={{
                      id: `${item.id}`,
                      label: `Rate`,
                      value: `${item.rate}`,
                      type: 'number',
                    }}
                    variant="outlined"
                    size="small"
                    sx={{ maxWidth: '120px', minWidth: '50px' }}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                      handleRateChange(e, index);
                    }}
                  />
                  <Typography
                    sx={{
                      display: { xs: 'block', sm: 'none' },
                      marginTop: '10px',
                    }}
                  >
                    X
                  </Typography>
                  <Input
                    input={{
                      id: `${item.name}_qty`,
                      label: `Qty`,
                      value: `${item.quantity}`,
                      type: 'number',
                    }}
                    sx={{ maxWidth: '70px', minWidth: '50px' }}
                    variant="outlined"
                    size="small"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                      handleQuantityChange(e, index)
                    }
                  />
                </Box>

                <Box
                  sx={{
                    minWidth: '50px',
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* Change locale */}
                  <Typography variant="subtitle1">
                    {invoice.currency}
                    {item.amount > 0 ? item.amount : 0}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Input
                  input={{
                    id: `item-${item.name}-discout`,
                    label: `Discount %`,
                    value: `${item.discount}`,
                    type: 'number',
                  }}
                  size="small"
                  sx={{ maxWidth: '120px', minWidth: '50px' }}
                  variant="outlined"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    handleDiscountChange(e, index);
                  }}
                />
                <Box
                  sx={{
                    minWidth: '50px',
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* Change locale */}
                  <Typography variant="subtitle1">
                    {item.discountAmount > 0 ? '-' : ''}
                    {item.discountAmount > 0 ? invoice.currency : ''}
                    {item.discountAmount > 0 ? item.discountAmount : ''}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid xs={1} sm={1}></Grid>
          <Grid xsOffset={1} smOffset={0} xs={8} sm={11}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <Input
                  input={{
                    id: `item-${item.name}-cgst`,
                    label: `CGST %`,
                    value: `${item.itemTax.cgst}`,
                    type: 'number',
                  }}
                  size="small"
                  sx={{ maxWidth: '80px' }}
                  variant="outlined"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    handleCGSTChange(e, index);
                  }}
                />
                <Input
                  input={{
                    id: `item-${item.name}-sgst`,
                    label: `SGST %`,
                    value: `${item.itemTax.sgst}`,
                    type: 'number',
                  }}
                  size="small"
                  sx={{ maxWidth: '80px' }}
                  variant="outlined"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    handleSGSTChange(e, index);
                  }}
                />
                <Input
                  input={{
                    id: `item-${item.name}-igst`,
                    label: `IGST %`,
                    value: `${item.itemTax.igst}`,
                    type: 'number',
                  }}
                  size="small"
                  sx={{ maxWidth: '80px' }}
                  variant="outlined"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    handleIGSTChange(e, index);
                  }}
                />
              </Box>
              <Box
                sx={{
                  minWidth: '50px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {/* Change locale */}
                <Typography variant="subtitle1">
                  {item.itemTax.amount > 0 ? '+' : ''}
                  {item.itemTax.amount > 0 ? invoice.currency : ''}
                  {item.itemTax.amount > 0 ? item.itemTax.amount : ''}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  });

  return (
    <>
      {/* Band for the bigger screens */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          height: '40px',
          background: '#6750A4',
          color: 'white',
        }}
      />
      {/* Dynamic Items */}
      {data && renderInputs}
      <PrimaryButton
        css={{ margin: '10px 7px' }}
        onClick={handleAddItem}
        disableElevation
        startIcon={<Add />}
      >
        Add Item
      </PrimaryButton>
      {/* Add Item Dialogue */}
      <Dialog
        open={dialogueOpen}
        onClose={() => {
          setDialogueOpen(false);
        }}
        aria-labelledby="Add New Item"
        fullWidth={true}
      >
        <form onSubmit={handleCreateItem}>
          <DialogTitle
            sx={{
              textAlign: 'center',
            }}
          >
            Add Item
          </DialogTitle>

          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              margin: '5px 0',
              alignContent: 'center',
            }}
          >
            <Input
              input={{
                id: 'name',
                label: 'Name',
                value: dialogueValue?.name,
              }}
              sx={{
                width: '100%',
                margin: '10px 0',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                const { value }: { value: string } = e.target;

                setDialogueValue({ ...dialogueValue, name: value });
              }}
            />
            <Input
              input={{
                id: 'description',
                label: 'Description',
                value: dialogueValue?.description,
              }}
              sx={{
                width: '100%',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                const { value }: { value: string } = e.target;

                setDialogueValue({ ...dialogueValue, description: value });
              }}
            />

            <Input
              input={{
                id: 'rate',
                label: 'Rate',
                value: dialogueValue?.rate,
                type: 'number',
              }}
              sx={{
                width: '100%',
              }}
              variant="outlined"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                const { value }: { value: string } = e.target;
                setDialogueValue({ ...dialogueValue, rate: parseInt(value) });
              }}
            />
            {hsnData && (
              <Autocomplete
                options={hsnData}
                getOptionLabel={(option: any) =>
                  option.name + ' GST @ ' + option.igst + '%'
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="HSN"
                    variant="outlined"
                    size="small"
                  />
                )}
                onChange={(event, newValue) => {
                  setDialogueValue({ ...dialogueValue, HSN: newValue });
                }}
              />
            )}
          </DialogContent>
        </form>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogueOpen(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            onClick={handleCreateItem}
            loading={isCreating}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
