import { useEffect, useState } from "react";
import { checkConnection, handleErrorResponse } from "../handleAPIError.ts";
import { AxiosResponse } from "axios";

interface UseAPIGetItemsProps<ParameterType> {
  APIFunction: (apiProp?: ParameterType) => Promise<AxiosResponse<any>>;
  showErrorToast?: boolean;
  apiProp?: ParameterType;
}

const useAPIGetItems = <ParameterType>({
  APIFunction,
  ...props
}: UseAPIGetItemsProps<ParameterType>) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getItems = async () => {
    setLoading(true);
    try {
      const res = await APIFunction(props.apiProp);
      setItems(res?.data?.data ?? []);
    } catch (e) {
      // if no response with the error, then toast must be visible
      !!props.showErrorToast && handleErrorResponse(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkConnection(getItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.apiProp]);

  return { items, loading, setItems };
};

export default useAPIGetItems;
