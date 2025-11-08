"use client";

import axios from "axios";
import Image from "next/image";

export default function Home() {
  const url_unperformOptimized = `${process.env.NEXT_PUBLIC_URL}/api/performUnoptimized`;
  const url_performOptimized = `${process.env.NEXT_PUBLIC_URL}/api/performOptimized`;

  const unOptimized = async () => {
    try {
      for (let i = 0; i < 40; i++) {
        axios.post(url_unperformOptimized, { times: 42 }).then((res) => {
          console.log(res.data);
        });
      }
    } finally {
      console.log("done");
    }
  };
  const Optimized = async () => {
    try {
      for (let i = 0; i < 40; i++) {
        axios.post(url_performOptimized, { times: 42 }).then((res) => {
          console.log(res.data);
        });
      }
    } finally {
      console.log("done");
    }
  };
  return (
    <>
      <div className="w-full h-[100dvh] flex justify-center items-center">
        <div className="w-fit flex flex-col gap-2">
          <div>
            Run{" "}
            <span>
              <input type="number" className="shadow" />
            </span>{" "}
            times
          </div>
          <button
            className="bg-amber-300 p-4 text-white rounded"
            onClick={Optimized}
          >
            Run Optimize
          </button>
          <button
            className="bg-red-500 p-4 text-white rounded"
            onClick={unOptimized}
          >
            Run Unoptimized
          </button>
        </div>
      </div>
    </>
  );
}
