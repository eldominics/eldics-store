import UserOrders from "@/components/UserOrders";
import { fetchUserOrders } from "@/utils/actions/order.actions";

export default async function Orders() {
  const userOrders = await fetchUserOrders();

  return <UserOrders userOrders={userOrders} />;
}
