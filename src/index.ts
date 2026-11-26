
interface Product {
  id: number;
  name: string;
  category: "อุปกรณ์เสริม" | "คอมพิวเตอร์" | "อุปกรณ์จัดเก็บข้อมูล";
  price: number;
  stock: number;
  isActive: boolean;
  description?: string;
}

interface OrderItem {
  productId: number;
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "เมาส์", category: "อุปกรณ์เสริม", price: 350, stock: 20, isActive: true },
  { id: 2, name: "คีย์บอร์ด", category: "อุปกรณ์เสริม", price: 650, stock: 15, isActive: true },
  { id: 3, name: "จอภาพ", category: "คอมพิวเตอร์", price: 4500, stock: 8, isActive: true },
  { id: 4, name: "CPU", category: "คอมพิวเตอร์", price: 5500, stock: 5, isActive: true },
  { id: 5, name: "RAM", category: "คอมพิวเตอร์", price: 1800, stock: 0, isActive: true },
  { id: 6, name: "SSD", category: "อุปกรณ์จัดเก็บข้อมูล", price: 2200, stock: 12, isActive: true },
  { id: 7, name: "Flash Drive", category: "อุปกรณ์จัดเก็บข้อมูล", price: 250, stock: 30, isActive: false },
  { id: 8, name: "Webcam", category: "อุปกรณ์เสริม", price: 900, stock: 10, isActive: true }
];

console.log("ข้อมูลสินค้า:", products);

function getAvailableProducts(products: Product[]): Product[] {
  return products.filter(
    (product) => product.isActive === true && product.stock > 0
  );
}

console.log("สินค้าที่พร้อมขาย:", getAvailableProducts(products));

function applyDiscountByCategory(
  products: Product[],
  category: Product["category"],
  discountPercent: number
): Product[] {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("ส่วนลดต้องอยู่ระหว่าง 0 ถึง 100 เปอร์เซ็นต์");
  }

  return products.map((product) => {
    if (product.category === category) {
      return {
        ...product,
        price: product.price * (1 - discountPercent / 100)
      };
    }

    return product;
  });
}

const discountedProducts = applyDiscountByCategory(
  products,
  "อุปกรณ์เสริม",
  10
);

console.log("สินค้าหลังลดราคา 10%:", discountedProducts);

function calculateInventoryValue(products: Product[]): number {
  return products.reduce((total, product) => {
    return total + product.price * product.stock;
  }, 0);
}

console.log(
  "มูลค่าสต็อกสินค้าทั้งหมด:",
  calculateInventoryValue(products),
  "บาท"
);

function summarizeInventoryByCategory(
  products: Product[]
): Record<Product["category"], number> {
  return products.reduce(
    (summary, product) => {
      summary[product.category] += product.price * product.stock;
      return summary;
    },
    {
      "อุปกรณ์เสริม": 0,
      "คอมพิวเตอร์": 0,
      "อุปกรณ์จัดเก็บข้อมูล": 0
    }
  );
}

console.log(
  "สรุปมูลค่าสต็อกแยกตามหมวดหมู่:",
  summarizeInventoryByCategory(products)
);

function fetchProductById(id: number): Promise<Product> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = products.find((item) => item.id === id);

      if (product) {
        resolve(product);
      } else {
        reject(new Error(`ไม่พบสินค้ารหัส ${id}`));
      }
    }, 1000);
  });
}

fetchProductById(1)
  .then((product) => console.log("พบสินค้า:", product))
  .catch((error: Error) => console.log("เกิดข้อผิดพลาด:", error.message));

async function processCustomerOrder(items: OrderItem[]): Promise<void> {
  console.log("\n===== ใบเสร็จคำสั่งซื้อ =====");

  const successfulOrders: string[] = [];
  const failedOrders: string[] = [];

  for (const item of items) {
    try {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("จำนวนสินค้าต้องเป็นจำนวนเต็มบวก");
      }

      const product = await fetchProductById(item.productId);

      if (product.stock < item.quantity) {
        throw new Error("สินค้าในสต็อกไม่เพียงพอ");
      }

      const total = product.price * item.quantity;

      successfulOrders.push(
        `${product.name} x ${item.quantity} = ${total} บาท`
      );

      console.log("สำเร็จ:", product.name);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด";

      failedOrders.push(
        `รหัสสินค้า ${item.productId}: ${message}`
      );

      console.log("ล้มเหลว:", message);
    }
  }

  console.log("\n--- รายการที่สำเร็จ ---");
  successfulOrders.forEach((order) => console.log(order));

  console.log("\n--- รายการที่ล้มเหลว ---");
  failedOrders.forEach((order) => console.log(order));

  console.log("=========================");
}

const customerOrder: OrderItem[] = [
  { productId: 1, quantity: -2 }
];

processCustomerOrder(customerOrder);