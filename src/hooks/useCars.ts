import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carService, FilterOption } from "../services/carService";

export type SortOption = {
  sortBy: "name" | "createdAt";
  sortOrder: "ASC" | "DESC";
};

// Get all cars with optional sorting and filtering
export const useCars = (
  sortOption?: SortOption,
  filterOption?: FilterOption
) => {
  return useQuery({
    queryKey: ["cars", sortOption, filterOption],
    queryFn: () => carService.getAllCars(sortOption, filterOption),
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

// Delete car
export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: carService.deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};
