export enum TransactionType {
  In = 'in',
  Out = 'out',
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  category?: Category;
  sku: string;
  name: string;
  stock: number;
  min_stock: number;
  buy_price: string | number;
  sell_price: string | number;
  is_low_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  role_label?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: number;
  product_id: number;
  user_id: number;
  type: TransactionType;
  type_label: string;
  type_color: string;
  quantity: number;
  reference_no: string;
  price_at_transaction: string | number;
  notes?: string;
  product?: Product;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name: string;
}

export interface CreateProductPayload {
  category_id: number;
  name: string;
  min_stock: number;
  buy_price: string | number;
  sell_price: string | number;
}

export interface UpdateProductPayload {
  category_id: number;
  name: string;
  stock?: number;
  min_stock: number;
  buy_price: string | number;
  sell_price: string | number;
}

export interface CreateInboundTransactionPayload {
  product_id: number;
  quantity: number;
  notes?: string;
}

export interface CreateOutboundTransactionPayload {
  product_id: number;
  quantity: number;
  notes?: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T | T[];
  error?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
export interface StockReportItem {
  id: number;
  sku: string;
  name: string;
  stock: number;
  min_stock: number;
  is_low_stock: boolean;
  buy_price: number;
  stock_value: number;
  category: {
    id: number;
    name: string;
  };
  created_at: string;
}

export interface StockReportSummary {
  total_products: number;
  low_stock_count: number;
  total_stock_value: number;
}

export interface TransactionReportItem {
  id: number;
  type: string;
  type_label: string;
  product: {
    id: number;
    sku: string;
    name: string;
    category: string;
  };
  quantity: number;
  price_at_transaction: number;
  total_value: number;
  reference_no: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  notes?: string;
  created_at: string;
}

export interface TransactionReportPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface TransactionReportSummary {
  inbound_total: number;
  outbound_total: number;
}

export interface StockSnapshotItem {
  id: number;
  period: string;
  closing_stock: number;
  product?: {
    id: number;
    sku: string;
    name: string;
    buy_price: number;
  };
  category?: {
    id: number;
    name: string;
  };
  snapshot_value: number;
  created_at: string;
  updated_at: string;
}

export interface StockSnapshotSummary {
  period: string;
  total_products: number;
  total_value: number;
  average_stock: number;
}