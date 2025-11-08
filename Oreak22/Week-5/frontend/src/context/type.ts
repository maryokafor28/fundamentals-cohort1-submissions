import type { AxiosResponse } from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
}
export type doctorProps = {
  name: string;
  email: string;
  phone: string;
  department:
    | "Cardiology"
    | "Neurology"
    | "Pediatrics"
    | "Orthopedics"
    | "General Surgery"
    | "Outpatient Department (OPD)";
  designation: string;
  specialist: string;
  status: "Active" | "Inactive";
  gender: "Male" | "Female";
  dob: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address: string;
  bio: string;
  image: string;
  password: "";
};

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<AxiosResponse<any, any, {}>>;
  signup: ({
    name,
    email,
    phone,
    department,
    designation,
    specialist,
    status,
    gender,
    dob,
    bloodGroup,
    address,
    bio,
    image,
    password,
  }: doctorProps) => Promise<boolean>;
  logout: () => Promise<void>;
}
