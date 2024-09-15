import React from "react";
import Image from "next/image";
import SidebarUser from "./SidebarUser";
import SidebarMenuItem from "./SidebarMenuItem";

export default function Sidebar() {
  return (
    <nav className="w-full md:w-2/5 lg:w-1/5 border-gray-200  border-r flex flex-col shadow-md ">
      <div className="w-full border-b">
        <div className="p-2">
          <div className="shadow-md border rounded-sm">
            <div className=" bg-gray-100/90 flex flex-col w-full justify-center items-center  rounded-sm overflow-hidden ">
              <div className="  flex justify-center ">
                <Image
                  src="img/logo.svg"
                  alt="TecTijuana"
                  width={150}
                  height={150}
                  className="p-2"
                />
              </div>
              <div className=" w-full flex  text-sm p-1 justify-center items-center bg-blue-900 text-gray-50/90 font-light">
                <div className="flex space-x-1 items-baseline">
                  <div className="font-semibold text-sm text-nowrap">
                    Control e Inventario
                  </div>{" "}
                  <div>-</div> <strong>TecNM</strong>
                </div>
                {/* <p className="text-sm flex w-full justify-center text-center">
                Control e Inventario de Materiales y Suplementos
              </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full p-3">
          <p>Usuario</p>
        </div>
      </div>
      <SidebarUser />

      <div className="w-full">
        <div className="w-full p-3">
          <p>Menú</p>
        </div>
      </div>

      <SidebarMenuItem />
    </nav>
  );
}
