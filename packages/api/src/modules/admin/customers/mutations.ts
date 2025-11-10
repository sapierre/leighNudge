import { eq } from "@turbostarter/db";
import { customer } from "@turbostarter/db/schema";
import { db } from "@turbostarter/db/server";

import type { UpdateCustomer } from "@turbostarter/db/schema";

export const deleteCustomer = async ({ id }: { id: string }) =>
  db.delete(customer).where(eq(customer.id, id));

export const updateCustomer = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateCustomer;
}) => db.update(customer).set(data).where(eq(customer.id, id));
