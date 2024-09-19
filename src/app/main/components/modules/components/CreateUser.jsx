import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { set, useForm } from "react-hook-form";

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
export default function CreateUser() {
  const formSchema = z.object({
    email: z
      .string()
      .email({ message: "Formato inválido" })
      .min(2, { message: "Obligatorio" })
      .max(50),
    name: z.string().min(2, { message: "Obligatorio" }).max(50),
    control_number: z.string().min(6, { message: "Obligatorio" }).max(50),
    location: z.string().min(2, { message: "Obligatorio" }).max(50),
    //make with zod required
    rol: z.string().min(2, { message: "Obligatorio" }).max(50),
  });
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      control_number: "",
      location: "",
      rol: "",
    },
  });
  async function onSubmit(values) {
    //clear form
    form.reset();

    const password = Math.random().toString(36).slice(-8);

    values.password = password;

    console.log(values);
  }
  return (
    <div className="w-full p-2 border rounded-xl">
      <Accordion
        className="w-full !border-0 !border-b-0"
        type="single"
        collapsible
      >
        <AccordionItem className="!border-0 !border-b-0" value="item-1">
          <AccordionTrigger className="!bg-white !rounded-xl !border !p-2 !text-gray-600">
            <div className="flex items-center gap-1">
              <Icon
                icon="iconoir:add-user"
                width="24"
                height="24"
                style={{ color: "#1e3a8a" }}
              />
              <h1 className="text-sm font-bold">Crear usuario</h1>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2 items-end max-xl:flex-col"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Ana Gutierrez"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Correo institucional</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="@tectijuana.edu.mx"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="control_number"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Número de control</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="20212903" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="!bg-white !rounded-md !text-gray-600">
                            <SelectValue placeholder="Seleccione Rol" />
                          </SelectTrigger>
                          <SelectContent className="!m-0 !p-0 !w-auto">
                            <SelectGroup>
                              <SelectLabel>Rol</SelectLabel>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Viewer">Viewer</SelectItem>
                              <SelectItem value="Mod">Mod</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Unidad</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full !bg-white !rounded-md !text-gray-600">
                            <SelectValue placeholder="Seleccione plantel" />
                          </SelectTrigger>
                          <SelectContent className="!m-0 !p-0 !w-auto">
                            <SelectGroup>
                              <SelectLabel>Unidad</SelectLabel>
                              <SelectItem value="Unidad Tomas Aquino">
                                Unidad Tomas Aquino
                              </SelectItem>
                              <SelectItem value="Unidad Otay">
                                Unidad Otay
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button className="" type="submit">
                  Crear
                </Button>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}