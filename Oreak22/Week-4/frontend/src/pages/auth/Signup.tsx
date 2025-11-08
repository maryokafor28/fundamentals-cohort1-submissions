import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import type { SignupValues } from "./type";
import { useAuth } from "@/context/AuthContext";

/////////////////////////////////
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too short!")
    .max(50, "Too long!")
    .required("Required"),

  email: Yup.string().email("Invalid email").required("Required"),
  role: Yup.string().required("Required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    )
    .required("Required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});
////////////////////////////////

const Signup = () => {
  const initialValues: SignupValues = {
    name: "",
    email: "",
    userName: "",
    role: "",
    password: "",
    confirmPassword: "",
  };
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (
    values: SignupValues,
    { setSubmitting }: FormikHelpers<SignupValues>
  ) => {
    await register(
      values.name,
      values.role,
      values.userName,
      values.email,
      values.password
    )
      .then((res) => {
        console.log(res);
        setSubmitting(false);
        navigate("/auth/login", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
      });
  };
  return (
    <div className="flex justify-center flex-col space-y-7 items-center min-h-[100dvh]">
      <h1 className="font-semibold text-lg">Signup for DevConnect</h1>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardAction>
            <Link to={"/auth/login"}>Log In</Link>
          </CardAction>
        </CardHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <CardContent>
                {" "}
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Name</Label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="John Doe"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">User Name</Label>
                    <Field
                      name="userName"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="JDOe"
                    />
                    <ErrorMessage
                      name="userName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Role</Label>
                    <Field
                      name="role"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="e.g Frontend Developer"
                    />
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="example@email.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Field
                      name="password"
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="••••••••"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Confirm Password</Label>
                    </div>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="••••••••"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  disabled={isSubmitting}
                  variant="outline"
                  type="submit"
                  className="w-full"
                >
                  {isSubmitting ? "Creating Account" : "Create account"}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Signup;
