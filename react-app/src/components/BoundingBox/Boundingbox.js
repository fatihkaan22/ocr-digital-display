import React, { Component } from 'react';
import PropTypes from 'prop-types';

const scaleBoxes = (xs, scale) =>
  xs.map((a) => ({
    ...a,
    coord: a.coord.map((x) => x * scale)
  }));

class Boundingbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasCreated: false,
      hoverIndex: -1,
      segmentColors: []
    };

    this.scaledBoxes = scaleBoxes(props.boxes, props.scale);
  }

  setOnMouseMove(nextProps) {
    this.canvas.onmousemove = (e) => {
      const r = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / r.width;
      const scaleY = this.canvas.height / r.height;
      const x = (e.clientX - r.left) * scaleX;
      const y = (e.clientY - r.top) * scaleY;

      const selectedBox = { index: -1, dimensions: null };

      if (this.scaledBoxes && this.scaledBoxes.length > 0) {
        this.scaledBoxes.forEach((box, index) => {
          if (!box || typeof box === 'undefined') return null;

          const coord = box.coord ? box.coord : box;

          let [bx, by, bw, bh] = [0, 0, 0, 0];

          if (
            typeof coord.xmin !== 'undefined' &&
            typeof coord.xmax !== 'undefined' &&
            typeof coord.ymin !== 'undefined' &&
            typeof coord.ymax !== 'undefined'
          ) {
            // coord is an object containing xmin, xmax, ymin, ymax attributes
            // width is absolute value of (xmax - xmin)
            // height is absolute value of (ymax - ymin)
            // absolute value takes care of various possible referentials:
            //   - sometimes 0,0 is top-left corner
            //   - sometimes 0,0 is bottom-left corner
            [bx, by, bw, bh] = [
              Math.min(coord.xmin, coord.xmax),
              Math.min(coord.ymin, coord.ymax),
              Math.max(coord.xmin, coord.xmax) -
                Math.min(coord.xmin, coord.xmax),
              Math.max(coord.ymin, coord.ymax) -
                Math.min(coord.ymin, coord.ymax)
            ];
          } else {
            // coord is an array containing [x, y, width, height] values
            [bx, by, bw, bh] = coord;
          }

          if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
            // The mouse honestly hits the rect
            const insideBox =
              !selectedBox.dimensions ||
              (bx >= selectedBox.dimensions[0] &&
                bx <= selectedBox.dimensions[0] + selectedBox.dimensions[2] &&
                by >= selectedBox.dimensions[1] &&
                by <= selectedBox.dimensions[1] + selectedBox.dimensions[3]);
            if (insideBox) {
              selectedBox.index = index;
              selectedBox.dimensions = box;
            }
          }
        });
      }

      if (nextProps) {
        nextProps.onSelected(selectedBox.index);
      } else {
        this.props.onSelected(selectedBox.index);
      }
      this.setState({ hoverIndex: selectedBox.index });
    };

    this.canvas.onmouseout = () => {
      if (nextProps) {
        nextProps.onSelected(-1);
      } else {
        this.props.onSelected(-1);
      }
      this.setState({ hoverIndex: -1 });
      // this.renderBoxes();
    };
  }

  componentDidMount() {
    const ctx = this.canvas.getContext('2d');

    const background = new Image();
    background.src = this.props.options.base64Image
      ? 'data:image/png;base64,' + this.props.image
      : this.props.image;

    // Make sure the image is loaded first otherwise nothing will draw.
    background.onload = () => {
      this.canvas.width = background.width * this.props.scale;
      this.canvas.height = background.height * this.props.scale;

      ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
      this.renderBoxes();
      this.setOnMouseMove();
    };
  }

  componentWillReceiveProps(nextProps) {
    const ctx = this.canvas.getContext('2d');
    this.scaledBoxes = scaleBoxes(nextProps.boxes, nextProps.scale);
    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const background = new Image();
    background.src = nextProps.options.base64Image
      ? 'data:image/png;base64,' + this.props.image
      : nextProps.image;

    // Check canvas dimension with loaded image dimension
    // in order to change canvas dimension if needed
    background.onload = () => {
      console.log('onload');
      if (
        this.canvas.width !== background.width * nextProps.scale &&
        this.canvas.height !== background.height * nextProps.scale
      ) {
        this.canvas.width = background.width * this.props.scale;
        this.canvas.height = background.height * this.props.scale;
        ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
        this.renderBoxes(nextProps.boxes);
        this.setOnMouseMove(nextProps);
      }
    };

    ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
    this.renderBoxes(nextProps.boxes);

    this.setState({ hoverIndex: nextProps.selectedIndex });

    this.setOnMouseMove(nextProps);

    return true;
  }

  componentDidUpdate() {
    this.renderBoxes();
  }

  newShade = (hexColor, magnitude) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
      const decimalColor = parseInt(hexColor, 16);
      let r = (decimalColor >> 16) + magnitude;
      r > 255 && (r = 255);
      r < 0 && (r = 0);
      let g = (decimalColor & 0x0000ff) + magnitude;
      g > 255 && (g = 255);
      g < 0 && (g = 0);
      let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
      b > 255 && (b = 255);
      b < 0 && (b = 0);
      return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
      return hexColor;
    }
  };

  getColor(label) {
    return [
      '#7c1158',
      '#fd7f6f',
      '#7eb0d5',
      '#b2e061',
      '#bd7ebe',
      '#ffb55a',
      '#ffee65',
      '#beb9db',
      '#fdcce5',
      '#8bd3c7'
    ][parseInt(label, 10) || 0];
  }

  getLineWidth() {
    return parseInt(this.canvas.width * 0.005, 10);
  }

  renderBox(box, index) {
    if (!box || typeof box === 'undefined') return null;

    // let color = this.props.options.colors.normal;
    let color = this.getColor(box.label) || this.props.options.colors.normal;
    if (this.state.hoverIndex >= 0) {
      color = this.props.options.colors.unselected;
    }
    if (index === this.state.hoverIndex) {
      // color = this.props.options.colors.selected;
      color =
        this.newShade(this.getColor(box.label), 20) ||
        this.props.options.colors.selected;
    }

    const lineWidth = this.getLineWidth();

    this.props.drawBox(this.canvas, box, color, lineWidth);
    if (box.label != undefined) {
      this.props.drawLabel(this.canvas, box);
    }
  }

  renderBoxes(boxes) {
    if (typeof boxes === 'undefined') {
      boxes = this.scaledBoxes;
    } else {
      boxes = scaleBoxes(boxes);
    }

    if (boxes === null) boxes = [];

    boxes
      .map((box, index) => {
        const selected = index === this.state.hoverIndex;
        return { box, index, selected };
      })
      .sort((a) => {
        return a.selected ? 1 : -1;
      })
      .forEach((box) => this.renderBox(box.box, box.index));
  }

  render() {
    return (
      <div className={this.props.className}>
        <canvas
          className="boundingBoxCanvas"
          style={this.props.options.style}
          ref={(canvas) => {
            this.canvas = canvas;
          }}
        />
        {this.props.separateSegmentation ? (
          <canvas
            className="boundingSegmentationCanvas"
            style={this.props.options.styleSegmentation}
            ref={(canvas) => {
              this.segCanvas = canvas;
            }}
          />
        ) : null}
      </div>
    );
  }
}

