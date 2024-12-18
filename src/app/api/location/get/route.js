import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";
import jwt from "jsonwebtoken";

export const GET = withAuth(async (req) => {
  let locations = await prisma.location.findMany({
    include: {
      Ubication: true,
      user: true,
    },
  });
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
