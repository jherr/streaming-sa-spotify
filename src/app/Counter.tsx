"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="m-2 p-2 border-2 border-gray-500 rounded">
      <h1 className="font-bold text-xl">Counter</h1>
      <p className="my-2 text-md">You clicked {count} times</p>
      <button
        className="bg-blue-500 text-white rounded-full px-4 py-1"
        onClick={() => setCount(count + 1)}
      >
        Click me
      </button>
    </div>
  );
}
