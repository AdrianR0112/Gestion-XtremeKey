import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { API_BASE_URL } from "@/lib/api";

export async function getCustomerSession() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${API_BASE_URL}/api/v1/customer-auth/session`, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function requireCustomerSession() {
  const session = await getCustomerSession();
  if (!session?.ok) {
    redirect("/login");
  }

  return session;
}
