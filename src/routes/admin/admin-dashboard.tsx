import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout.tsx";
import { PageContainer, TitleText } from "@/components/common-components.tsx";
import { Batch } from "@/lib/types.ts";
import { ColumnDef } from "@tanstack/react-table";
import useAPIGetItems from "@/lib/api/hooks/useAPIGetItems.ts";
import { getAllBatchesAPI } from "@/lib/api/endpoints/common.api.ts";
import { DataTable } from "@/components/data-table.tsx";
import EditDeleteDropdown from "@/components/EditDeleteDropdown.tsx";
import { deleteBatchAPI } from "@/lib/api/endpoints/admin.api.ts";
import { Button } from "@/components/ui/button.tsx";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import CreateBatchDialog from "@/routes/admin/create-batch-dialog.tsx";
import ExportAttendance from "@/routes/admin/export-attendance.tsx";

const AdminDashboard = () => {
  const { loading, items, setItems } = useAPIGetItems({
    APIFunction: getAllBatchesAPI,
  });

  const [selectedBatch, setSelectedBatch] = useState<Batch>();
  const [dialogForm, setDialogForm] = useState(false);

  const batchColumns: ColumnDef<Batch>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Batch Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => format(new Date(row.original.created_at), "PPp"),
    },
    {
      id: "instructors",
      header: "Instructors",
      cell: ({ row }) => (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer">
          {row.original.instructors_count}
        </span>
      ),
    },
    {
      id: "students",
      header: "Students",
      cell: ({ row }) => (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer">
          {row.original.students_count}
        </span>
      ),
    },
    {
      id: "exports",
      header: "Export Attendance",
      cell: ({ row }) => <ExportAttendance batchId={row.original.id} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <EditDeleteDropdown
          payload={row.original.id}
          deleteAPI={deleteBatchAPI}
          onEdit={() => {
            setSelectedBatch(row.original);
            setDialogForm(true);
          }}
          onSuccess={(id) => {
            const updated = items.filter((item) => item.id !== id);
            setItems(updated);
          }}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <TitleText>All Batches</TitleText>

          <Button
            onClick={() => {
              setSelectedBatch(undefined);
              setDialogForm(true);
            }}
          >
            Create Batch
          </Button>
        </div>

        <DataTable data={items} loading={loading} columns={batchColumns} />
      </PageContainer>

      <CreateBatchDialog
        batch={selectedBatch}
        onSuccess={(data) => {
          if (selectedBatch) {
            const updated = items.map((item) =>
              item.id === selectedBatch.id ? data : item,
            );
            setItems(updated);
          } else {
            setItems([...items, data]);
          }

          setDialogForm(false);
        }}
        open={dialogForm}
        setOpen={setDialogForm}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
