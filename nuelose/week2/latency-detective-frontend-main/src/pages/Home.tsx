import Header from "../component/Header";
import { TbActivityHeartbeat } from "react-icons/tb";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { MdOutlineAccessTime } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LiaTimesCircle } from "react-icons/lia";
import { useState } from "react";
import type { BenchmarkReport } from "../types/type";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Home() {
  const [fibNum, setFibNum] = useState<string>("");
  const [connections, setConnections] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [results, setResults] = useState<BenchmarkReport | null>(null);
  const [loading, setLoading] = useState(false);
  const isButtonDisabled = !fibNum || !connections || !duration || loading;

  const runBenchmark = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    const fib = +fibNum;
    const conns = +connections;
    const dur = +duration;

    setLoading(true);
    setResults(null);

    try {
      const res = await fetch("http://localhost:3002/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fib, conns, dur }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      const data: BenchmarkReport = await res.json();
      setResults(data);
      console.log(results);
      console.log(loading);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <Header />
      <div
        className="container
      "
      >
        <div className="flex items-center ">
          <TbActivityHeartbeat className="text-blue-500" />
          <h2>Benchmark Configuration</h2>
        </div>

        <p className="text-slate-500">
          Configure your API performance test parameter
        </p>

        <form onSubmit={runBenchmark}>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="line-items flex-col">
              <label htmlFor="fibNum">Fibonacci Number</label>
              <input
                onChange={(e) => setFibNum(e.target.value)}
                value={fibNum}
                id="fibNum"
                type="number"
                placeholder="40"
              />
            </div>

            <div className="line-items flex-col">
              <label htmlFor="connections">Concurrent Connections</label>
              <input
                onChange={(e) => setConnections(e.target.value)}
                value={connections}
                type="number"
                placeholder="100"
              />
            </div>

            <div className="line-items flex-col">
              <label htmlFor="connections">Duration in Seconds</label>
              <input
                onChange={(e) => setDuration(e.target.value)}
                value={duration}
                type="number"
                placeholder="20"
              />
            </div>
          </div>

          <button
            className={`  ${
              isButtonDisabled || loading
                ? "bg-blue-400/40 cursor-progress"
                : "bg-blue-500 cursor-pointer"
            } flex justify-center gap-2 mt-4  py-2 rounded-lg  text-slate-50 items-center border w-full `}
          >
            {loading ? <AiOutlineLoading3Quarters /> : <AiOutlineThunderbolt />}

            <p>Run Benchmark</p>
          </button>
        </form>
      </div>
      {results ? (
        <div className="container">
          <div>
            <h2>Performance Results</h2>
            <p className="text-slate-500">
              Latest benchmark results from your API performance test
            </p>
          </div>

          <div className="flex flex-col justify-between md:flex-row gap-4">
            <div>
              <div className="line-items items-center ">
                <MdOutlineAccessTime className="text-blue-500" />
                <p>Average Latency</p>
              </div>
              <p className="font-bold">{results.averageLatency}</p>
            </div>

            <div>
              <div className="line-items items-center ">
                <IoMdCheckmarkCircleOutline className="text-green-500" />
                <p>Successful</p>
              </div>
              <p className="font-bold text-green-500">
                {results.totalRequests -
                  results.totalErrors -
                  results.totalTimeouts}
              </p>
            </div>

            <div>
              <div className="line-items items-center ">
                <LiaTimesCircle className="text-red-500" />
                <p>Failed</p>
              </div>
              <p className="font-bold text-red-500">
                {results.totalErrors + results.totalTimeouts}
              </p>
            </div>

            <div>
              <div className="line-items items-center ">
                <TbActivityHeartbeat className="text-blue-500" />
                <p>Success Rate</p>
              </div>
              <p className="font-bold">{results.successRate}</p>
            </div>

            <div>
              <div className="line-items items-center ">
                <AiOutlineThunderbolt className="text-violet-500" />
                <p>Total Requests</p>
              </div>
              <p className="font-bold text-violet-500">
                {results.totalRequests}
              </p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;
