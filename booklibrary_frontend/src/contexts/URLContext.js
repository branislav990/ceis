import { createContext, useReducer } from "react";
import { urlReducer } from "../reducers/urlReducer";

export const URLContext = createContext();

const initialState = {
    reactUrl: "",
    djangoUrl: "",
};

const URLContextProvider = ({ children }) => {
    const [urlState, urlDispatch] = useReducer(urlReducer, initialState);

    const { reactUrl, djangoUrl } = urlState;

    return (
        <URLContext.Provider value={{ reactUrl, djangoUrl, urlDispatch }}>
            {children}
        </URLContext.Provider>
    );
};

export default URLContextProvider;
