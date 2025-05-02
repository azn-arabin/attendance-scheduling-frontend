import React, { useState } from "react";
import { showToast } from "@/lib/helpers/ui.helper";
import { DeleteIcon, MoreVertical, Pencil, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationAlert } from "@/components/ConfirmationAlert.tsx";
import { cn } from "@/lib/utils.ts";
import useAPIAfterEvent from "@/lib/api/hooks/useAPIAfterEvent.ts";

interface EditDeleteDropDownProps<T> {
  deleteAPI: (payload: T) => Promise<any>;
  onEdit: (payload: T) => void;
  payload: T;
  onSuccess?: (payload: T) => void;
  className?: string;
}

const EditDeleteDropdown = <T,>({
  deleteAPI,
  onEdit,
  payload,
  onSuccess,
  className,
}: EditDeleteDropDownProps<T>) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const { loading, callAPI: callDeleteAPI } = useAPIAfterEvent({
    APIFunction: deleteAPI,
  });

  const handleDelete = () => {
    callDeleteAPI(
      payload,
      (data: any) => {
        showToast({ title: data.message });
        if (onSuccess) onSuccess(payload);
      },
      (e: any) => {
        showToast({
          title: e.response?.data?.message,
        });
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn("bg-transparent p-1", className)}>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(payload)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteModal(true)}
            className="text-red-600"
          >
            <TrashIcon className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationAlert
        open={deleteModal}
        onOpenChange={setDeleteModal}
        title="Are you sure?"
        description="Once deleted, this cannot be undone."
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
};

export default EditDeleteDropdown;