Boundingbox.propTypes = {
  image: PropTypes.string,
  boxes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.array),
    PropTypes.arrayOf(PropTypes.object)
  ]),
  selectedIndex: PropTypes.number,
  drawBox: PropTypes.func,
  drawLabel: PropTypes.func,
  onSelected: PropTypes.func,
  options: PropTypes.shape({
    colors: PropTypes.shape({
      normal: PropTypes.string,
      selected: PropTypes.string,
      unselected: PropTypes.string
    }),
    style: PropTypes.object,
    base64Image: PropTypes.bool
  })
};

Boundingbox.defaultProps = {
  boxes: [],
  onSelected() {},
  drawBox(canvas, box, color, lineWidth) {
    if (!box || typeof box === 'undefined') return null;

    const ctx = canvas.getContext('2d');

    const coord = box.coord ? box.coord : box;

    let [x, y, width, height] = [0, 0, 0, 0];

    if (
      typeof coord.xmin !== 'undefined' &&
      typeof coord.xmax !== 'undefined' &&
      typeof coord.ymin !== 'undefined' &&
      typeof coord.ymax !== 'undefined'
    ) {
      // coord is an object containing xmin, xmax, ymin, ymax attributes
      // width is absolute value of (xmax - xmin)
      // height is absolute value of (ymax - ymin)
      // absolute value takes care of various possible referentials:
      //   - sometimes 0,0 is top-left corner
      //   - sometimes 0,0 is bottom-left corner
      [x, y, width, height] = [
        Math.min(coord.xmin, coord.xmax),
        Math.min(coord.ymin, coord.ymax),
        Math.max(coord.xmin, coord.xmax) - Math.min(coord.xmin, coord.xmax),
        Math.max(coord.ymin, coord.ymax) - Math.min(coord.ymin, coord.ymax)
      ];
    } else {
      // coord is an array containing [x, y, width, height] values
      [x, y, width, height] = coord;
    }

    if (x < lineWidth / 2) {
      x = lineWidth / 2;
    }
    if (y < lineWidth / 2) {
      y = lineWidth / 2;
    }

    if (x + width > canvas.width) {
      width = canvas.width - lineWidth - x;
    }
    if (y + height > canvas.height) {
      height = canvas.height - lineWidth - y;
    }

    // Left segment
    const hunderedPercent = width;
    const tenPercent = width / 10;
    const ninetyPercent = 9 * tenPercent;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x + hunderedPercent, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + 0, y + height);
    ctx.stroke();

    // Right segment
    ctx.beginPath();
    ctx.moveTo(x + hunderedPercent, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + 0, y + height);
    ctx.stroke();
  },

  getFontSize(canvas) {
    try {
      return parseInt(canvas.width * 0.025, 10);
    } catch {
      console.log('error');
      return 22;
    }
  },

  drawLabel(canvas, box) {
    if (!box || typeof box === 'undefined') return null;

    const ctx = canvas.getContext('2d');

    const coord = box.coord ? box.coord : box;

    let [x, y, width, height] = [0, 0, 0, 0];

    if (
      typeof coord.xmin !== 'undefined' &&
      typeof coord.xmax !== 'undefined' &&
      typeof coord.ymin !== 'undefined' &&
      typeof coord.ymax !== 'undefined'
    ) {
      // coord is an object containing xmin, xmax, ymin, ymax attributes
      // width is absolute value of (xmax - xmin)
      // height is absolute value of (ymax - ymin)
      // absolute value takes care of various possible referentials:
      //   - sometimes 0,0 is top-left corner
      //   - sometimes 0,0 is bottom-left corner
      [x, y, width, height] = [
        Math.min(coord.xmin, coord.xmax),
        Math.min(coord.ymin, coord.ymax),
        Math.max(coord.xmin, coord.xmax) - Math.min(coord.xmin, coord.xmax),
        Math.max(coord.ymin, coord.ymax) - Math.min(coord.ymin, coord.ymax)
      ];
    } else {
      // coord is an array containing [x, y, width, height] values
      [x, y, width, height] = coord;
    }

    ctx.font = `${this.getFontSize(canvas)}px Arial`;
    ctx.fillStyle = 'rgba(255,255,255,1)';
    // ctx.fillText(box.label, x, y + height);
    ctx.fillText(box.label, x, y - 5);
  },
  options: {
    colors: {
      normal: 'rgba(255,225,255,1)',
      selected: 'rgba(0,225,204,1)',
      unselected: 'rgba(100,100,100,1)'
    },
    style: {
      maxWidth: '100%',
      maxHeight: '90vh'
    },
    base64Image: false
  },
  scale: 1
};

export default Boundingbox;
