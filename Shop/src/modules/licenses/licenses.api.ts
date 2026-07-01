import { LICENSES } from "@/lib/constants";

export const licensesApi = {
  list() {
    return LICENSES;
  },
  listRenewals() {
    return LICENSES.filter((license) => license.status === "por-vencer");
  },
};
