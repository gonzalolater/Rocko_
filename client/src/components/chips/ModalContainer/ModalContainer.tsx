import { ReactNode } from 'react';

function ModalContainer({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[999] bg-[#01030480] flex items-center justify-center">
      {children}
    </div>
  );
}

export default ModalContainer;
