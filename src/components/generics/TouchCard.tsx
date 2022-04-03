import React, { useState } from "react";
import {
  Card,
  CardProps,
  IconButton,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import clone from "lodash/clone";

function TouchCard<C extends React.ElementType>(
  props: CardProps<C, { component?: C, onDelete: () => void }>,
) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 75;
  // the max vertical distance the user can travel before it's probably a scroll and not a delete
  const maxVeticalDistance = 100;

  const isSwiping = () => {
    if (!touchStart || !touchEnd || !touchStartY || !touchEndY) {
      return false;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const distanceY = Math.abs(touchStartY - touchEndY);

    // prevent scrolling from accidentally deleting things
    if (distanceY > maxVeticalDistance) {
      setDeleting(false);
      return;
    }

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
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchEndY(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setDeleting(false);
  }

  const onTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
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

  const widthMatches = useMediaQuery("(max-width:450px)");

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
      {!widthMatches && <IconButton
        onClick={() => props.onDelete()}
        sx={{ position: "absolute", right: 1, bottom: 1}}
      >
        <DeleteForeverIcon />
      </IconButton>}
    </Card>
  )
}

export default TouchCard;
