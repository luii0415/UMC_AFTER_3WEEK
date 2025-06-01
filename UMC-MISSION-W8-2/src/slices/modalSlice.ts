import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // 모달 열기
    openModal: (state) => {
      state.isOpen = true;
    },
    // 모달 닫기 (아니요 버튼)
    closeModal: (state) => {
      state.isOpen = false;
    },
    // 확인(네) 버튼 액션: 모달 닫힘 + 카트 비우기 트리거
    confirmClearCart: (state) => {
      state.isOpen = false;
      // 장바구니 비우는 실제 로직은 cartSlice.extraReducers에서 처리
    },
  },
});

export const { openModal, closeModal, confirmClearCart } = modalSlice.actions;
export default modalSlice.reducer;
