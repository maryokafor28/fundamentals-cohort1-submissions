import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/api/axiosClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";

const NewProject = () => {
  const ProjectSchema = Yup.object().shape({
    title: Yup.string()
      .min(6, "must be at least 6 characters")
      .required("Title is required"),
    discription: Yup.string()
      .min(15, "must be at least 15 characters")
      .required("Discription is required"),
  });
  interface taskValue {
    title: string;
    discription: string;
  }
  const initialValues: taskValue = {
    title: "",
    discription: "",
  };
  const handleSubmit = (
    values: taskValue,
    { setSubmitting }: FormikHelpers<taskValue>
  ) => {
    setSubmitting(true);
    try {
      api
        .post("/project/new", {
          title: values.title,
          discription: values.discription,
        })
        .then(() => {
          values.title = "";
          values.discription = "";
        });
    } finally {
      values.title = "";
      values.discription = "";
      setSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/30 p-6">
      <Card className="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            Create New Project
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Share your idea or collaboration project with the community.
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <Formik
            initialValues={initialValues}
            validationSchema={ProjectSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Project Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Project Title
                  </Label>
                  <Field
                    as={Input}
                    name="title"
                    type="text"
                    placeholder="Enter a short, descriptive title"
                    className="text-base"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Field
                    as={Textarea}
                    name="discription"
                    placeholder="Describe your project goals, scope, and idea..."
                    rows={8}
                    className="resize-none text-base"
                  />
                  <ErrorMessage
                    name="discription"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Separator className="my-4" />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 text-base font-semibold"
                    onClick={() => handleSubmit}
                  >
                    {isSubmitting ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProject;
