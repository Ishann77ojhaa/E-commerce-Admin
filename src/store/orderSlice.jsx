import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../globals/misc/statuses";
import { APIAuthenticated } from "../globals/http";


 export const  orderSlice = createSlice({
  name: "order",

  initialState: {
    orders: [],
    selectedOrder: null,
    status: STATUSES.IDLE,
  },

  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },

    setStatus(state, action) {
      state.status = action.payload;
    },

    clearOrders(state) {
      state.orders = [];
    },

    setSelectedOrder(state, action) {
  state.selectedOrder = action.payload;
},
clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
  },
});

export const {
  setOrders,
  setStatus,
  clearOrders,
  clearSelectedOrder,
  setSelectedOrder,
} = orderSlice.actions;

export default orderSlice.reducer;


// Get my orders
export function getAllOrders() {
  return async function getAllOrdersThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await APIAuthenticated.get("/admin/");

      dispatch(setOrders(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));

    } catch (error) {
      console.log(error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

//get single order
export function getOrderById(id) {
  return async function getOrderByIdThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await APIAuthenticated.get(`/admin/${id}`);

      dispatch(setSelectedOrder(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));

      return true;
    } catch (error) {
      console.log(error.response?.data || error);

      dispatch(setStatus(STATUSES.ERROR));

      return false;
    }
  };
}

//Update Order
export function updateOrder(orderId, orderstatus) {
  return async function updateOrderThunk(dispatch) {
    try {
      const response = await APIAuthenticated.patch(
        `/admin/${orderId}`,
        {
          orderstatus: orderstatus,
        }
      );

      dispatch(setSelectedOrder(response.data.data));

      // Also update the order in the orders list
      dispatch(getAllOrders());

      return response.data;
    } catch (error) {
      console.log(
        "UPDATE ORDER ERROR:",
        error.response?.data || error.message
      );

      throw error;
    }
  };
}

//Cancel Order
export function cancelOrder(orderId) {
  return async function cancelOrderThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await APIAuthenticated.patch(
        `/admin/${orderId}`,
        {
          orderstatus: "Cancelled",
        }
      );

      dispatch(setSelectedOrder(response.data.data));
      dispatch(getAllOrders());
      dispatch(setStatus(STATUSES.SUCCESS));

      return true;
    } catch (error) {
      console.log(error.response?.data || error);

      dispatch(setStatus(STATUSES.ERROR));

      return false;
    }
  };
}
