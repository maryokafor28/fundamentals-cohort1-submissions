import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ArrowUpDown, Filter, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "./components/search-form";
import axiosClient from "@/api/axiosClient";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: string;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [sortField, setSortField] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleSort = (field: keyof Doctor) => {
    const sorted = [...doctors].sort((a, b) =>
      String(a[field]).localeCompare(String(b[field]))
    );
    setDoctors(sorted);
    sortField ? setSortField(field) : setSortField(field);
  };

  const handleFilter = (status: string | null) => {
    setFilterStatus(status);
  };

  const filteredDoctors = filterStatus
    ? doctors.filter(
        (d) => d.status.toLowerCase() === filterStatus.toLowerCase()
      )
    : doctors;
  const navigate = useNavigate();

  useEffect(() => {
    const getDoctor = () => {
      try {
        axiosClient.get("/doctor/getDoctor").then((res) => {
          if (res.data.status) {
            setDoctors(res.data.doctor);
          }
        });
      } catch (err) {
        if (err) {
          console.log(err);
        }
      }
    };
    getDoctor();
  }, []);

  return (
    <div className="space-y-6 py-10 px-5">
      <Card>
        <CardHeader className="flex flex-col ">
          <div className=" flex justify-between items-center w-full mb-4 md:mb-0">
            <CardTitle>Doctor List</CardTitle>
            <div className="hidden md:flex flex-1 mx-4">
              <SearchForm />
            </div>
            <div className="flex gap-2">
              <Button
                variant={"link"}
                onClick={() => navigate("/doctor/newdoctor")}
              >
                <Plus /> Add Doctor
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter("Active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter("Inactive")}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mx-auto md:hidden w-full">
            <SearchForm />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort("_id")}
                  className="cursor-pointer"
                >
                  S/N <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("name")}
                  className="cursor-pointer"
                >
                  Name <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.length < 1 ? (
                <p className="text-center w-full mt-5 ">You have no record</p>
              ) : (
                filteredDoctors.map((doctor, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>{doctor.phone}</TableCell>
                    <TableCell>{doctor.department}</TableCell>
                    <TableCell
                      className={
                        doctor.status === "Active"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {doctor.status}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/doctor/${doctor._id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// {
//       _id: 1,
//       name: "Mr Doctor",
//       email: "doctor@ambitiousit.com",
//       phone: "(406) 555-0120",
//       department: "Outpatient department (OPD)",
//       status: "Active",
//     },
//     {
//       _id: 2,
//       name: "Mr Doctor X",
//       email: "doctorx@ambitiousit.com",
//       phone: "(406) 555-0121",
//       department: "Surgery",
//       status: "Inactive",
//     },
//     {
//       _id: 3,
//       name: "Mr Doctor Y",
//       email: "doctory@ambitiousit.com",
//       phone: "(406) 555-0122",
//       department: "Pediatrics",
//       status: "Active",
//     },
