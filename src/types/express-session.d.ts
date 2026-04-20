import "express-session";

export interface CartItem {
  productId: string; // Storing as string to handle BigInt serialization
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

declare module "express-session" {
  interface SessionData {
    messages?: string[];
    cart?: CartItem[];
  }
}
