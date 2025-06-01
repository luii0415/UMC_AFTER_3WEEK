import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import modalReducer from "../slices/modalSlice";
//redux toolkit 사용방법
// 0. npm install @reduxjs/toolkit
// 0. npm install react-redux

// 1. store 생성 (저장소 생성)
function createStore() {
  const store = configureStore({
    //2. 리듀서 설정
    reducer: { cart: cartReducer, modal: modalReducer },
  });
  return store;
}

//store을 활용할 수 있도록 내보내야 함
//싱글톤 패턴
const store = createStore();

export default store;

/**RootState: store.getState()의 반환값 타입을 자동으로 추론해서, “스토어가 관리하는 전체 상태 트리”를 하나의 타입으로 선언하는 것.

AppDispatch: store.dispatch 함수 자체의 타입을 추론해서, “이 스토어에서 허용하는 모든 액션 또는 thunk”를 안전하게 호출할 수 있도록 선언하는 것. */

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
