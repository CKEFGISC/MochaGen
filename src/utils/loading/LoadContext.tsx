import React from "react";

export interface ILoadContext {
    isLoading: boolean;
    toggleLoading: () => void;
    log: string;
    setLog: (str: string) => void;
}
const LoadContext = React.createContext<ILoadContext>({
    isLoading: false,
    toggleLoading: () => {},
    log: "",
    setLog: () => {},
});
export const LoadContextProvider = ({ children }: any) => {
    const [ isLoading, toggleLoading ] = React.useReducer((state:boolean) => {
        return !state;
    }, false);
    const [ log, setLog ] = React.useReducer((_prev:string, next:string) => {
       return next;
    }, "");
    return (
        <LoadContext.Provider value = {{ isLoading, toggleLoading, log, setLog }}>
            { children }
        </LoadContext.Provider>
    );
}
export default LoadContext;
