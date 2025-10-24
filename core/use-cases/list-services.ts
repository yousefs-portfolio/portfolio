import type { Service } from '../domain/service';
import type { ServiceContentReader } from '../interfaces/content';

export const listServices = async (
  deps: { serviceContentReader: ServiceContentReader },
): Promise<Service[]> => {
  const services = await deps.serviceContentReader.listServices();
  return [...services].sort((a, b) => a.order - b.order);
};
