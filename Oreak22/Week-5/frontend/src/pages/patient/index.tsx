import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Pencil, Filter, Download, Plus, Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Patient {
  _id?: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
}

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await axiosClient.delete(`/patient/delete/${id}`).then((res) => {
        if (res.data.status) {
          console.log("Patient deleted");
          setDeleting(false);
          setIsDeleteOpen(false);
        }
      });
    } catch (err) {
      console.log(err);
      setDeleting(false);
    }
  };

  useEffect(() => {
    try {
      const getPatient = async () => {
        await axiosClient.get("/patient/getpatient").then((res) => {
          if (res.data.status) {
            console.log(res.data);
            setPatients(res.data.patient);
          }
        });
      };

      getPatient();
    } catch (err) {
      console.log(err);
    }
  }, [deleting]);

  return (
    <div className="py-10 px-5">
      <Card className="">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
          <CardTitle className="text-xl font-semibold">Patient List</CardTitle>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button
              onClick={() => navigate("/patient/newpatient")}
              variant={"link"}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Patient
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {patients.length < 1 ? (
                <p className="text-sm min-w-[200px] mx-auto text-center mt-5">
                  You have no patient
                </p>
              ) : (
                <TableBody>
                  {patients.map((patient, index) => (
                    <>
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell className="text-red-500">
                          {patient.status}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                navigate(`/patient/patientinfo/${patient._id}`)
                              }
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                navigate(`/patient/editpatient/${patient._id}`)
                              }
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Dialog
                              open={isDeleteOpen}
                              onOpenChange={setIsDeleteOpen}
                            >
                              <DialogTrigger asChild>
                                <Trash2Icon className="w-4 h-4 text-red-600" />
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[420px]">
                                <DialogHeader>
                                  <DialogTitle>Confirm delete</DialogTitle>
                                </DialogHeader>
                                <p>
                                  Are you sure you want to delete this patient?
                                  This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-2 mt-4">
                                  <Button
                                    variant="ghost"
                                    onClick={() => setIsDeleteOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(patient._id!)}
                                    disabled={deleting}
                                  >
                                    {deleting ? "Deleting..." : "Delete"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PatientList;
