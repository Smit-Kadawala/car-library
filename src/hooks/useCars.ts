import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carService } from "../services/carService";
import type { Car, CarDetail } from "../types/Car";

// Get all cars
export const useCars = () =>
  useQuery<Car[], Error>({
    queryKey: ["cars"],
    queryFn: carService.getAllCars,
  });

// Get single car by ID
export const useCar = (id: string) =>
  useQuery<CarDetail, Error>({
    queryKey: ["cars", id],
    queryFn: () => carService.getCarById(id),
    enabled: !!id, // Only run if id exists
  });

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
