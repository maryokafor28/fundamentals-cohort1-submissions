import { useEffect, useState } from "react";
import PatientForm, { type IPatient } from "./components/PatientForm";
import axiosClient from "@/api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

const EditPatient = () => {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<IPatient>({} as IPatient);
  const navigate = useNavigate();
  const updatePatient = async (data: IPatient) => {
    try {
      await axiosClient.put(`/patient/update/${id}`, data).then((res) => {
        console.log(res.data);
        navigate("/patient");
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axiosClient.get(`/patient/${id}`);
        console.log(response.data);
        setInitial(response.data.patient);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchPatient();
  }, []);
  return (
    <div className="py-10 px-5">
      <PatientForm
        mode="edit"
        createAction={updatePatient}
        initialData={initial}
      />
    </div>
  );
};

export default EditPatient;
