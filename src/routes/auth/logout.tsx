import React, { useEffect } from "react";
import { useAuth } from "@/components/context/auth-provider.tsx";
import useAPIAfterEvent from "@/lib/api/hooks/useAPIAfterEvent.ts";
import { logoutAPI } from "@/lib/api/endpoints/auth.endpoint.ts";
import { Loader2 } from "lucide-react";

const Logout = () => {
  const { logout } = useAuth();

  const { callAPI: callLogoutAPI } = useAPIAfterEvent({
    APIFunction: logoutAPI,
  });

  useEffect(() => {
    callLogoutAPI(
      undefined,
      () => {
        logout();
      },
      () => {
        logout();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default Logout;
