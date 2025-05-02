import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { MAIN_API } from "@/lib/api/endpoints";

type Props = {
  batchId: number;
};

export default function ExportAttendance({ batchId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await MAIN_API.get(
        `/admin/batches/${batchId}/attendance/export`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `batch-${batchId}-attendance.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to export attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={loading}>
      {loading ? "Exporting..." : "Export"}
    </Button>
  );
}
