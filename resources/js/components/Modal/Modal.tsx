import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalContext } from './context/useModalContext';

interface Props {
    children: React.ReactNode;
    className?: string;
    position?: 'center' | 'right' | 'top';
}

export function Modal({ children, className, position }: Props) {
    const modalRef = useRef<HTMLDivElement>(null);
    const { state, setState } = useModalContext();

    const getStylePosition = () => {
        if (position === 'right') {
            return 'right-0 min-h-screen h-full w-full sm:w-2/3  md:w-2/5 ';
        }
        return 'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-full w-full sm:w-4/5 md:w-2/3 lg:w-1/2 rounded-md';
    };

    const closeModal = () => {
        setState(false);
    };

    const modalRoot = document.getElementById('modal'); // -> lugar donde se va a mostrar el modal en el DOM

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // Indicamos en el content del modal que el click no se propague para arriba al overlay
    };

    useEffect(
        function () {
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setState(false);
                }
            };

            if (state) {
                document.addEventListener('keydown', handleEsc);
            }

            return () => {
                document.removeEventListener('keydown', handleEsc);
            };
        },
        [setState, state],
    );

    if (!state || !modalRoot) return null;
    // El createPortal nos permite renderizar elementos en cualquier parte del DOM
    return createPortal(
        <div className="fixed inset-0 z-40 flex cursor-pointer items-center justify-center bg-black/50 dark:bg-white/5" onClick={closeModal}>
            {/* Este es nuestro modal */}
            <div
                className={`fixed z-50 flex max-w-full cursor-default flex-col gap-4 overflow-auto border bg-white p-6 shadow-lg duration-200 md:max-h-[90%] lg:px-8 dark:bg-background ${
                    className || ''
                } p-2 pt-8 ${getStylePosition()}`}
                onClick={handleContentClick}
                ref={modalRef}
            >
                <div
                    className="p-.5 absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-black hover:scale-110"
                    onClick={closeModal}
                >
                    X
                </div>
                {children}
            </div>
        </div>,
        modalRoot,
    );
}

// <Modal /><Modal> <Modal /><Modal> son el mismo modal pero diferentes instancias?
