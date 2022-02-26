import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardProps,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import clone from "lodash/clone";

function TouchCard<C extends React.ElementType>(
  props: CardProps<C, { component?: C, onDelete: () => void }>,
) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 75;

  const isSwiping = () => {
    if (!touchStart || !touchEnd) {
      return false;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      if (!deleting) {
        setDeleting(true);
      }
    } else {
      if (deleting) {
        setDeleting(false);
      }
    }

    return isLeftSwipe || isRightSwipe;
  }

  const onTouchStart = (e: any) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
    setDeleting(false);
  }

  const onTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
    isSwiping();
  }

  const onTouchEnd = () => {
    const swiping = isSwiping();
    if (swiping) {
      props.onDelete();
    }
  }

  // clean up the custom props added for touch events
  const cleanProps = clone(props);
  delete (cleanProps as any).onDelete;

  return (
    <Card {...cleanProps}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {deleting &&
        <DeleteForeverIcon
          color="error"
          sx={{ position: "absolute", mt: "32px", fontSize: 80, right: 1, zIndex: 999 }}
        />}
      {props.children}
    </Card>
  )
}

export default TouchCard;