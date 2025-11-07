import { useEffect, useState } from "react";
import Button from "../component/ui/Button";
import SectionHeader from "../component/ui/SectionHeader";
import type { DisplayReportProps, Report } from "../types/type";
import { GrDocumentText } from "react-icons/gr";

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`${baseUrl}/reports`);
        if (!response.ok) throw Error("Failed to fetch Reports");

        const data = await response.json();

        setReports(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unexpected Error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [baseUrl]);
  return (
    <div>
      <SectionHeader
        title="Reports"
        subtitle="Health reports and medical documents"
      >
        <Button>Upload Report</Button>
      </SectionHeader>

      {loading && <p className="text-gray-500">Loading Reports...</p>}
      {error && <p className="text-red-500">Error Fetching: {error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col md:flex-row md:flex-wrap gap-4 ">
          {reports.map((report) => (
            <DisplayActivity key={report._id} report={report} />
          ))}
        </ul>
      )}
    </div>
  );
};

function DisplayActivity({ report }: DisplayReportProps) {
  return (
    <li className="list-none border p-4 rounded-lg hover:shadow-lg ">
      <div className="flex justify-between min-w-[250px] gap-4">
        <div className="bg-lightGreen w-fit p-3 rounded-md h-fit">
          <GrDocumentText className="text-darkGreen text-xl" />
        </div>

        <div className="flex">
          <div>
            <h2 className="font-bold">{report.title}</h2>

            <p className="my-4">
              <span className="uppercase bg-gray-200 px-2 py-1 rounded-full">
                {report.user.name[0]}
              </span>{" "}
              {report.user.name}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{report.description} mins</span>
            </div>
          </div>

          <p className="bg-lightGreen text-darkGreen rounded-md h-fit border border-darkGreen text-xs px-4 py-0.5">
            {report.reportDate.split("T")[0]}
          </p>
        </div>
      </div>
    </li>
  );
}

export default Reports;
