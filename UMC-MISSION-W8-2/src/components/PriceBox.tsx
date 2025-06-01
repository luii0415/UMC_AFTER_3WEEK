import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { CartState, clearCart } from "../slices/cartSlice";
import { openModal } from "../slices/modalSlice";
const PriceBox = () => {
  const { total } = useSelector((state): CartState => state.cart);
  const dispatch = useDispatch();

  // const handleInitializeCart = () => {
  //   dispatch(clearCart());
  // };
  const handleOpenModal = () => {
    dispatch(openModal()); // ← 추가
  };
  return (
    <div className="p-12 flex justify-between">
      <button
        onClick={handleOpenModal}
        className="border p-4 rounded-md cursor-pointer"
      >
        장바구니 초기화
      </button>
      <div>총 가격 : {total}원</div>
    </div>
  );
};

export default PriceBox;
