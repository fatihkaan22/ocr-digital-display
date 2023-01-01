import Boundingbox from './Boundingbox.js';
import { toImgCoords } from '../../utils';
import { useEffect, useState } from 'react';

const BoundinBox = ({ detections, scoreThreshold, ...props }) => {
  const [transformedDetections, setTransformedDetections] = useState([]);

  useEffect(() => {
    const getMeta = async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    };

    setTransformedDetections([]);
    getMeta(props.image).then((img) => {
      setTransformedDetections(
        detections.map((d) => ({
          coord: toImgCoords(img.naturalWidth, img.naturalHeight)(d.box),
          ...d
        }))
      );
    });
  }, [props.image, detections]);

  return (
    <Boundingbox
      boxes={transformedDetections.filter((d) => d.score > scoreThreshold)}
      scale={3}
      {...props}
    />
  );
};

export default BoundinBox;
