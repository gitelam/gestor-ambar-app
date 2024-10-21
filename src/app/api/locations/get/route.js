import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const GET = withAuth(async (req) => {
  //return all locations in system
  let locations = await prisma.location.findMany();
  //reformat createdAt date
  locations = locations.map((location) => {
    return {
      ...location,
      createdAt: new Date(location.createdAt).toString().split("GMT")[0],
    };
  });
  //reorder from newest to oldest
  locations = locations.reverse();
  return new NextResponse(JSON.stringify({ locations }));
});