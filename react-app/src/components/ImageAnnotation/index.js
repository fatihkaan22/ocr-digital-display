import { useState } from 'react';
import Annotation from 'react-image-annotation';
import Root from './Root';
import { useSelector, useDispatch } from 'react-redux';
import { submit } from '../../store/actions';

const ImageAnnotation = () => {
  const annotations = useSelector((state) => state.ui.annotations);
  const activeAnnotations = useSelector((state) => state.ui.activeAnnotations);
  const dispatch = useDispatch();

  const [annotation, setAnnotation] = useState({});

  const onChange = (annotation) => {
    setAnnotation(annotation);
  };

  const onSubmit = (annotation) => {
    dispatch(submit(annotation));
  };

  const activeAnnotationComparator = (a, b) => a.data.id === b;

  return (
    <Root>
      <Annotation
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfyaogc5c4ZphfImbm1u9SmfUIJPZVllhkXw&usqp=CAU"
        annotations={annotations}
        activeAnnotations={activeAnnotations}
        activeAnnotationComparator={activeAnnotationComparator}
        value={annotation}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Root>
  );
};

export default ImageAnnotation;
