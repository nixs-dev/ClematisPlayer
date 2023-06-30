import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers/index.js";


const store = configureStore({ 
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
    })
});

export default store;