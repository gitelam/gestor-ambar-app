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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { useMainAppContext } from "../../MainAppContext";

export default function CreateResponsible() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state, setState } = useMainAppContext();
  const { toast } = useToast();
  const formSchema = z.object({
    name: z.string().min(2, { message: "Obligatorio" }).max(50),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {}, []);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      setState((prev) => ({
        ...prev,
        showDialogAlert: false,
      }));

      const response = await fetch("/api/responsible/post", {
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
      //console.log("Type registered successfully:", data);

      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        duration: 800,
        title: "Responsable creado...",
      });

      const responsibleResponse = await fetch("/api/responsible/get", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!responsibleResponse.ok) {
        const error = await responsibleResponse.json();
        setState((prevState) => ({
          ...prevState,
          showDialogAlert: true,
          dialogMessage: error.error || "Error desconocido",
        }));
        setIsSubmitting(false);
        return;
      }

      const fetchResponsibles = await responsibleResponse.json();

      setState((prevState) => ({
        ...prevState,
        responsibles: fetchResponsibles.responsibles,
      }));

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
        title: "Error al crear responsable...",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full p-2 border rounded-xl">
      <Accordion
        className="w-full !border-0 !border-b-0 "
        responsible="single"
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
                className="text-blue-900 fill-current"
              >
                <path d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" />
              </svg>
              <h1 className="text-sm font-bold">Crear responsable</h1>
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
                      <FormLabel>Nombre del responsable</FormLabel>
                      <FormControl>
                        <Input
                          responsible="text"
                          placeholder="Nombre completo"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ejemplos: Juan Hernandez, Maria Perez, etc.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Button disabled={isSubmitting} responsible="submit">
                  Crear
                </Button>
              </form>
            </Form>
            <div className="w-full py-2">
              <div className="font-semibold">Responsables existentes</div>
              <div
                className={`w-full ${
                  state.responsibles.length < 2 ? "h-auto" : "h-40"
                }  overflow-auto  border-gray-200 py-2 gap-1 justify-between items-center`}
              >
                <TypeList state={state} setState={setState} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export async function getResponsibles(state, setState) {
  try {
    const response = await fetch("/api/responsible/get", {
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
    ////console.log("UnitS fetched successfully:", data);
    setState((prevState) => ({
      ...prevState,
      responsibles: data.responsibles,
    }));
  } catch (error) {
    console.error("Request error:", error);
  }
}

export async function deleteType(values, state, setState) {
  //console.log("Deleting responsible:", values);
  try {
    const response = await fetch("/api/responsible/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error deleting responsible:", error.error);
      return;
    }

    const data = await response.json();
    //console.log("Type deleted successfully:", data);

    await getResponsibles(state, setState);

    return data;
  } catch (error) {
    console.error("Request error:", error);
  }
}

async function updateType(values, state, setState) {
  //console.log("Updating responsible:", values);
  try {
    const response = await fetch("/api/responsible/put", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error updating responsible:", error.error);
      return;
    }

    const data = await response.json();
    //console.log("Type updated successfully:", data);

    await getResponsibles(state, setState);

    return data;
  } catch (error) {
    console.error("Request error:", error);
  }
}

export function TypeList({ state, setState }) {
  const { toast } = useToast();
  const [editTypeId, setEditTypeId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEditChange = (field, value) => {
    const name = document.getElementById("TypeName").value;

    setEditedValues({
      name,
    });
  };

  const handleSave = async (UnitId) => {
    const updatedData = {
      id: UnitId,
      ...editedValues,
    };

    try {
      await updateType(updatedData, state, setState);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        duration: 800,
        title: "Responsable actualizada...",
      });
    } catch (error) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al eliminar responsable...",
      });
    }
    setEditTypeId(null);
  };

  const handleDelete = async (UnitId) => {
    const deletedData = {
      id: UnitId,
    };
    try {
      await deleteType(deletedData, state, setState);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "warning",
        duration: 800,
        title: "Responsable eliminado...",
      });
    } catch (error) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al eliminar responsable...",
      });
    }
  };

  return (
    <>
      {state.responsibles.length === 0 && (
        <div>No hay responsables registrados</div>
      )}
      {state.responsibles.map((responsible) => {
        const isEditing = editTypeId === responsible.id;
        return (
          <div
            key={responsible.id}
            className="flex flex-row max-md:flex-col w-full gap-2 items-center bg-white border-b p-2"
          >
            {isEditing ? (
              <input
                id="TypeName"
                defaultValue={responsible.fullName}
                className="w-full"
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            ) : (
              <div className="w-full">{responsible.fullName}</div>
            )}

            <div className="flex justify-between max-md:w-full">
              <div
                className="text-blue-900 cursor-pointer underline"
                onClick={() => setEditTypeId(isEditing ? null : responsible.id)}
              >
                {isEditing ? (
                  <div className="flex gap-2 max-md:gap-6">
                    <svg
                      onClick={() => handleSave(responsible.id)}
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
                      onClick={() => setEditTypeId(null)}
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
              {responsible.Loans.length === 0 && (
                <svg
                  onClick={() => {
                    handleDelete(responsible.id);
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
