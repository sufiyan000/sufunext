import AcmeLogo from '@/app/ui/acme-logo';
import { cloudinaryAction } from '../lib/actions';
import { Button } from '@/app/ui/button';
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <form action={cloudinaryAction} encType="multipart/form-data">
  <div className="rounded-md bg-gray-50 p-4 md:p-6">
    {/* Customer Name */}
    <div className="mb-4">
      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
        Choose customer
      </label>
      <div className="relative">
        <select
          id="customer"
          name="customerId"
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          defaultValue=""
        >
          <option value="" disabled>
            Select a customer
          </option>
         <option value={'one'}>one</option>
         <option value={'two'}>two</option>
        </select>
      </div>
    </div>

    {/* Invoice Amount */}
    <div className="mb-4">
      <label htmlFor="amount" className="mb-2 block text-sm font-medium">
        Choose an amount
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="Enter USD amount"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>
      </div>
    </div>

    {/* Invoice Status */}
    <fieldset>
      <legend className="mb-2 block text-sm font-medium">
        Set the invoice status
      </legend>
      <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              id="pending"
              name="status"
              type="radio"
              value="pending"
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            />
            <label
              htmlFor="pending"
              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
            >
              Pending 
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="paid"
              name="status"
              type="radio"
              value="paid"
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            />
            <label
              htmlFor="paid"
              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
            >
              Paid 
            </label>
          </div>
        </div>
      </div>
    </fieldset>

    {/* File Upload Field */}
    <div className="mb-4">
      <label htmlFor="invoiceImage" className="mb-2 block text-sm font-medium">
        Upload Invoice Image
      </label>
      <input
        id="invoiceImage"
        name="invoiceImage"
        type="file"
        accept="image/*"
        className="block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
      />
    </div>
  </div>

  <div className="mt-6 flex justify-end gap-4">
    
    <Button type="submit">Create Invoice</Button>
  </div>
</form>

      </div>
    </main>
  );
}