import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout.tsx";
import { useNavigate, useSearchParams } from "react-router";
import usePaginatedAPI from "@/lib/api/hooks/usePaginatedAPI.ts";
import { ClassItem } from "@/lib/types.ts";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

import {
  deleteClasAPI,
  getInstructorClassesAPI,
} from "@/lib/api/endpoints/instructor.api.ts";
import { PageContainer, TitleText } from "@/components/common-components.tsx";
import { DataTable } from "@/components/data-table.tsx";
import EditDeleteDropdown from "@/components/EditDeleteDropdown.tsx";
import CreateClassDialog from "@/routes/instructor/create-class-dialog.tsx";

const InstructorClassManagement = () => {
  const [dialogForm, setDialogForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);

  const { loading, totalPages, items, setItems } = usePaginatedAPI<
    Record<string, never>,
    ClassItem
  >({
    APIFunction: getInstructorClassesAPI,
    page,
    pageSize,
  });

  const handlePageChange = (newPage: number) => {
    navigate(`?page=${newPage}&pageSize=${pageSize}`);
  };

  const columns: ColumnDef<ClassItem>[] = [
    {
      accessorKey: "topic",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Topic
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "start_time",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("start_time"));
        return format(date, "PPPpp");
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => `${row.getValue("duration")} mins`,
    },
    {
      accessorKey: "student_count",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Students
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer">
          {row.original.batch.students_count}
        </span>
      ),
    },
    {
      accessorKey: "batch",
      header: "Batch",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer">
              {row.original.batch.name}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-60 text-sm">
            <div>
              <strong>Name:</strong> {row.original.batch.name}
            </div>
            <div>
              <strong>Details:</strong>{" "}
              {row.original.batch.description || "No details available"}
            </div>
          </PopoverContent>
        </Popover>
      ),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <EditDeleteDropdown
          payload={row.original.id}
          deleteAPI={deleteClasAPI}
          onEdit={() => {
            setSelectedClass(row.original);
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
          <TitleText>Upcoming Classes</TitleText>

          <Button
            onClick={() => {
              setSelectedClass(undefined);
              setDialogForm(true);
            }}
          >
            Create Class
          </Button>
        </div>
        <div className="overflow-x-auto mt-4 rounded-xl shadow-md border w-full">
          <DataTable
            columns={columns}
            data={items}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={page}
            loading={loading}
          />
        </div>
      </PageContainer>

      <CreateClassDialog
        selectedClass={selectedClass}
        open={dialogForm}
        setOpen={setDialogForm}
        onSuccess={(data) => {
          if (selectedClass) {
            const updated = items.map((item) =>
              item.id === selectedClass.id ? data : item,
            );
            setItems(updated);
          } else {
            setItems([...items, data]);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default InstructorClassManagement;
