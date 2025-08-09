import {
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Seller,
  type InsertSeller,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItemWithProduct,
  type ProductWithDetails,
  type OrderWithItems,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Sellers
  getSellers(): Promise<Seller[]>;
  getSeller(id: string): Promise<Seller | undefined>;
  createSeller(seller: InsertSeller): Promise<Seller>;

  // Products
  getProducts(categoryId?: string, searchQuery?: string): Promise<ProductWithDetails[]>;
  getProduct(id: string): Promise<ProductWithDetails | undefined>;
  getFeaturedProducts(): Promise<ProductWithDetails[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Orders
  getOrders(userId: string): Promise<OrderWithItems[]>;
  getOrder(id: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private sellers: Map<string, Seller>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.sellers = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();

    this.seedData();
  }

  private seedData() {
    // Categories
    const categories = [
      { id: "electronics", name: "Electronics", slug: "electronics", description: "Phones, Laptops & More", imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { id: "fashion", name: "Fashion", slug: "fashion", description: "Traditional & Modern Wear", imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { id: "home-garden", name: "Home & Garden", slug: "home-garden", description: "Furniture & Décor", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { id: "local-crafts", name: "Local Crafts", slug: "local-crafts", description: "Traditional Handicrafts", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { id: "health-beauty", name: "Health & Beauty", slug: "health-beauty", description: "Personal Care Products", imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { id: "sports", name: "Sports", slug: "sports", description: "Sports & Fitness Equipment", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { id: "books", name: "Books", slug: "books", description: "Educational & Literature", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
    ];
    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Sellers
    const sellers = [
      { id: "tech-solutions", name: "Tech Solutions Sudan", description: "Electronics & Mobile Devices", imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", rating: "4.9", totalReviews: 234, isVerified: true, userId: null },
      { id: "heritage-crafts", name: "Sudanese Heritage Crafts", description: "Traditional Handcrafts", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", rating: "5.0", totalReviews: 89, isVerified: true, userId: null },
      { id: "nile-fashion", name: "Nile Fashion House", description: "Fashion & Accessories", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", rating: "4.7", totalReviews: 156, isVerified: true, userId: null },
    ];
    sellers.forEach(seller => this.sellers.set(seller.id, seller));

    // Products
    const products = [
      {
        id: "samsung-a54",
        name: "Samsung Galaxy A54",
        description: "The Samsung Galaxy A54 features a 6.4-inch Super AMOLED display, 50MP triple camera system, and 5000mAh battery. Perfect for capturing memories and staying connected with family and friends.",
        price: "89000.00",
        originalPrice: "95000.00",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
        ],
        categoryId: "electronics",
        sellerId: "tech-solutions",
        stock: 25,
        rating: "4.5",
        totalReviews: 234,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "traditional-thobe",
        name: "Traditional Sudanese Thobe",
        description: "Authentic Sudanese thobe made from high-quality cotton fabric. Perfect for traditional occasions and daily wear. Available in various colors and sizes.",
        price: "15500.00",
        originalPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
        ],
        categoryId: "fashion",
        sellerId: "nile-fashion",
        stock: 50,
        rating: "5.0",
        totalReviews: 89,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "hp-pavilion-laptop",
        name: "HP Pavilion 15.6\" Laptop",
        description: "HP Pavilion laptop with Intel Core i5 processor, 8GB RAM, 256GB SSD. Perfect for students and professionals. Comes with Windows 11 and one year warranty.",
        price: "125000.00",
        originalPrice: "135000.00",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
        ],
        categoryId: "electronics",
        sellerId: "tech-solutions",
        stock: 15,
        rating: "4.0",
        totalReviews: 156,
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "clay-pottery-set",
        name: "Handcrafted Clay Pottery Set",
        description: "Beautiful handcrafted pottery set made by local artisans. Includes traditional designs and patterns. Perfect for home decoration or as gifts.",
        price: "8750.00",
        originalPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
        ],
        categoryId: "local-crafts",
        sellerId: "heritage-crafts",
        stock: 30,
        rating: "5.0",
        totalReviews: 67,
        isActive: true,
        createdAt: new Date(),
      },
    ];
    products.forEach(product => this.products.set(product.id, product));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName,
      phone: insertUser.phone || null,
      address: insertUser.address || null,
      city: insertUser.city || null,
      state: insertUser.state || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      id,
      name: insertCategory.name,
      slug: insertCategory.slug,
      description: insertCategory.description || null,
      imageUrl: insertCategory.imageUrl || null,
    };
    this.categories.set(id, category);
    return category;
  }

  // Sellers
  async getSellers(): Promise<Seller[]> {
    return Array.from(this.sellers.values());
  }

  async getSeller(id: string): Promise<Seller | undefined> {
    return this.sellers.get(id);
  }

  async createSeller(insertSeller: InsertSeller): Promise<Seller> {
    const id = randomUUID();
    const seller: Seller = {
      id,
      name: insertSeller.name,
      description: insertSeller.description || null,
      imageUrl: insertSeller.imageUrl || null,
      rating: insertSeller.rating || null,
      totalReviews: insertSeller.totalReviews || null,
      isVerified: insertSeller.isVerified || null,
      userId: insertSeller.userId || null,
    };
    this.sellers.set(id, seller);
    return seller;
  }

  // Products
  async getProducts(categoryId?: string, searchQuery?: string): Promise<ProductWithDetails[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);

    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return products.map(product => ({
      ...product,
      category: this.categories.get(product.categoryId!)!,
      seller: this.sellers.get(product.sellerId!)!,
    }));
  }

  async getProduct(id: string): Promise<ProductWithDetails | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    return {
      ...product,
      category: this.categories.get(product.categoryId!)!,
      seller: this.sellers.get(product.sellerId!)!,
    };
  }

  async getFeaturedProducts(): Promise<ProductWithDetails[]> {
    const products = Array.from(this.products.values())
      .filter(p => p.isActive)
      .slice(0, 8);

    return products.map(product => ({
      ...product,
      category: this.categories.get(product.categoryId!)!,
      seller: this.sellers.get(product.sellerId!)!,
    }));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      id,
      name: insertProduct.name,
      description: insertProduct.description,
      price: insertProduct.price,
      originalPrice: insertProduct.originalPrice || null,
      imageUrl: insertProduct.imageUrl,
      images: insertProduct.images || null,
      categoryId: insertProduct.categoryId || null,
      sellerId: insertProduct.sellerId || null,
      stock: insertProduct.stock || null,
      rating: insertProduct.rating || null,
      totalReviews: insertProduct.totalReviews || null,
      isActive: insertProduct.isActive || null,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  // Cart
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId);

    return items.map(item => ({
      ...item,
      product: {
        ...this.products.get(item.productId!)!,
        seller: this.sellers.get(this.products.get(item.productId!)!.sellerId!)!,
      },
    }));
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values())
      .find(item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId);

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertCartItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = {
      ...insertCartItem,
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    const items = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.userId === userId);
    items.forEach(([id]) => this.cartItems.delete(id));
  }

  // Orders
  async getOrders(userId: string): Promise<OrderWithItems[]> {
    const orders = Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());

    return orders.map(order => ({
      ...order,
      items: Array.from(this.orderItems.values())
        .filter(item => item.orderId === order.id)
        .map(item => ({
          ...item,
          product: this.products.get(item.productId!)!,
        })),
    }));
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    return {
      ...order,
      items: Array.from(this.orderItems.values())
        .filter(item => item.orderId === order.id)
        .map(item => ({
          ...item,
          product: this.products.get(item.productId!)!,
        })),
    };
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNumber = `ONZ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const order: Order = {
      ...insertOrder,
      id,
      orderNumber,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
}

export const storage = new MemStorage();
