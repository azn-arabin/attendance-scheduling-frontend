import { useEffect, useState } from "react";
import { checkConnection, handleErrorResponse } from "../handleAPIError";
import { AxiosResponse } from "axios";

interface UsePaginatedAPIProps<PayloadType, ItemType> {
  APIFunction: (
    payload: PayloadType & { page: number; pageSize: number },
  ) => Promise<AxiosResponse<any>>;
  indexString?: string;
  apiProps?: PayloadType;
  page?: number;
  pageSize?: number;
}

const usePaginatedAPI = <PayloadType = any, ItemType = any>({
  APIFunction,
  indexString = "data",
  apiProps = {} as PayloadType,
  page = 1,
  pageSize = 12,
}: UsePaginatedAPIProps<PayloadType, ItemType>) => {
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ItemType[]>([]);

  const getItems = async () => {
    setLoading(true);
    try {
      const res = await APIFunction({ ...apiProps, page, pageSize });
      const data = res.data?.data ?? {};

      setItems(data[indexString] as any);

      setTotalPages(data?.last_page ?? 1);
    } catch (e) {
      handleErrorResponse(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (page <= totalPages) {
      checkConnection(getItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { loading, items, setItems, totalPages };
};

export default usePaginatedAPI;
