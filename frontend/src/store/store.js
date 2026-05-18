import { configureStore } from "@reduxjs/toolkit";
import userreducers from './slices/userSlice.js'
import commonreducers from './slices/commonSlice.js'
import restaurantReducers from './slices/restaurantSlice.js'
import menuReducers from './slices/menuSlice.js'
import  categoryReducers  from "./slices/categorySlice.js";
import cartReducers from './slices/cartSlice.js'
import orderReducers from './slices/orderSlice.js'
import addressReducers from './slices/addressSlice.js'
import transactionReducers from './slices/transactionSlice.js'
import { notificationMiddleware } from "./notificationMiddleware.js";

export const store = configureStore({
    reducer:{
        users:userreducers,
        common:commonreducers,
        restaurant:restaurantReducers,
        menu:menuReducers,
        category:categoryReducers,
        cart:cartReducers,
        order:orderReducers,
        address:addressReducers,
        transaction:transactionReducers
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(notificationMiddleware),
})
