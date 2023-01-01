import './style.css';
import SplitPane from 'react-split-pane';
import ImageAnnotation from '../ImageAnnotation';
import Annotations from '../Annotations';
import LeftSplit from '../LeftSplit';
import Output from '../Output';
import DetectionList from '../DetectionList';

const SplitView = () => {
  return (
    <div>
      <SplitPane
        split="vertical"
        defaultSize={
          parseInt(localStorage.getItem('splitPosVertical'), 10) || 900
        }
        onChange={(size) => localStorage.setItem('splitPosVertical', size)}
      >
        <LeftSplit />
        {/* <ImageAnnotation /> */}
        <SplitPane
          split="horizontal"
          defaultSize={
            parseInt(localStorage.getItem('splitPosHorizontal'), 10) || 500
          }
          onChange={(size) => localStorage.setItem('splitPosHorizontal', size)}
        >
          {/* <Annotations /> */}
          <DetectionList />
          <div>
            <Output />
          </div>
        </SplitPane>
      </SplitPane>
    </div>
  );
};

export default SplitView;
