"use client";
import { PencilIcon, PlusIcon, TrashIcon,ViewfinderCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
