import { useSearchParams, useNavigate } from "react-router";
import { ClassItem } from "@/lib/types";
import usePaginatedAPI from "@/lib/api/hooks/usePaginatedAPI";
import {
  getUpcomingClassesAPI,
  markAttendanceAPI,
} from "@/lib/api/endpoints/student.endpoints";
import DashboardLayout from "@/components/dashboard-layout";
import { PageContainer, TitleText } from "@/components/common-components";
import { DataTable } from "@/components/data-table.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpDown, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { format } from "date-fns";
import useAPIAfterEvent from "@/lib/api/hooks/useAPIAfterEvent.ts";
import { showToast } from "@/lib/helpers/ui.helper.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import React from "react";
import { useAuth } from "@/components/context/auth-provider.tsx";

const StudentDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);

  const {
    loading,
    totalPages,
    items: classes,
  } = usePaginatedAPI<Record<string, never>, ClassItem>({
    APIFunction: getUpcomingClassesAPI,
    page,
    pageSize,
  });

  const handlePageChange = (newPage: number) => {
    navigate(`?page=${newPage}&pageSize=${pageSize}`);
  };

  const now = new Date();

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
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const startTime = new Date(row.original.start_time);
        const windowStart = new Date(startTime.getTime() - 10 * 60 * 1000);
        const windowEnd = new Date(startTime.getTime() + 10 * 60 * 1000);
        const isWithinWindow = now >= windowStart && now <= windowEnd;

        const tooltipMessage = isWithinWindow
          ? "Mark attendance"
          : "You can only mark attendance within 10 minutes before or after class start time. " +
            "Marking before 10 minutes: Present, after 10 minutes: Late, after that: Absent.";

        const { loading, callAPI: markAttendance } = useAPIAfterEvent({
          APIFunction: markAttendanceAPI,
        });

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!isWithinWindow || loading}
                  onClick={() => {
                    markAttendance(
                      { class_id: row.original.id },
                      (data) => {
                        showToast({
                          title: data.message,
                        });
                      },
                      (e) => {
                        showToast({
                          title: e.response?.data?.message,
                        });
                      },
                    );
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Attendance
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              {tooltipMessage}
            </TooltipContent>
          </Tooltip>
        );
      },
    },
  ];

  const { user } = useAuth();

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <TitleText>Upcoming Classes</TitleText>

          <Popover>
            <PopoverTrigger asChild>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer">
                {user?.user?.batch?.name}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-60 text-sm">
              <div>
                <strong>Name:</strong> {user?.user?.batch?.name}
              </div>
              <div>
                <strong>Details:</strong>{" "}
                {user?.user?.batch?.description || "No details available"}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="overflow-x-auto mt-4 rounded-xl shadow-md border w-full">
          <DataTable
            columns={columns}
            data={classes}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={page}
            loading={loading}
          />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default StudentDashboard;
