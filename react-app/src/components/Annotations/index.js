import { useSelector, useDispatch } from 'react-redux';
import { setActiveAnnotations } from '../../store/actions';

const Annotations = () => {
  const annotations = useSelector((state) => state.ui.annotations);
  const dispatch = useDispatch();

  const onMouseOver = (id) => (e) => {
    dispatch(setActiveAnnotations([id]));
  };

  const onMouseOut = (id) => (e) => {
    dispatch(setActiveAnnotations([]));
  };

  return (
    <ul>
      {annotations.map((a) => (
        <li
          key={a.data.id}
          onMouseOver={onMouseOver(a.data.id)}
          onMouseOut={onMouseOut(a.data.id)}
        >
          {a.data.text}
        </li>
      ))}
    </ul>
  );
};

export default Annotations;