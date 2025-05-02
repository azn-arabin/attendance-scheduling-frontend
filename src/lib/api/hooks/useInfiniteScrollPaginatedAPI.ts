import { useEffect, useRef, useState } from "react";
import { checkConnection, handleErrorResponse } from "../handleAPIError";
import { AxiosResponse } from "axios";

interface UseAPIMultipleItemsProps<PayloadType, ItemType> {
  APIFunction: (
    payload: PayloadType & { page: number; pageSize: number },
  ) => Promise<
    AxiosResponse<{ data: { [key: string]: ItemType[] }; meta: any }>
  >;
  indexString: string;
  apiProps?: PayloadType;
  threshold?: number;
  pageSize?: number;
}

const useAPIMultipleItems = <PayloadType = any, ItemType = any>({
  APIFunction,
  indexString,
  apiProps = {} as PayloadType,
  threshold = 20,
  pageSize = 12,
}: UseAPIMultipleItemsProps<PayloadType, ItemType>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [shouldCallAPI, setShouldCallAPI] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ItemType[]>([]);

  const getItems = async () => {
    setLoading(true);
    try {
      const res = await APIFunction({ ...apiProps, page, pageSize });
      const value = res.data?.data ?? {};

      setItems((prevItems) =>
        Math.ceil(prevItems.length / pageSize) >= page
          ? prevItems
          : [...prevItems, ...(value[indexString] || [])],
      );

      const meta = res.data?.meta ?? {};
      setTotalPages(meta?.totalPages ?? 1);
      setPage(meta?.currentPage + 1);
    } catch (e) {
      handleErrorResponse(e);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - threshold
        ) {
          setShouldCallAPI((prev) => !prev);
        }
      }, 200);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [containerRef.current]);

  useEffect(() => {
    if (page <= totalPages) {
      checkConnection(getItems);
    }
  }, [shouldCallAPI]);

  return { loading, items, setItems, containerRef };
};

export default useAPIMultipleItems;
