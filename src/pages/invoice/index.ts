

import { useSelector } from "react-redux";
import { RootState } from "@/global.redux";
const { invoice } = useSelector((state:RootState) => {
    return { invoice: state.invoiceForm };
  });