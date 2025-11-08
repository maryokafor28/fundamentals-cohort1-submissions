import React from "react";
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

const ReportList: React.FC = () => {
  const patients = [
    {
      name: "Mr Sudhansu",
      email: "tim.jennings@example.com",
      phone: "(406) 555-0120",
      foodAllergy: "Yes",
      heartDisease: "Yes",
      diabetic: "Yes",
      _id: "2",
    },
    {
      name: "Mr Sudhansu",
      email: "tim.jennings@example.com",
      phone: "(406) 555-0121",
      foodAllergy: "No",
      heartDisease: "No",
      diabetic: "No",
      _id: "2",
    },
    {
      name: "Mr Sudhansu",
      email: "tim.jennings@example.com",
      phone: "(406) 555-0122",
      foodAllergy: "No",
      heartDisease: "No",
      diabetic: "Yes",
      _id: "2",
    },
    {
      name: "Mr Sudhansu",
      email: "tim.jennings@example.com",
      phone: "(406) 555-0123",
      foodAllergy: "Yes",
      heartDisease: "No",
      diabetic: "No",
      _id: "2",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <Card className="border shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 mt-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Patient Case Studies List
          </h2>
          <Link to={`/report/addreport`} className="mt-4 sm:mt-0">
            + Add Patient Case Studies
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 px-6 mt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        {/* Table Section */}
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-700">
            Patient Case Studies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Food Allergy</TableHead>
                <TableHead>Heart Disease</TableHead>
                <TableHead>Diabetic</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p, idx) => (
                <TableRow key={idx} className={idx % 2 ? "bg-gray-50" : ""}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell
                    className={
                      p.foodAllergy === "Yes"
                        ? "text-emerald-700 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {p.foodAllergy}
                  </TableCell>
                  <TableCell
                    className={
                      p.heartDisease === "Yes"
                        ? "text-emerald-700 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {p.heartDisease}
                  </TableCell>
                  <TableCell
                    className={
                      p.diabetic === "Yes"
                        ? "text-red-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {p.diabetic}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="text-emerald-700 hover:text-emerald-800 transition"
                      onClick={() => navigate(`/report/patient/${p._id}`)}
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
};

export default ReportList;
