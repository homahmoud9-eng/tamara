import prisma from "@/lib/prisma";

export async function resolveCustomer(userId: string, name?: string | null, email?: string | null) {
  let customer = await prisma.customer.findUnique({
    where: { userId }
  });

  if (!customer) {
    // If not found by userId, check by email (legacy accounts)
    if (email) {
      customer = await prisma.customer.findUnique({
        where: { email }
      });
      if (customer) {
        // Link it to this user
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: { userId }
        });
        return customer;
      }
    }

    // Create a new customer
    customer = await prisma.customer.create({
      data: {
        name: name || "User",
        email: email || null,
        phone: `USER_${userId.substring(0, 8)}_${Date.now()}`, // Temporary unique phone
        userId: userId
      }
    });
  }

  return customer;
}
