import { Outlet } from "react-router-dom";
import { usePostModal } from "../../context/PostModalContext"; 
import ModalPost from "../apps/student/posts/ModalPost"; 
import { usePosts } from "../../hooks/usePosts"; 
import { usePostsUpdate } from "../../context/PostsUpdateContext";
import Navbar from "../common/Navbar";

export default function StudentLayout() {
  const { state, closeModal } = usePostModal();
  const { addPost } = usePosts();
  const { notifyUpdate } = usePostsUpdate();

  return (
    <>
      <Navbar />
      <br />
      <Outlet />
      <ModalPost
        open={state.open}
        onClose={closeModal}
        onSubmit={async (data) => {
          await addPost(data, data.pensumId);
          notifyUpdate();
        }}
        courses={state.courses}
        initialData={state.initialData}
      />
    </>
  );
}
