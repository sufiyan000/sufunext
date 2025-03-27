import Breadcrumbs from '@/app/ui/dashboard/invoices/breadcrumbs';
import { fetchProductById } from '@/app/lib/data';

// Product Type define kiya
type Product = {
    _id: string;
    name: string;
    thumbnailUrl: string;
    description: string;
    sellingPrice: number;
    purchasePrice: number;
    suppliers: any;
    supplierDetails: any;
    categoryDetails: string;
    subCategoryDetails: string;
    subLevelDetails: string;
    stock: number;
    isFeatured: boolean;
    attributes: { key: string; value: string }[];
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const productData = await fetchProductById(id);
    console.log(productData);
    const product: Product | null = Array.isArray(productData) ? productData[0] : productData;

    if (!product) {
        return <p className="text-red-500 text-center mt-10">Product not found</p>;
    }

    return (
        <main className="p-6">
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Products', href: '/dashboard/products' },
                    {
                        label: 'View Product',
                        href: `/dashboard/products/${id}/view`,
                        active: true,
                    },
                ]}
            />

            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
                <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="w-40 h-40 object-cover rounded-md"
                />
                <h2 className="text-xl font-bold mt-2">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-bold mt-2">
                    Price: ₹{product.sellingPrice}
                </p>
                <p className="text-red-600 font-bold mt-2">
                    Purchase: ₹{product.purchasePrice}
                </p>
                <p className="text-purple-600 font-bold mt-2">
                    Category: {product.categoryDetails}
                </p>
                <p className="text-orange-600 font-bold mt-2">
                    Sub Category: {product.subCategoryDetails}
                </p>
                <p className="text-indigo-600 font-bold mt-2">
                    Sub-Level: {product.subLevelDetails}
                </p>
                <p className="text-pink-600 font-bold mt-2">
                    Stock: {product.stock}
                </p>
                <p className="text-teal-600 font-bold mt-2">
                    Is Featured: {product.isFeatured? 'Yes' : 'No'}
                </p>
                <p className="text-blue-600 font-bold mt-2">
                    suppliers: {product.supplierDetails.name}
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Attributes:</h3>
                <ul className="list-disc list-inside text-gray-700">
                    {product.attributes.map((attr, index) => (
                        <li key={index}>
                            <strong>{attr.key}:</strong> {attr.value}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
