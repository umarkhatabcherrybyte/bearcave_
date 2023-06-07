// PrivateRoute.js
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { address, isConnected, isDisconnected } = useAccount();

  console.log(isDisconnected);

  if (isDisconnected) {
    return <Navigate to="/" replace />;
  }

  return children;
}
export default PrivateRoute;
