import cn from 'classnames';
import { Nestable } from '../../types';
import './Modal.css'

interface ModalProps extends Nestable {
  show: boolean;
}

export default function Modal({ show, children }: ModalProps) {
  return (
    <div className={cn('modal', { hidden: !show })}>
      <div className="modal-content">{children}</div>
    </div>
  );
}

function ModalControls({ children }: Nestable) {
  return <div className="modal-controls">{children}</div>;
}

Modal.Controls = ModalControls;
