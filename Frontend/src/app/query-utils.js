export function createQueryDataSetter(queryClient, queryKey, initialValue = []) {
  return (updater) => queryClient.setQueryData(queryKey, (current) => {
    const baseValue = current ?? initialValue;
    return typeof updater === "function" ? updater(baseValue) : updater;
  });
}

export function getErrorMessage(error, fallbackMessage) {
  return error?.data?.message || error?.message || fallbackMessage;
}

export function toArray(value) {
  return Array.isArray(value) ? value : [];
}
