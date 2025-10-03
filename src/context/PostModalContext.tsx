import { createContext, useContext, useState } from "react";

interface Course {
  name: string;
  slug: string;
}

interface ModalState {
  open: boolean;
  initialData?: any;
  courses: Course[];
}

interface PostModalContextType {
  state: ModalState;
  openModal: (data: { initialData?: any; courses: Course[] }) => void;
  closeModal: () => void;
}

const PostModalContext = createContext<PostModalContextType | undefined>(undefined);

export function PostModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>({ open: false, courses: [] });

  const openModal = ({ initialData, courses }: { initialData?: any; courses: Course[] }) => {
    setState({ open: true, initialData, courses });
  };

  const closeModal = () => setState({ open: false, courses: [] });

  return (
    <PostModalContext.Provider value={{ state, openModal, closeModal }}>
      {children}
    </PostModalContext.Provider>
  );
}

export function usePostModal() {
  const context = useContext(PostModalContext);
  if (!context) throw new Error("usePostModal debe usarse dentro de PostModalProvider");
  return context;
}