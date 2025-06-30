import { sql } from '@vercel/postgres';
import mongoose from 'mongoose';
import api from '@/app/lib/axiosClient';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import connectMongo from "@/app/lib/mongodb";
import Product, { IProduct } from "@/app/schema/productSchema";
import Category from '../schema/categorySchema';
import SubCategory from '../schema/subCategorySchema';
import SubLevel from '../schema/subLevelSchema';
import Supplier from '../schema/supplierSchema';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  await connectMongo();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = await Product.countDocuments();
    const products = await Product.find();
    const totalPendingInvoices = products.reduce((total, product) => {
      const productInvestment = product.purchasePrice * product.stock; // Har product ka investment
      return total + productInvestment; // Total add karein
    }, 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 20;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    console.log(invoices.rows);
    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}



export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchSuppliers() {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/suppliers`);
    return response.data.supplier;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
export async function fetchCategory() {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`);
    return response.data.categories;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchSubCategory(id:string) {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sub-category/${id}`);
    return response.data.categories;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}


export async function fetchFilteredProducts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    await connectMongo();
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        
      ],
    };

    // Fetching specific fields
    const products = await Product.find(searchCriteria)
      .select('name slug thumbnailUrl sku sellingPrice stock brand sellingPrice regularPrice') // Fetch only these fields
      .sort({ createdAt: -1 }) 
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .exec();
    return products;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw new Error('Failed to fetch product details.');
  }
}

export async function fetchProductPages(query: string) {
  try {
    await connectMongo();
    // Use a dynamic search query with regular expressions
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search for name
        { brand: { $regex: query, $options: 'i' } }, // Case-insensitive search for brand
        { sku: { $regex: query, $options: 'i' } }, // Case-insensitive search for SKU
        { warranty: { $regex: query, $options: 'i' } }, // Case-insensitive search for warranty
        { description: { $regex: query, $options: 'i' } }, // Case-insensitive search for description
      ],
    };

    // Count the total number of matching documents
    const totalCount = await Product.countDocuments(searchQuery);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Error fetching total product pages:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchFilteredSuppliers(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    await connectMongo();
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        
      ],
    };

    // Fetching specific fields
    const supplirs = await Supplier.find(searchCriteria)
      .select('name email phone address') // Fetch only these fields
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .exec();
    console.log(supplirs);
    return supplirs;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw new Error('Failed to fetch product details.');
  }
}

export async function fetchSuppliersPages(query: string) {
  try {
    await connectMongo();
    // Use a dynamic search query with regular expressions
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search for name
        { email: { $regex: query, $options: 'i' } }, // Case-insensitive search for brand
        { phone: { $regex: query, $options: 'i' } }, // Case-insensitive search for SKU
        { address: { $regex: query, $options: 'i' } }, // Case-insensitive search for warranty
        // { description: { $regex: query, $options: 'i' } }, // Case-insensitive search for description
      ],
    };

    // Count the total number of matching documents
    const totalCount = await Supplier.countDocuments(searchQuery);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Error fetching total product pages:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchProductById(id: string) {
  await connectMongo();
  
  try {
    const productWithDetails = await Product.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) } // Sirf yeh specific product hi fetch hoga
      },
  
      // Supplier ka data join karna
      {
        $lookup: {
          from: "suppliers", // Supplier collection ka naam
          localField: "suppliers",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      {
        $unwind: {
          path: "$supplierDetails",
          preserveNullAndEmptyArrays: true, // Agar supplier na ho toh bhi product aaye
        },
      },
  
      // Category ka data join karna
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
  
      // SubCategory ka data join karna
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategories",
          foreignField: "_id",
          as: "subCategoryDetails",
        },
      },
  
      // Sublevel ka data join karna
      {
        $lookup: {
          from: "sublevels",
          localField: "subLevels",
          foreignField: "_id",
          as: "subLevelDetails",
        },
      },
  
      // Output fields select karna
      {
        $project: {
          _id: 1,
          name: 1,
          thumbnailUrl: 1,
          videoUrl: 1,
          brand: 1,
          sku: 1,
          warranty: 1,
          description: 1,
          suppliers: 1,
          purchasePrice: 1,
          sellingPrice: 1,
          regularPrice: 1,
          stock: 1,
          attributes: 1,
          tags: 1,
          isFeatured: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          supplierDetails: {
            name: 1,
            email: 1,
            phone: 1,
          },
          categoryDetails: "$categoryDetails.name",
          subCategoryDetails: "$subCategoryDetails.name",
          subLevelDetails: "$subLevelDetails.name",
        },
      },
    ]);
  
    return productWithDetails[0] || null;
  
} catch (error) {
  console.error('Database Error:', error);
  throw new Error('Failed to fetch product.');
}
}

export async function updateProductById(id: string) {
  const productId = "ksks";
  const updateData = {
    name: "Updated Product Name",
    brand: "Updated Brand",
    // Add more fields as needed
  };
  await connectMongo();
  try{

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true, // Updated document return karega
      runValidators: true, // Schema validations apply karega
    });

  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update product.');
  }

}




export async function getProductByIdUsingAggregate(id: string) {
  await connectMongo();
  try {

    const result = await Product.aggregate([
      // Match the product by ID
      { $match: { _id: new mongoose.Types.ObjectId(id as string) } },
      // Lookup related categories, subCategories, and subLevels
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategories',
          foreignField: '_id',
          as: 'subCategories',
        },
      },
      {
        $lookup: {
          from: 'sublevels',
          localField: 'subLevels',
          foreignField: '_id',
          as: 'subLevels',
        },
      },
      // Project fields to transform the data
      {
        $project: {
          id: { $toString: '$_id' },
          name: 1,
          thumbnailUrl: 1,
          regularPrice: 1,
          salePrice: '$sellingPrice',
          images: 1,
          description: 1,
          warranty: 1,
          specifications: {
            brand: '$brand',
            model: '$sku',
          },
          highlights: {
            $arrayToObject: {
              $map: {
                input: '$attributes',
                as: 'attr',
                in: {
                  k: '$$attr.key',
                  v: '$$attr.value',
                },
              },
            },
          },
          reviews: [
            {
              user: 'John Doe',
              rating: 4,
              comment: 'Great sound quality and comfortable to wear.',
            },
            {
              user: 'Jane Smith',
              rating: 5,
              comment: 'Amazing battery life and noise cancellation!',
            },
          ],
          deliveryInfo: 'Free delivery within 3-5 business days. Cash on Delivery available.',
        },
      },
    ]);

    if (!result.length) {
      throw new Error('Product not found');
    }

    return {
      ...result[0],
      id: result[0]._id.toString(), // Convert `_id` to string
      _id: undefined,               // Remove the `_id` field if not needed
    }; // Return the transformed product object
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching product');
  }
};

export async function getSubCategoryById(id: string) {
  await connectMongo();
}

export async function getProductBySlugUsingAggregate(slug: string) {
  await connectMongo();

  try {
    const result = await Product.aggregate([
      // Match the product by slug
      { $match: { slug: slug } },

      // Lookup related categories, subCategories, and subLevels
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategories',
          foreignField: '_id',
          as: 'subCategories',
        },
      },
      {
        $lookup: {
          from: 'sublevels',
          localField: 'subLevels',
          foreignField: '_id',
          as: 'subLevels',
        },
      },

      // Project transformed fields
      {
        $project: {
          id: { $toString: '$_id' },
          name: 1,
          slug: 1,
          thumbnailUrl: 1,
          regularPrice: 1,
          salePrice: '$sellingPrice',
          images: 1,
          description: 1,
          warranty: 1,
          specifications: {
            brand: '$brand',
            model: '$sku',
          },
          highlights: {
            $arrayToObject: {
              $map: {
                input: '$attributes',
                as: 'attr',
                in: {
                  k: '$$attr.key',
                  v: '$$attr.value',
                },
              },
            },
          },
          reviews: [
            {
              user: 'John Doe',
              rating: 4,
              comment: 'Great sound quality and comfortable to wear.',
            },
            {
              user: 'Jane Smith',
              rating: 5,
              comment: 'Amazing battery life and noise cancellation!',
            },
          ],
          deliveryInfo: 'Free delivery within 3-5 business days. Cash on Delivery available.',
        },
      },
    ]);

    if (!result.length) {
      throw new Error('Product not found');
    }

    return {
      ...result[0],
      _id: undefined,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching product by slug');
  }
}
