import { Changeable, Substitutable } from '../../types';
import Editable from '../Editable';
import './Tag.css';

interface TagProps extends Substitutable, Changeable<HTMLInputElement> {
  title: string;
  color: string;
}

export default function Tag({ title, color, as, onChange }: TagProps): JSX.Element {
  return (
    <Editable
      as={as}
      value={title}
      onChange={onChange}
      className="pill tag"
      style={{ '--tag-color': color } as React.CSSProperties}
    />
  );
}
