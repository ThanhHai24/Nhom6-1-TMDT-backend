/**
 * Thrown when a product does not have enough stock to fulfill an order item.
 */
export class InsufficientStockError extends Error {
    public readonly productId: string;
    public readonly productName: string;
    public readonly requested: number;
    public readonly available: number;

    constructor(productId: string, productName: string, requested: number, available: number) {
        super(
            `Sản phẩm "${productName}" không đủ hàng. ` +
            `Yêu cầu: ${requested}, còn lại: ${available}.`
        );
        this.name = "InsufficientStockError";
        this.productId = productId;
        this.productName = productName;
        this.requested = requested;
        this.available = available;

        // Maintain proper stack trace in V8
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InsufficientStockError);
        }
    }
}
