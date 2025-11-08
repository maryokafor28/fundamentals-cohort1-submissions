import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import api from "../api/axiosClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CreateTask = () => {
  const TaskSchema = Yup.object().shape({
    title: Yup.string()
      .min(6, "must be at least 6 characters")
      .required("Title is required"),
    discription: Yup.string()
      .min(15, "must be at least 15 characters")
      .required("Discription is required"),
    time: Yup.string().required("time is required"),
  });
  interface taskValue {
    title: string;
    discription: string;
    time: string;
  }
  const initialValues: taskValue = {
    title: "",
    discription: "",
    time: "",
  };
  const handleSubmit = (
    values: taskValue,
    { setSubmitting }: FormikHelpers<taskValue>
  ) => {
    setSubmitting(true);
    try {
      api
        .post("/task/new", {
          title: values.title,
          discription: values.discription,
          time: values.time,
        })
        .then((res) => {
          values.title = "";
          values.discription = "";
          values.time = "";
        });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Create New Task
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={TaskSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 font-medium">
                    Task Title
                  </Label>
                  <Field
                    as={Input}
                    name="title"
                    type="text"
                    placeholder="Enter task title"
                    className="text-base"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="discription"
                    className="text-gray-700 font-medium"
                  >
                    Description
                  </Label>
                  <Field
                    as={Textarea}
                    name="discription"
                    placeholder="Add description..."
                    rows={6}
                    className="text-base resize-none"
                  />
                  <ErrorMessage
                    name="discription"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Time Field */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-700 font-medium">
                    Time
                  </Label>
                  <Field
                    as={Input}
                    name="time"
                    type="datetime-local"
                    className="text-base"
                  />
                  <ErrorMessage
                    name="time"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <CardFooter className="px-0">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-lg font-semibold"
                  >
                    {isSubmitting ? "Adding..." : "Add Task"}
                  </Button>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTask;
