export interface Order {
  _id: string;
  totalCost: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  paymentMethod: string;
  createdAt: string;
}
