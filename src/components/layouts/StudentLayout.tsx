import { Outlet } from "react-router-dom";
import { usePostModal } from "../../context/PostModalContext"; 
import ModalPost from "../apps/student/post_modal/ModalPost"; 
import { usePosts } from "../../hooks/usePosts"; 
import Navbar from "../common/Navbar";

export default function StudentLayout() {
  const { state, closeModal } = usePostModal();
  const { addPost } = usePosts();

  return (
    <>
      <Navbar />
      <br />
      <Outlet />
      <ModalPost
        open={state.open}
        onClose={closeModal}
        onSubmit={(data) => addPost(data, data.planId)}
        courses={state.courses}
        initialData={state.initialData}
      />
    </>
  );
}
