import { HasValue, Substitutable } from '../../types';
import './Tag.css';
import Pill from '../Pill';

interface TagProps extends Substitutable {
  title: string;
  color: string;
}

export default function Tag({ title, color, as }: TagProps): JSX.Element {
  return <Pill as={as || 'li'} value={title} color={color} className="tag" />;
}
