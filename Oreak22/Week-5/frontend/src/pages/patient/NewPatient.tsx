import PatientForm, { type IPatient } from "./components/PatientForm";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";

const NewPatient = () => {
  const navigate = useNavigate();
  const createPatient = async (data: IPatient) => {
    try {
      await axiosClient.post("/patient/createpatient", data).then((res) => {
        console.log(res.data);
        if (res.data.status) {
          navigate("/patient");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-10 px-5">
      <PatientForm mode="add" createAction={createPatient} />
    </div>
  );
};

export default NewPatient;
