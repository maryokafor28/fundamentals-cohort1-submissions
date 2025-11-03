import type{ ReactNode } from "react";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender?: string;
  activities?: string[];
  meals?: string[];
  appointments?: string[];
  reports?: string[];
}



export interface AppointmentProps {
  _id: string;
  user: UserType;
  doctor: DoctorType;
  date: string;
  status: string;
  reason:string;
}

export type Doctor = {
  _id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  hospital: string;
};

export interface Report {
    _id: string;
    user: UserType;
    title: string;
    description: string;
    reportDate: string;
}

export type DisplayReportProps = {
  report: Report;
};

export type DisplayDoctorCard = {
  doctor: Doctor;
};

export interface UserType {
  _id: string;
  name: string;
}

export interface DoctorType {
  _id: string;
  name: string;
  specialty: string;
}

export interface MealType {
  _id: string;
  name: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  type: string;
  user: UserType;
  date?: string;
}

export type Activities = {
  _id: string;
  userId: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
};

export type DisplayActivityProp = {
  activity: Activities;
};

export interface SectionHeaderProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}



export interface NewUserFormData {
  name: string;
  email: string;
  age: number | string;
  gender: string;
}
