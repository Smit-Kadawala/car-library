import { Car } from "../types/Car";

export type RootStackParamList = {
  MainTabs: undefined;
  CarDetail: { car: Car };
};

export type BottomTabParamList = {
  Home: undefined;
  CarLibrary: undefined;
  Service: undefined;
  Profile: undefined;
};
