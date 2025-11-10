import { handle } from "@turbostarter/api/utils";

import { api } from "~/lib/api";

const KEY = "billing";

const queries = {
  customer: {
    get: {
      queryKey: [KEY, "customer"],
      queryFn: () => handle(api.billing.customer.$get)(),
    },
  },
};

export const billing = {
  queries,
};
