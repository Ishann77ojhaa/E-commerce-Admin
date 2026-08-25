import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../globals/misc/statuses";
import { APIAuthenticated } from "../globals/http";

const initialState = {
  products: [],
  selectedProduct: null,
  status: STATUSES.IDLE,
};

const productSlice = createSlice({
  name: "product",

  initialState,

  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },

    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },

    setStatus(state, action) {
      state.status = action.payload;
    },

    removeProduct(state, action) {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
    },

    updateProductInState(state, action) {
      const index = state.products.findIndex(
        (product) => product._id === action.payload._id
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    clearProducts(state) {
      state.products = [];
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setStatus,
  removeProduct,
  updateProductInState,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;

// GET ALL PRODUCTS
export function getAllProducts() {
  return async function getAllProductsThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await APIAuthenticated.get("/product");

      dispatch(setProducts(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));

    } catch (error) {
      console.log(
        "GET PRODUCTS ERROR:",
        error.response?.data || error.message
      );

      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}


// GET SINGLE PRODUCT
export function getProductById(id) {
  return async function getProductByIdThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await APIAuthenticated.get(
        `/product/${id}`
      );

      dispatch(setSelectedProduct(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));

      return true;

    } catch (error) {
      console.log(
        "GET PRODUCT ERROR:",
        error.response?.data || error.message
      );

      dispatch(setStatus(STATUSES.ERROR));

      return false;
    }
  };
}

// DELETE PRODUCT
export function deleteProduct(id) {
  return async function deleteProductThunk(dispatch) {
    try {
      const response = await APIAuthenticated.delete(
        `/product/${id}`
      );

      dispatch(removeProduct(id));

      return response.data;

    } catch (error) {
      console.log(
        "DELETE PRODUCT ERROR:",
        error.response?.data || error.message
      );

      throw error;
    }
  };
}


// CREATE PRODUCT 
export function createProduct(formData) { 
  return async function createProductThunk(dispatch) { 
    dispatch(setStatus(STATUSES.LOADING)); 
 
    try { 
      const response = await APIAuthenticated.post( 
        "/product/", 
        formData, 
        { 
          headers: { 
            "Content-Type": "multipart/form-data", 
          }, 
        } 
      ); 
 
      dispatch(setStatus(STATUSES.SUCCESS)); 
 
      return response.data; 
 
    } catch (error) { 
      console.log( 
        "CREATE PRODUCT ERROR:", 
        error.response?.data || error.message 
      ); 
 
      dispatch(setStatus(STATUSES.ERROR)); 
 
      throw error; 
    } 
  }; 
}