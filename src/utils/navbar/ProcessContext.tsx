import React, { Dispatch } from "react";

export interface IProcessContext {
  process: number;
  setProcess: Dispatch<any>;
}
const ProcessContext = React.createContext<IProcessContext | null>(null);

interface IProps {
  children: React.ReactNode;
}
export const ProcessContextProvider = ({ children }: IProps) => {
  const [process, setProcess] = React.useReducer((state: number, action: any) => {
    switch (action.type) {
      case "next":
        return state + 1;
      case "prev":
        return state - 1;
      case "set":
        return action.payload;
      default:
        return state;
    }
  }, 0);
  return <ProcessContext.Provider value={{ process, setProcess }}>{children}</ProcessContext.Provider>;
};

export default ProcessContext;
