"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { useMainAppContext } from "./MainAppContext";

export default function DropdownButton() {
  const { state, setState } = useMainAppContext();
  return (
    <div
      onClick={() => {
        setState((prev) => ({ ...prev, showSideBar: !prev.showSideBar }));
      }}
      className="p-2 flex flex-row-reverse gap-1 items-center justify-center rounded-md border bg-gray-50 shadow-xl absolute m-5 hover:bg-gray-100 cursor-pointer bottom-0"
    >
      <div className="font-semibold text-blue-900 text-md flex justify-center">
        {!state.showSideBar ? "Menu" : "Cerrar"}
      </div>
      {/* <Icon
        icon={`material-symbols:${!state.showSideBar ? "menu" : "close"}`}
        width="24"
        height="24"
        style={{ color: "#1e3a8a" }}
      /> */}
      <Icon
        icon={`fe:${!state.showSideBar ? "arrow-left" : "arrow-right"}`}
        width="16"
        height="16"
        style={{ color: "#1e3a8a" }}
      />
    </div>
  );
}
