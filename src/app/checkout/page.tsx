import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import prisma from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/checkout");
  }

  let savedAddresses: any[] = [];
  let userPhone = "";
  let userName = "";

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { customer: { include: { addresses: true } } }
  });

  if (user?.customer) {
    savedAddresses = user.customer.addresses || [];
    userPhone = user.customer.phone || "";
    userName = user.customer.name || user.name || "";
  }

  return (
    <CheckoutClient 
      savedAddresses={savedAddresses}
      initialPhone={userPhone}
      initialName={userName}
      isAuthenticated={true}
    />
  );
}
