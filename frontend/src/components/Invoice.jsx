import { useRef } from 'react';
import { Download, Printer } from 'lucide-react';

const Invoice = ({ order, user, onPrint, onDownload }) => {
  const invoiceRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateSubtotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    // Assuming 18% GST
    return subtotal * 0.18;
  };

  const calculateShipping = () => {
    // Free shipping over ₹1000, otherwise ₹50
    const subtotal = calculateSubtotal();
    return subtotal >= 1000 ? 0 : 50;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping();
  const total = subtotal + tax + shipping;

  const handlePrint = () => {
    if (onPrint) {
      onPrint(invoiceRef.current);
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(invoiceRef.current);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" ref={invoiceRef}>
      {/* Invoice Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">INVOICE</h1>
            <p className="text-gray-300 text-sm">Choicetime - Fashion & Lifestyle</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300 mb-1">Invoice #</p>
            <p className="text-lg font-bold">
              {order?._id ? `INV-${order._id.slice(-8).toUpperCase()}` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-6 sm:p-8">
        {/* Company & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">From</h3>
            <div className="space-y-1.5 text-sm">
              <p className="font-bold text-gray-900 text-base">Choicetime</p>
              <p className="text-gray-700">Fashion & Lifestyle Store</p>
              <div className="space-y-1 mt-2">
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> support@choicetime.com
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span> +91 1800-XXX-XXXX
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span> Your Business Address, City, State - PIN
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-bold text-gray-900 text-base mb-1">
                  {order?.shippingAddress?.name || user?.name || 'Customer'}
                </p>
              </div>
              <div className="space-y-1">
                {user?.email && (
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                )}
                {(order?.shippingAddress?.phone || user?.phone) && (
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> {order?.shippingAddress?.phone || user?.phone}
                  </p>
                )}
              </div>
              {(order?.shippingAddress?.address || order?.shippingAddress?.city) && (
                <div className="mt-3 pt-2 border-t border-gray-200 space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Shipping Address</p>
                  {order?.shippingAddress?.address && (
                    <p className="text-gray-700">{order.shippingAddress.address}</p>
                  )}
                  {order?.shippingAddress?.city && (
                    <p className="text-gray-700">
                      {order.shippingAddress.city}
                      {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                      {order.shippingAddress.zipCode && ` - ${order.shippingAddress.zipCode}`}
                    </p>
                  )}
                  {order?.shippingAddress?.country && (
                    <p className="text-gray-700">{order.shippingAddress.country}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Order Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(order?.orderDate || order?.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Order Time</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatTime(order?.orderDate || order?.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Payment Method</p>
            <p className="text-sm font-semibold text-gray-900">
              {order?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Order Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order?.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order?.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              order?.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1) || 'Pending'}
            </span>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order?.items?.map((item, index) => {
                  const product = item.product || item;
                  const productName = product.name || product.title || 'Product';
                  const productImage = product.images?.[0] || product.image || product.thumbnail || product.images?.image1;
                  const itemPrice = item.price || product.finalPrice || product.price || product.mrp || 0;
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {productImage && (
                            <img
                              src={productImage}
                              alt={productName}
                              className="w-12 h-12 object-cover rounded border border-gray-200"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{productName}</p>
                            {product.brand && (
                              <p className="text-xs text-gray-500">{product.brand}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-600">
                        <div className="flex flex-col gap-0.5">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.boxType && <span>Box: {item.boxType}{Number(item.boxPrice) > 0 ? ` (+₹${item.boxPrice})` : ''}</span>}
                          {!item.size && !item.boxType && '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900">
                        ₹{itemPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                        ₹{itemTotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">
                {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (GST 18%)</span>
              <span className="font-medium text-gray-900">₹{tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
            </div>
            <div className="pt-3 border-t-2 border-gray-300 flex justify-between">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-base font-bold text-gray-900">₹{total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Thank you for your business!</p>
            <p>For any queries, contact us at support@choicetime.com</p>
            <p className="mt-4">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {(onPrint || onDownload) && (
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
          {onPrint && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          )}
          {onDownload && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoice;

