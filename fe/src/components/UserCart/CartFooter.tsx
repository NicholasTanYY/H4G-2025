import React from "react";
import styled from "styled-components";
import { CONFIRM_SHOPPING_CART } from "../../gql/ops";
import { ApolloClient, useMutation } from "@apollo/client";
import { useCart } from "../General/CartContext";
import { CartItem } from "../../definitions/CartItem";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../General/ErrorMessage";

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const TotalCostText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const InsufficientVouchersText = styled.p`
  font-size: 14px;
  color: red;
  margin: 0;
`;

const ConfirmPurchaseButton = styled.button<{ disabled: boolean }>`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#4caf50")};
  color: ${({ disabled }) => (disabled ? "#777" : "#fff")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#45a049")};
  }
`;

interface CartFooterProps {
  client: ApolloClient<Object>;
  totalCost: number;
  userVoucherAmount: number;
}

const CartFooter: React.FC<CartFooterProps> = ({ client, totalCost, userVoucherAmount }) => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart(); // Get cartItems from context

  const [confirmShoppingCart, { loading, error }] = useMutation(CONFIRM_SHOPPING_CART, {
    onCompleted: () => {
      clearCart();
      alert("Purchase confirmed! The voucher amount has been deducted.");
      client.clearStore();
      navigate('/dashboard');
    },
    onError: (err) => {
      console.error("Error confirming purchase:", err);
    },
  });

  const handleOnClick = () => {
    const cartData: CartItem[] = cartItems.map((item) => ({
      product: {
        name: item.product.name, 
        tag: item.product.tag,
        link: item.product.link,
        price: item.product.price,
        quantity: item.product.quantity,
        description: item.product.description,
      },
      quantity: item.quantity,
    }));
    confirmShoppingCart({ variables: { shoppingCart: cartData } });
  };

  const hasInsufficientVouchers = totalCost > userVoucherAmount;
  const emptyCart = cartItems.length === 0;

  return (
    <FooterWrapper>
      {error && <ErrorMessage error={error} />}
      <TotalCostText>Total cost: {totalCost} 💳</TotalCostText>
      {hasInsufficientVouchers && (
        <InsufficientVouchersText>Insufficient vouchers!</InsufficientVouchersText>
      )}
      <ConfirmPurchaseButton
        onClick={handleOnClick}
        disabled={hasInsufficientVouchers || loading || emptyCart}
      >
        {loading ? "Processing..." : "Confirm Purchase"}
      </ConfirmPurchaseButton>
    </FooterWrapper>
  );
};

export default CartFooter;

