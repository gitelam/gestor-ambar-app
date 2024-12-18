"use client";
import React from "react";
import { Icon } from "@iconify/react";

export default function SidebarUser({ user }) {
  const { name, role } = user;
  return (
    <div className="w-full flex justify-between bg-gray-50  hover:bg-gray-100 cursor-pointer active:bg-gray-200/80 p-1">
      <div className="flex items-center justify-start gap-2 w-4/5">
        <div>
          <Icon
            icon="lets-icons:user-cicrle-duotone"
            width="38"
            height="38"
            style={{ color: "#1e3a8a" }}
          />
        </div>
        <div className="text-md">
          <p>{name}</p>
          <p className="text-xs">{role}</p>
        </div>
      </div>
      <div className=" flex items-center justify-center w-1/5">
        <Icon
          icon="fluent:ios-arrow-right-24-regular"
          width="24"
          height="24"
          style={{ color: "#1e3a8a" }}
        />
      </div>
    </div>
  );
}
