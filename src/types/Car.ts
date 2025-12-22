export type Car = {
  id: string;
  name: string;
  carType: "automatic" | "manual";
  imageUrl: string;
  description?: string;
};

export type CarDetail = {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  carType: "automatic" | "manual";
  tags: string[];
  createdAt: string;
};
