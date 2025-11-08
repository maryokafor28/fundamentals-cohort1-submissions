import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import DoctorList from "./pages/doctor";
import NewDoctor from "./pages/auth/NewDoctor";
import DoctorInfo from "./pages/doctor/DoctorInfo";
import PatientList from "./pages/patient";
import NewPatient from "./pages/patient/NewPatient";
import EditPatient from "./pages/patient/EditPatient";
import PatientAppointment from "./pages/PatientAppointment";
import AddAppointment from "./pages/PatientAppointment/AddAppointment";
import PatientInfo from "./pages/patient/PatientInfo";
import PatientAppointmentInfo from "./pages/PatientAppointment/PatientAppointmentInfo";
import LoginForm from "./pages/auth/Login";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./pages/auth/SignIn";
import { ToastProvider } from "./components/ui/use-toast";
import ReportList from "./pages/report";
import AddReport from "./pages/report/AddReport";
import ReportInfo from "./pages/report/ReportInfo";
import PrescriptionList from "./pages/Perscription";
import PrescriptionInfo from "./pages/Perscription/PrescriptionInfo";
import AddPrescription from "./pages/Perscription/AddPrescription";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/">
              <Route path="" element={<Navigate to={"/dashboard"} replace />} />
            </Route>
            <Route path="/auth">
              <Route path="login" element={<LoginForm />} />
              <Route path="signup" element={<SignIn />} />
            </Route>
            <Route path="/">
              <Route
                path="dashboard"
                element={
                  <Layout page="Dashboard">
                    {" "}
                    <Dashboard />
                  </Layout>
                }
              />
            </Route>
            {/*  */}
            <Route path="/doctor">
              <Route
                path=""
                element={
                  <Layout page="Doctor">
                    {" "}
                    <DoctorList />
                  </Layout>
                }
              />
              <Route
                path="newDoctor"
                element={
                  <Layout page="Doctor">
                    {" "}
                    <NewDoctor />
                  </Layout>
                }
              />
              <Route
                path=":id"
                element={
                  <Layout page="Doctor">
                    <DoctorInfo />
                  </Layout>
                }
              />
            </Route>
            <Route path="/patient">
              <Route
                path=""
                element={
                  <Layout page="Patient">
                    {" "}
                    <PatientList />
                  </Layout>
                }
              />
              <Route
                path="newPatient"
                element={
                  <Layout page="Patient">
                    <NewPatient />
                  </Layout>
                }
              />
              <Route
                path="Patientinfo/:id"
                element={
                  <Layout page="Patient">
                    <PatientInfo />
                  </Layout>
                }
              />
              <Route
                path="editPatient/:id"
                element={
                  <Layout page="Patient">
                    <EditPatient />
                  </Layout>
                }
              />
            </Route>
            <Route path="/patient_appointment">
              <Route
                path=""
                element={
                  <Layout page="Patient_Appointment">
                    <PatientAppointment />
                  </Layout>
                }
              />
              <Route
                path="addapointment"
                element={
                  <Layout page="Patient_Appointment">
                    <AddAppointment />
                  </Layout>
                }
              />
              <Route
                path=":id"
                element={
                  <Layout page="Patient_Appointment">
                    <PatientAppointmentInfo />
                  </Layout>
                }
              />
            </Route>
            <Route path="/report">
              <Route
                path=""
                element={
                  <Layout page="Patient_Case">
                    <ReportList />
                  </Layout>
                }
              />
              <Route
                path="addreport"
                element={
                  <Layout page="Patient_case">
                    <AddReport />
                  </Layout>
                }
              />
              <Route
                path="patient/:id"
                element={
                  <Layout page="Patient_case">
                    <ReportInfo />
                  </Layout>
                }
              />
              /
            </Route>
            <Route path="/prescription">
              <Route
                path=""
                element={
                  <Layout page="Prescription">
                    <PrescriptionList />
                  </Layout>
                }
              />
              <Route
                path="addprescription"
                element={
                  <Layout page="Prescription">
                    <AddPrescription />
                  </Layout>
                }
              />{" "}
              <Route
                path="patient/:id"
                element={
                  <Layout page="Prescription">
                    <PrescriptionInfo />
                  </Layout>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
