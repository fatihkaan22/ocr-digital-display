import * as R from 'ramda';

export const toImgCoords =
  (scaleX, scaleY) =>
  ([y1, x1, y2, x2]) => {
    const w = Math.abs(x2 - x1) * scaleX;
    const h = Math.abs(y2 - y1) * scaleY;
    const x = x1 * scaleX;
    const y = y1 * scaleY;
    return [x, y, w, h];
  };

// id map from tensorflow label_map.pbtxt
export const labelMap = (x) => (x == 10 ? 0 : x);

export const getAnnotations = (classes, boxes, scores) =>
  R.pipe(
    R.transpose,
    R.map(([label, box, score]) => ({
      label: labelMap(label),
      box,
      score,
      id: Math.random()
    }))
  )([classes, boxes, scores]);

const sortVertically = (a, b) => a.box[0] - b.box[0];
const sortHorizontally = (a, b) => a.box[1] - b.box[1];

const sortVerticallyWithThresh = (t) => (a, b) =>
  Math.abs(sortVertically(a, b)) < t ? 0 : sortVertically(a, b);

const sort = (verticalThreshold) => (a, b) => {
  const v = sortVerticallyWithThresh(verticalThreshold || 0.1)(a, b);
  if (v == 0) {
    return sortHorizontally(a, b);
  }
  return v;
};

export const sortDigits =
  ({ scoreThreshold, verticalSortThreshold }) =>
  (detections) => {
    return R.pipe(
      R.identity,
      R.filter((d) => d.score > scoreThreshold),
      R.sort(sort(verticalSortThreshold)),
      R.map((d) => d)
    )(detections);
  };
