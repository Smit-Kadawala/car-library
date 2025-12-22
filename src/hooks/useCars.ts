import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carService } from "../services/carService";

export type SortOption = {
  sortBy: "name" | "createdAt";
  sortOrder: "ASC" | "DESC";
};

// Get all cars with optional sorting
export const useCars = (sortOption?: SortOption) => {
  return useQuery({
    queryKey: ["cars", sortOption],
    queryFn: () => carService.getAllCars(sortOption),
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

// Delete car
export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: carService.deleteCar,
    onSuccess: () => {
      // Refresh the cars list after delete
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};
