import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300"
          >
            {/* Product List */}
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order.items?.map(
                  (item, idx) =>
                    item.product && (
                      <div key={idx} className="flex flex-col">
                        <p className="font-medium ">
                          {item.product?.name || "Unknown Product"}{" "}
                          <span className="text-primary">
                            x {item.quantity}
                          </span>
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Address */}
            {order.address ? (
              <div className="text-sm text-black/60 md:text-base">
                <p className="text-black/80">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state}, {order.address.zipcode},{" "}
                  {order.address.country}
                </p>
                <p>{order.address.phone}</p>
              </div>
            ) : (
              <div className="text-sm text-red-500">Address not available</div>
            )}

            {/* Amount */}
            <p className="font-medium text-lg my-auto">
              {currency}
              {order.amount || 0}
            </p>

            {/* Payment Info */}
            <div className="flex flex-col text-sm">
              <p>
                Method:{" "}
                <span className="text-yellow-600 font-medium">
                  {order.paymentType || "N/A"}
                </span>
              </p>
              <p>
                Date:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                Payment:{" "}
                <span
                  className={
                    order.isPaid
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
