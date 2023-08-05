import React, { useRef } from "react";
type props = {
  data: any;
};
export const ComponentToPrint = React.forwardRef(({ data }: props, ref) => {
  return (
    <div style={{ display: "none" }}>
      <div
        //@ts-ignore
        ref={ref}
        className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8"
      >
        <h1 className="font-bold text-2xl my-4 text-center text-blue-600">
          KRP Services
        </h1>
        <hr className="mb-2" />
        <div className="flex justify-between mb-6">
          <h1 className="text-lg font-bold">Invoice</h1>
          <div className="text-gray-700">
            <div>Date: 01/05/2023</div>
            <div>Invoice #: INV12345</div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Bill To:</h2>
          <div className="text-gray-700 mb-2">John Doe</div>
          <div className="text-gray-700 mb-2">123 Main St.</div>
          <div className="text-gray-700 mb-2">Anytown, USA 12345</div>
          <div className="text-gray-700">johndoe@example.com</div>
        </div>
        <table className="w-full mb-8">
          <thead>
            <tr>
              <th className="text-left font-bold text-gray-700">Description</th>
              <th className="text-right font-bold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-left text-gray-700">Product 1</td>
              <td className="text-right text-gray-700">$100.00</td>
            </tr>
            <tr>
              <td className="text-left text-gray-700">Product 2</td>
              <td className="text-right text-gray-700">$50.00</td>
            </tr>
            <tr>
              <td className="text-left text-gray-700">Product 3</td>
              <td className="text-right text-gray-700">$75.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="text-left font-bold text-gray-700">Total</td>
              <td className="text-right font-bold text-gray-700">$225.00</td>
            </tr>
          </tfoot>
        </table>
        <div className="text-gray-700 mb-2">Thank you for your business!</div>
        <div className="text-gray-700 text-sm">
          Please remit payment within 30 days.
        </div>
      </div>
    </div>
  );
});
ComponentToPrint.displayName = "MyComponent";

export default ComponentToPrint;
