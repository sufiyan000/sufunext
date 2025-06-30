"use client";
import { useState } from "react";
import { 
    PencilIcon,
    PlusIcon,
    MinusIcon,
    TrashIcon,
    ViewfinderCircleIcon,
    PlusCircleIcon,
     XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import api from '@/app/lib/axiosClient';


export function CreateProduct() {
  return (
    <Link
      href="/dashboard/products/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Product</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/products/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  return (
    <>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
  );
}

export function ViewProduct({ id }: { id: string }) {
 
  return (
    <>  
    <Link
      href={`/dashboard/products/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <ViewfinderCircleIcon className="w-5" />
    </Link>
    </>
  );
}

export function Purchase({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
  const purchaseProduct = async () => {
    try {
      const response = await api.post(`/api/purchase`, {
        quantity,
        id,
      });
      console.log(response);
      setOpen(false);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div
        className="rounded-md border p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <PlusCircleIcon className="w-5" />
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-medium">Purchase Product</h2>
              <button onClick={() => setOpen(false)}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 py-4">
              <button
                className="p-2 border rounded-lg hover:bg-gray-100"
                onClick={decreaseQuantity}
              >
                <MinusIcon className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                className="p-2 border rounded-lg hover:bg-gray-100"
                onClick={increaseQuantity}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-right">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={purchaseProduct}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
