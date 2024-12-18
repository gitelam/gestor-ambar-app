"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { useMainAppContext } from "../../MainAppContext";

import { getLocations } from "./CreateLocation";

export default function CreateUbication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state, setState } = useMainAppContext();
  const { toast } = useToast();
  const formSchema = z.object({
    name: z.string().min(2, { message: "Obligatorio" }).max(50),
    location: z.string().min(1, { message: "Obligatorio" }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  useEffect(() => {
    // const asyncFetch = async () => {
    //   await getUbications(state, setState);
    // };
    // asyncFetch();
  }, []);

  async function onSubmit(values) {
    //console.log(values);
    setIsSubmitting(true);
    try {
      setState((prev) => ({
        ...prev,
        showDialogAlert: false,
      }));

      const response = await fetch("/api/ubication/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        setState((prevState) => ({
          ...prevState,
          showDialogAlert: true,
          dialogMessage: error.error || "Error desconocido",
        }));
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      //console.log("Ubication registered successfully:", data);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        duration: 800,
        title: "Ubicación creada...",
      });

      await getUbications(state, setState);

      form.reset({
        num: "",
        fullName: "",
      });

      setIsSubmitting(false);
    } catch (err) {
      console.error("Error en la petición:", err.message);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al crear ubicación...",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full p-2 border rounded-xl">
      <Accordion
        className="w-full !border-0 !border-b-0 "
        type="single"
        collapsible
      >
        <AccordionItem className="!border-0 !border-b-0" value="item-1">
          <AccordionTrigger className="!bg-white hover:!bg-blue-50 hover:border-blue-500 !rounded-xl !border !p-2 !text-gray-600">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#334C94"
                  d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"
                />
              </svg>{" "}
              <h1 className="text-sm font-bold">Crear ubicación</h1>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2 items-end flex-col"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Nombre de la ubicación...</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Mi ubicación..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ejemplos: Almacen 1, Bodega 2, etc.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Lugar</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value); // Actualiza el valor en el estado del formulario
                          }}
                          value={field.value || ""} // Asegúrate de que el valor sea un string vacío si no hay valor
                        >
                          <SelectTrigger className="w-full !bg-white !rounded-md !text-gray-600">
                            <SelectValue placeholder="Seleccione plantel" />
                          </SelectTrigger>
                          <SelectContent className="!m-0 !p-0 !w-auto">
                            <SelectGroup>
                              <SelectLabel>Unidad</SelectLabel>
                              {/* <SelectItem value="Unidad Tomas Aquino">
                                Unidad Tomas Aquino
                              </SelectItem>
                              <SelectItem value="Unidad Otay">
                                Unidad Otay
                              </SelectItem> */}
                              {state.locations.map((location) => (
                                <SelectItem
                                  key={location.id}
                                  value={location.id}
                                >
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button disabled={isSubmitting} type="submit">
                  Crear
                </Button>
              </form>
            </Form>
            <div className="w-full py-2">
              <div className="font-semibold">Ubicaciones existentes</div>
              <div
                className={`w-full ${
                  state.ubication.length < 2 ? "h-auto" : "h-40"
                }  overflow-auto  border-gray-200 py-2  gap-1 justify-between items-center`}
              >
                <UnitList state={state} setState={setState} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export async function getUbications(state, setState) {
  try {
    const response = await fetch("/api/ubication/get", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      setState((prevState) => ({
        ...prevState,
        showDialogAlert: true,
        dialogMessage: error.error || "Error desconocido",
      }));
      return;
    }
    const data = await response.json();
    //console.log("Ubications fetched successfully:", data);
    setState((prevState) => ({
      ...prevState,
      ubication: data.ubication,
    }));

    await getLocations(state, setState);
  } catch (error) {
    console.error("Request error:", error);
  }
}

export async function deleteUbication(values, state, setState) {
  //console.log("Deleting ubication:", values);
  try {
    const response = await fetch("/api/ubication/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error deleting ubication:", error.error);
      return;
    }

    const data = await response.json();
    //console.log("Ubication deleted successfully:", data);
    await getUbications(state, setState);
    return data;
  } catch (error) {
    console.error("Request error:", error);
  }
}

async function updateUnit(values, state, setState) {
  //console.log("Updating ubication:", values);
  try {
    const response = await fetch("/api/ubication/put", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error updating ubication:", error.error);
      return;
    }

    const data = await response.json();
    //console.log("Ubication updated successfully:", data);

    await getUbications(state, setState);

    return data;
  } catch (error) {
    console.error("Request error:", error);
  }
}

export function UnitList({ state, setState }) {
  const { toast } = useToast();
  const [editUbicationId, setEditUbicationId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEditChange = (field, value) => {
    const name = document.getElementById("ubicationName").value;

    setEditedValues({
      name,
    });
  };

  const handleSave = async (UbicationId) => {
    const updatedData = {
      id: UbicationId,
      ...editedValues,
    };

    try {
      await updateUnit(updatedData, state, setState);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        duration: 800,
        title: "Ubicación actualizada...",
      });
    } catch (error) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al eliminar ubicación...",
      });
    }
    setEditUbicationId(null);
  };

  const handleDelete = async (UbicationId) => {
    const deletedData = {
      id: UbicationId,
    };

    try {
      await deleteUbication(deletedData, state, setState);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "warning",
        duration: 800,
        title: "Ubicación eliminada...",
      });
    } catch (error) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al eliminar ubicación...",
      });
    }
  };

  return (
    <>
      {state.ubication.length === 0 && (
        <div>No hay ubicaciones registradas</div>
      )}
      {state.ubication.map((ubication) => {
        const isEditing = editUbicationId === ubication.id;
        return (
          <div
            key={ubication.id}
            className="flex flex-row max-md:flex-col w-full gap-2 items-center bg-white border-b p-2"
          >
            {isEditing ? (
              <input
                id="ubicationName"
                defaultValue={ubication.name}
                className="w-full"
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            ) : (
              <div className="w-full">{ubication.name}</div>
            )}

            <div className="w-full">{ubication.location.name}</div>

            <div className="flex justify-between max-md:w-full">
              <div
                className="text-blue-900 cursor-pointer underline"
                onClick={() =>
                  setEditUbicationId(isEditing ? null : ubication.id)
                }
              >
                {isEditing ? (
                  <div className="flex gap-2 max-md:gap-6">
                    <svg
                      onClick={() => handleSave(ubication.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="#737373"
                        d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"
                      />
                    </svg>
                    <svg
                      onClick={() => setEditUbicationId(null)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="#737373"
                        d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
                      />
                    </svg>
                  </div>
                ) : (
                  <svg
                    className="hover:bg-gray-200 rounded-full p-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="none" />
                    <path
                      fill="#737373"
                      d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
                    />
                  </svg>
                )}
              </div>
              {ubication.items.length === 0 && (
                <svg
                  onClick={() => {
                    handleDelete(ubication.id);
                  }}
                  className="hover:bg-gray-200 rounded-full p-1 cursor-pointer flex items-center"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="#fa0a0a"
                    d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                  />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
