import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import type { LoginValues } from "./type";
import { useAuth } from "@/context/AuthContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    )
    .required("Password is required"),
});

const Login = () => {
  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  const { login, user } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    await login(values.email, values.password)
      .then((res) => {
        console.log(res.data);
        setSubmitting(false);
        navigate(`/dashboard`, { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
      });
  };
  return (
    <div className="flex justify-center flex-col space-y-7 items-center min-h-[100dvh]">
      <h1 className="font-semibold text-lg">Sign in to DevConnect</h1>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Link to={"/auth/signup"}>Sign Up</Link>
          </CardAction>
        </CardHeader>{" "}
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <CardContent>
                <div className="flex flex-col gap-6">
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
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
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
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2 mt-4">
                <Button
                  disabled={isSubmitting}
                  variant="outline"
                  type="submit"
                  className="w-full"
                >
                  {isSubmitting ? "Logging in....." : "Login"}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Login;
