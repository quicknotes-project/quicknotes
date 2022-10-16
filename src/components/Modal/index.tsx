import cn from 'classnames';
import { Nestable } from '../../types';
import './Modal.css';

interface ModalProps extends Nestable {
  show: boolean;
}

export default function Modal({ show, children }: ModalProps) {
  return (
    <div className={cn('modal-background', { hidden: !show })}>
      <div className="modal-content">{children}</div>
    </div>
  );
}

function Header({ children }: Nestable) {
  return <div className="modal-header">{children}</div>;
}

function Body({ children }: Nestable) {
  return <div className="modal-body">{children}</div>;
}

function Footer({ children }: Nestable) {
  return <div className="modal-footer">{children}</div>;
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
