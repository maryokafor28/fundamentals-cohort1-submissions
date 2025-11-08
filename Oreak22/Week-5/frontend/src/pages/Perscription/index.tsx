import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Filter, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function PrescriptionList() {
  const prescriptions = [
    {
      id: "P-001",
      doctor: "Dr. David Smith",
      patient: "Mr. John Doe",
      date: "2025-10-20",
      status: "Active",
    },
    {
      id: "P-002",
      doctor: "Dr. Emma Brown",
      patient: "Mrs. Mary Adams",
      date: "2025-10-19",
      status: "Completed",
    },
    {
      id: "P-003",
      doctor: "Dr. Michael Green",
      patient: "Mr. Paul West",
      date: "2025-10-18",
      status: "Active",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Prescription List
        </h2>
        <Link to="/prescription/addprescription" className=" mt-4 sm:mt-0">
          + Add Prescription
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      {/* Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-700">
            All Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>ID</TableHead>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((p, index) => (
                <TableRow
                  key={p.id}
                  className={index % 2 === 0 ? "" : "bg-gray-50"}
                >
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.doctor}</TableCell>
                  <TableCell>{p.patient}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        p.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => navigate(`/prescription/patient/${p.id}`)}
                      className="text-emerald-700 hover:text-emerald-800 transition"
                    >
                      <Eye className="h-4 w-4 inline" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
