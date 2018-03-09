import React from 'react';
import { posesToStyles } from './utils';
import pose from 'popmotion-pose';

export default class PoseElement extends React.PureComponent {
  constructor(props) {
    super(props);
    const { poses, current } = props;
    this.style = poses && current ? posesToStyles(poses[current]) : {};
  }

  componentDidMount() {
    if (!this.ref) return;

    this.poser = pose(this.ref, this.getPoseProps());
  }

  componentDidUpdate({ current: prevCurrent }) {
    const { current } = this.props;
    if (prevCurrent !== current) this.poser.set(current);
  }

  componentWillUnmount() {
    if (this.poser) this.poser.destroy();
  }

  setRef = (ref) => this.ref = ref;

  getPoseProps() {
    const { elementType, children, draggable, poses, current } = this.props;

    return {
      draggable,
      initialPose: current,
      ...poses
    };
  }

  getDomProps({
    draggable,
    poses,
    current,
    style,
    ...props
  }) {
    props.style = { ...style, ...this.style };
    props.ref = this.setRef;
    return props;
  }

  render() {
    const { elementType, children, ...remaining } = this.props;

    return React.createElement(
      elementType,
      this.getDomProps(remaining),
      ...children
    );
  }
}
