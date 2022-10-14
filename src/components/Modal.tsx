import cn from 'classnames';
import { Nestable } from '../types';

interface ModalProps extends Nestable {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Modal({ show, setShow, children }: ModalProps) {
  return (
    <div className={cn('modal', { hidden: !show })}>
      <div className="modal-content">
        {children}
        <div className="modal-controls">
          <button
            onClick={() => {
              setShow(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
