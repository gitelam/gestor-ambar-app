"use client";
import React from "react";
import { useEffect } from "react";
import DynamicTable from "./components/DynamicTable";
import { Icon } from "@iconify/react";
import CreateUser from "./components/CreateUser";
import { useMainAppContext } from "../MainAppContext";
export default function Users() {
  const { state, setState } = useMainAppContext();
  const headers = [
    "Nombre",
    "Correo",
    "Número_de_control",
    "Rol",
    "Lugar",
    "Fecha_de_Ingreso",
  ];
  const dataHeaders = [
    "fullName",
    "email",
    "control_number",
    "role",
    "location",
    "createdAt",
  ];
  //  const actions = ["editar", "detalles", "eliminar"]; // Acciones que deseas mostrar.
  useEffect(() => {
    // localStorage.setItem("activeModuleName", "Usuarios");
    setState((prev) => ({
      ...prev,
      isLoadingModule: true,
    }));

    //get locations and set in mainappcontext
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/location/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        setState((prev) => ({
          ...prev,
          locations: data.locations,
        }));
      } catch (err) {
        console.error("Error fetching locations:", err.message);
      }
    };

    fetchLocations();
    //fetch users
    fetch("/api/users/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setState((prev) => ({
          ...prev,
          usersData: data.users,
          isLoadingModule: false,
        }));
      });

    //fetch users inactive
    fetch("/api/users/get-inactive", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setState((prev) => ({
          ...prev,
          inactiveUsersData: data.users,
          isLoadingModule: false,
        }));
      });
    //
  }, []);
  const activeUsersActions = [
    {
      action: "details",
      actionTitle: "Detalles de Usuarios",
      color: "bg-green-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "mingcute:user-search-fill",
      description: "Detalles",
    },
    {
      action: "edit",
      color: "bg-blue-900",
      actionTitle: "Editar Usuarios",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-blue-700",
      icon: "fa6-solid:user-pen",
      description: "Editar",
    },
    {
      action: "delete",
      color: "bg-orange-600",
      actionTitle: "Desactivar Usuarios",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-orange-700",
      icon: "mdi:user-minus",
      description: "Desactivar",
    },
  ];
  //////
  const inactiveUsersActions = [
    {
      action: "details",
      actionTitle: "Detalles de Usuarios",
      color: "bg-green-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "mingcute:user-search-fill",
      description: "Detalles",
    },
    {
      action: "edit",
      color: "bg-blue-900",
      actionTitle: "Editar Usuarios",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-blue-700",
      icon: "fa6-solid:user-pen",
      description: "Editar",
    },
    {
      action: "activate",
      actionTitle: "Activar Usuarios",
      color: "bg-green-600",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "mdi:user-check",
      description: "Activar",
    },
  ];
  //console.log(state.usersData);
  return (
    //rename the received data
    <div className="flex flex-col gap-3">
      <CreateUser />
      <div>
        <DynamicTable
          tableName="Usuarios"
          tableIcon="mdi--users-outline"
          headers={headers}
          dataHeaders={dataHeaders}
          data={state.usersData}
          actions={activeUsersActions}
        />
      </div>
      <div>
        <DynamicTable
          tableName="Usuarios desactivados"
          tableIcon="mdi--users-minus-outline"
          headers={headers}
          dataHeaders={dataHeaders}
          data={state.inactiveUsersData}
          actions={inactiveUsersActions}
        />
      </div>
    </div>
  );
}
