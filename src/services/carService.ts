import { apiClient } from "../config/api";
import { Car, CarDetail } from "../types/Car";

export type SortOption = {
  sortBy: "name" | "createdAt";
  sortOrder: "ASC" | "DESC";
};

export type FilterOption = {
  carType?: string;
  tags?: string[];
};

export const carService = {
  // Get all cars with optional sorting and filtering
  getAllCars: async (
    sortOption?: SortOption,
    filterOption?: FilterOption
  ): Promise<Car[]> => {
    const params: Record<string, string> = {};

    if (sortOption) {
      params.sortBy = sortOption.sortBy;
      params.sortOrder = sortOption.sortOrder;
    }

    if (filterOption?.carType) {
      params.carType = filterOption.carType;
    }

    if (filterOption?.tags && filterOption.tags.length > 0) {
      params.tags = filterOption.tags.join(",");
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

  // Get available car types
  getCarTypes: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/api/cars/types");
    return response.data;
  },

  // Get available tags
  getTags: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/api/cars/tags");
    return response.data;
  },
};
