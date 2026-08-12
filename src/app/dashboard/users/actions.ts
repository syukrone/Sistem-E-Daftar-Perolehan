"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

function mapUserForClient(user: any) {
  return {
    ...user,
    id: user.id.toString(),
  };
}

export async function getUsers() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const users = await db.user.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      isActive: true,
    }
  });

  return users.map(mapUserForClient);
}

export async function createUser(data: any) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const existingUser = await db.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    if (!existingUser.isActive) {
      throw new Error("Email exists but is inactive. Update the existing user instead.");
    }
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    }
  });

  revalidatePath("/dashboard/users");
}

export async function updateUser(id: string, data: any) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  await db.user.update({
    where: { id: BigInt(id) },
    data: updateData,
  });

  revalidatePath("/dashboard/users");
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // Soft delete by setting isActive to false
  await db.user.update({
    where: { id: BigInt(id) },
    data: { isActive: false },
  });

  revalidatePath("/dashboard/users");
}
