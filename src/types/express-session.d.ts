import "express-session";

export interface CartItem {
  productId: string; // Storing as string to handle BigInt serialization
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  stock?: number;
}

declare module "express-session" {
  interface SessionData {
    messages?: string[];
    cart?: CartItem[];
    error_msg?: string;  // Thông báo lỗi tồn kho (dùng sau redirect)
  }
}
