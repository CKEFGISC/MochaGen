import { useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ProcessContext from "./utils/navbar/ProcessContext";

export default function Navigator() {
  const { process } = useContext(ProcessContext);

  const navigate = useNavigate();

  const paths = ["/home", "/project/description"];

  useEffect(() => {
    navigate(paths[process]);
  }, [process]);

  return (
    <>
      <Outlet />
    </>
  );
}
