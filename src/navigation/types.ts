import { Car } from "../types/Car";

export type RootStackParamList = {
  MainTabs: undefined;
  CarDetail: { car: Car };
  AddCar: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  CarLibrary: undefined;
  Service: undefined;
  Profile: undefined;
};
