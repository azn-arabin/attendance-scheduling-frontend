import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "@/components/dashboard-layout.tsx";
import { PageContainer } from "@/components/common-components.tsx";
import {
  getClassDistributionAPI,
  getDashboardStatsAPI,
  getMonthlyClassesAPI,
} from "@/lib/api/endpoints/instructor.api.ts"; // update path based on your setup

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    total_classes: 0,
    upcoming_classes: 0,
    students_taught: 0,
  });
  const [distribution, setDistribution] = useState([]);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    getDashboardStatsAPI().then((res) => setStats(res.data));
    getClassDistributionAPI().then((res) => setDistribution(res.data));
    getMonthlyClassesAPI().then((res) => setMonthly(res.data));
  }, []);

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Classes</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {stats.total_classes}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {stats.upcoming_classes}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Students Taught</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {stats.students_taught}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Distribution per Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribution}>
                <XAxis dataKey="batch_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Class Count (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthly}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  );
}
