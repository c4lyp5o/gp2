import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};
const Card = ({ index, id, axis, text, moveCardX, moveCardY }) => {
  const ref = useRef(null);
  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop(item, monitor) {
      if (!ref.current) {
        return;
      }
      const axis = item.axis;
      const dragIndex = item.index;
      const hoverIndex = index;
      // For X axis
      if (axis === 'x') {
        // if (dragIndex === hoverIndex) {
        //   return;
        // }
        moveCardX(dragIndex, hoverIndex);
        // item.index = hoverIndex;
      }
      // For Y axis
      if (axis === 'y') {
        // if (dragIndex === hoverIndex) {
        //   return;
        // }
        moveCardY(dragIndex, hoverIndex);
        // item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  const [, drag] = useDrag({
    type: 'CARD',
    item: { id, index, axis },
  });
  drag(drop(ref));
  return (
    <>
      <div style={{ border: `1px solid ${isOver ? 'blue' : 'transparent'}` }} />
      <div ref={ref} style={{ ...style }}>
        {text}
      </div>
    </>
  );
};
export default Card;
