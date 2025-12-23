import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  carService,
  CreateCarData,
  FilterOption,
} from "../services/carService";

export type SortOption = {
  sortBy: "name" | "createdAt";
  sortOrder: "ASC" | "DESC";
};

// Get all cars with optional sorting, filtering, and search
export const useCars = (
  sortOption?: SortOption,
  filterOption?: FilterOption,
  searchQuery?: string
) => {
  return useQuery({
    queryKey: ["cars", sortOption, filterOption, searchQuery],
    queryFn: () => carService.getAllCars(sortOption, filterOption, searchQuery),
  });
};

// Get single car by ID
export const useCar = (id: string) => {
  return useQuery({
    queryKey: ["cars", id],
    queryFn: () => carService.getCarById(id),
    enabled: !!id,
  });
};

// Get car types
export const useCarTypes = () => {
  return useQuery({
    queryKey: ["carTypes"],
    queryFn: carService.getCarTypes,
  });
};

// Get tags
export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: carService.getTags,
  });
};

// Create car
export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCarData) => carService.createCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};

// Delete car
export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => carService.deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};
