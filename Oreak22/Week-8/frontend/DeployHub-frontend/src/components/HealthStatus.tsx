import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useApi } from "../hooks/useApi";
import { api } from "@/lib/api";

export const HealthStatus: React.FC = () => {
  const { data, loading, error, execute } = useApi(async () => {
    const res = await api.get("/health");
    return res.data;
  });

  useEffect(() => {
    execute();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <p>Loading status...</p>;
  if (error) return <p>Error loading health status.</p>;

  return (
    <div className="p-4 bg-green-100 rounded">
      <p>Backend Status: {data?.status}</p>
      <p>Version: {data?.version}</p>
    </div>
  );
};
