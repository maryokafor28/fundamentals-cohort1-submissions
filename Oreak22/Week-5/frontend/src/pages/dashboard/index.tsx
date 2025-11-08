import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tooltip } from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PanelCard from "./components/PanelCard";
import StatCard from "./components/StatCard";

const monthlyData = [
  { month: "Jan", users: 60 },
  { month: "Feb", users: 75 },
  { month: "Mar", users: 55 },
  { month: "Apr", users: 90 },
  { month: "May", users: 70 },
  { month: "Jun", users: 80 },
  { month: "Jul", users: 60 },
  { month: "Aug", users: 75 },
  { month: "Sep", users: 40 },
  { month: "Oct", users: 5 },
  { month: "Nov", users: 8 },
  { month: "Dec", users: 3 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button size="sm">Export</Button>
            <Badge>Admin</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Department" value={6} />
          <StatCard title="Doctor" value={14} />
          <StatCard title="Patient" value={1} />
          <StatCard title="Patient Appointment" value={3} />
          <StatCard title="Reports" value={0} />
          <StatCard title="Invoice" value={0} />
          <StatCard title="Prescription" value={0} />
          <StatCard title="Payment" value={0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PanelCard
              title="Monthly Registered Users"
              action={
                <div className="text-sm text-muted-foreground">
                  Year overview
                </div>
              }
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="users" barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </PanelCard>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent>
                  <p className="text-sm text-gray-500">Quick Actions</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm">New Doctor</Button>
                    <Button size="sm">New Patient</Button>
                    <Button size="sm">New Appointment</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <p className="text-sm text-gray-500">Recent Activity</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Appointment created
                        </p>
                        <p className="text-xs text-gray-500">
                          Today • 10:12 AM
                        </p>
                      </div>
                      <Badge>New</Badge>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Prescription updated
                        </p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                      <span className="text-xs text-gray-400">—</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <PanelCard
              title="Monthly Earning"
              action={
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Weekly
                  </Button>
                  <Button variant="ghost" size="sm">
                    Monthly
                  </Button>
                </div>
              }
            >
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-2xl font-medium">$29.5</p>
                  <p className="text-xs text-red-500 mt-1">
                    -31.08% From Previous week
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      1st 15 days Analytics
                    </div>
                    <div className="h-16 rounded-lg bg-muted/30 flex items-center justify-center">
                      40.56%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      last 15 days Analytics
                    </div>
                    <div className="h-16 rounded-lg bg-muted/30 flex items-center justify-center">
                      30.56%
                    </div>
                  </div>
                </div>
              </div>
            </PanelCard>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top Doctors</CardTitle>
                <CardDescription>Based on appointment count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dr. Jane Doe</p>
                      <p className="text-xs text-gray-500">Cardiology</p>
                    </div>
                    <div className="text-sm">14 appts</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dr. John Smith</p>
                      <p className="text-xs text-gray-500">Paediatrics</p>
                    </div>
                    <div className="text-sm">9 appts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-500">Notifications</p>
                <div className="flex flex-col gap-2">
                  <div className="p-3 rounded bg-white/60">
                    Server backup completed
                  </div>
                  <div className="p-3 rounded bg-white/60">
                    New patient registered
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <CardContent>
              <p className="text-sm text-gray-500">Footer insights</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
