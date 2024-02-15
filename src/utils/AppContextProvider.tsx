// import context providers
import { ProcessContextProvider } from "./navbar/ProcessContext";
import { LoadContextProvider } from "./loading/LoadContext.tsx";

interface IProps {
  children: React.ReactNode;
}

const AppContextProvider = ({ children }: IProps) => {
  return (
    <ProcessContextProvider>
      <LoadContextProvider>{children}</LoadContextProvider>
    </ProcessContextProvider>
  );
};

export default AppContextProvider;
