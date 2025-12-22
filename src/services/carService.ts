import { apiClient } from "../config/api";
import { Car, CarDetail } from "../types/Car";

export type SortOption = {
  sortBy: "name" | "createdAt";
  sortOrder: "ASC" | "DESC";
};

export const carService = {
  // Get all cars with optional sorting
  getAllCars: async (sortOption?: SortOption): Promise<Car[]> => {
    const params: Record<string, string> = {};

    if (sortOption) {
      params.sortBy = sortOption.sortBy;
      params.sortOrder = sortOption.sortOrder;
    }

    const response = await apiClient.get<Car[]>("/api/cars", { params });
    return response.data;
  },

  // Get car by ID
  getCarById: async (id: string): Promise<CarDetail> => {
    const response = await apiClient.get<CarDetail>(`/api/cars/${id}`);
    return response.data;
  },

  // Delete car
  deleteCar: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/cars/${id}`);
  },

  // Create car (placeholder for future)
  // createCar: async (data: Partial<Car>): Promise<Car> => {
  //   const response = await apiClient.post<Car>('/api/cars', data);
  //   return response.data;
  // },

  // Update car (placeholder for future)
  // updateCar: async (id: string, data: Partial<Car>): Promise<Car> => {
  //   const response = await apiClient.put<Car>(`/api/cars/${id}`, data);
  //   return response.data;
  // },
};
