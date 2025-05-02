import { useState } from "react";
import { checkConnection, handleAPIError } from "@/lib/api/handleAPIError.ts";
import { AxiosResponse } from "axios";

interface useAPIAfterEventProps<PayloadType> {
  APIFunction: (payload: PayloadType) => Promise<AxiosResponse<any>>;
}

const useAPIAfterEvent = <PayloadType>({
  APIFunction,
}: useAPIAfterEventProps<PayloadType>) => {
  const [loading, setLoading] = useState(false);

  const callAPI = (
    payload: PayloadType,
    onSuccess: (value: any) => void,
    onError?: (value: any) => void,
  ) => {
    const postCallback = async () => {
      setLoading(true);
      try {
        const res = await APIFunction(payload);
        onSuccess(res.data);
      } catch (e) {
        onError ? onError(e) : handleAPIError(e);
      } finally {
        setLoading(false);
      }
    };

    // Check for internet connection before executing post
    checkConnection(postCallback);
  };

  return { loading, callAPI };
};

export default useAPIAfterEvent;
