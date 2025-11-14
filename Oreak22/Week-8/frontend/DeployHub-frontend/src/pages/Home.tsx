import React from "react";
import { HealthStatus } from "../components/HealthStatus";

export const Home: React.FC = () => (
  <main className="p-4">
    <h2 className="text-xl font-bold mb-2">Home</h2>
    <HealthStatus />
  </main>
);
