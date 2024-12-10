"use client";
import React, { useEffect } from "react";
import CreateItem from "./components/CreateItem";
import { useMainAppContext } from "../../components/MainAppContext";
import { getResponsibles } from "./components/CreateResponsible";
import DynamicTable from "./components/DynamicTable";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function Loans() {
  const { state, setState } = useMainAppContext();

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoadingModule: true,
    }));
    try {
      const fetchAll = async () => {
        await getResponsibles(state, setState);
        await fetch("/api/item/get", {
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
              items: data.items,
              isLoadingModule: false,
            }));
          });
      };
      fetchAll();
    } catch (e) {
      console.error(e.message);
    }
  }, []);

  const inventoryItemsActions = [
    {
      action: "asignloan",
      actionTitle: "Asignar suministros",
      color: "bg-green-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "ri:user-received-fill",
      description: "Asignar suministro",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Accordion
        className="w-full !border-0 !border-b-0 "
        collapsible
        type="single"
      >
        <div className="w-full p-2 border rounded-xl">
          <AccordionItem className="!border-0 !border-b-0" value="item-1">
            <AccordionTrigger className="!bg-white hover:!bg-blue-50 hover:border-blue-500 !rounded-xl !border !p-2 !text-gray-600">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 20 20"
                >
                  <rect width="20" height="20" fill="none" />
                  <path
                    fill="#1e3a8a"
                    d="M6 4.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m11 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m-11 11a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m11 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M7 4.75A.75.75 0 0 1 7.75 4h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 7 4.75m0 10.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75m-3-7.5a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0zm10.5 0a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0z"
                  />
                </svg>

                <h1 className="text-sm font-bold">Seleccionar suministros</h1>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <DynamicTable
                tableName="Asignar suministros"
                tableIcon="material-symbols-light--category-search-outline-rounded"
                headers={[
                  "Partida",
                  "Nombre",
                  "Descripción",
                  "Cantidad",
                  "Unidad",
                  "Entradas",
                  "Salidas",
                  "Ubicación",
                ]}
                dataHeaders={[
                  "partidaNumber",
                  "name",
                  "description",
                  "quantity",
                  "unit",
                  "entryes",
                  "outs",
                  "ubication",
                ]}
                data={state.items}
                showThisHeaderInHover="category"
                colHoverNumber={0}
                actions={inventoryItemsActions}
              />
            </AccordionContent>
          </AccordionItem>
        </div>

        <AccordionItem value="active-loans">
          <AccordionTrigger className="text-lg font-bold">
            Préstamos activos
          </AccordionTrigger>
          <AccordionContent>
            <DynamicTable
              tableName="Prestamos activos"
              tableIcon="material-symbols-light--category-search-outline-rounded"
              headers={[
                "Partida",
                "Nombre",
                "Descripción",
                "Cantidad",
                "Unidad",
                "Entradas",
                "Salidas",
                "Ubicación",
              ]}
              dataHeaders={[
                "partidaNumber",
                "name",
                "description",
                "quantity",
                "unit",
                "entryes",
                "outs",
                "ubication",
              ]}
              data={state.loans}
              showThisHeaderInHover="category"
              colHoverNumber={0}
              actions={inventoryItemsActions}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
