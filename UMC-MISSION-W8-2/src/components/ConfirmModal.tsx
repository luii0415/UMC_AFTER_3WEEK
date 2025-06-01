import { useSelector, useDispatch } from "../hooks/useCustomRedux";

import { closeModal, confirmClearCart } from "../slices/modalSlice";

const ConfirmModal = () => {
  const isOpen = useSelector((state) => state.modal.isOpen);
  const dispatch = useDispatch();

  // 모달이 열려 있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <p className="mb-4 text-gray-800">정말 삭제하시겠습니까?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            아니요
          </button>
          <button
            onClick={() => dispatch(confirmClearCart())}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
