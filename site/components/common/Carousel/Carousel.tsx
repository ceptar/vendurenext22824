import React, {
  MouseEvent as ReactMouseEvent,
  useRef,
  useState,
  useEffect,
} from 'react';
import type { PanInfo } from 'framer-motion';
import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { wrap } from 'popmotion';
import Link from 'next/link';
import { ProductItem } from '@components/collections/interfaces';
import DiscoProductCard from '@components/_discoproducts/DiscoProductCard';

const DRAG_THRESHOLD = 150;
const FALLBACK_WIDTH = 509;

export default function Carousel({ featuredItems }: { featuredItems: ProductItem[] }) {
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const CAROUSEL_LENGTH = featuredItems.length;
  const GAP = 16;
  const gapSum = (CAROUSEL_LENGTH - 1) * GAP;

  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const controls = useAnimation();
  const [page, setPage] = useState(0);

  const currIndex = wrap(0, CAROUSEL_LENGTH, page);

  const paginate = (newDirection: number) => {
    setPage((p) => p + newDirection);
  };

  const calcX = (index: number) => {
    if (!carouselRef.current) return 0;

    const childWidth =
      (carouselRef.current.offsetWidth - gapSum) / CAROUSEL_LENGTH;
    return index * childWidth + index * GAP;
  };

  const [isDragging, setIsDragging] = useState(false);
  const offsetX = useMotionValue(0);
  const animatedX = useSpring(offsetX, {
    damping: 20,
    stiffness: 150,
  });

  const handleDragSnap = (
    _: MouseEvent,
    { offset: { x: offsetX }, velocity: { x: velocityX } }: PanInfo,
  ) => {
    if (!carouselRef.current || !containerRef.current) return;

    console.clear();

    const swipe = swipePower(offsetX, velocityX);
    const isRightDirection = offsetX > 45 && velocityX >= 0;
    const isLeftDirection = offsetX < -45 && velocityX <= 0;

    const childW = (carouselRef.current.offsetWidth - gapSum) / CAROUSEL_LENGTH;

    const carouselDiments = carouselRef.current.getBoundingClientRect();
    const containerDiments = containerRef.current.getBoundingClientRect();

    const isPassedBoundaries =
      containerDiments.right > carouselDiments.right - childW;

    let newCurrIndex = currIndex;
    let switchSlideBy = Math.ceil(-offsetX / (childW + GAP));

    if (swipe > swipeConfidenceThreshold || isRightDirection) {
      switchSlideBy = switchSlideBy - 1;

      newCurrIndex = currIndex > 0 ? currIndex + switchSlideBy : currIndex;
      if (newCurrIndex < 0) newCurrIndex = 0;

      const indexDiff = newCurrIndex - currIndex;
      if (indexDiff < 0) {
        switchSlideBy = indexDiff;
      }

      if (currIndex > newCurrIndex) {
        paginate(switchSlideBy);
      }
    } else if (swipe > swipeConfidenceThreshold || isLeftDirection) {
      const lastIndex = CAROUSEL_LENGTH - 1;

      newCurrIndex =
        currIndex < lastIndex ? currIndex + switchSlideBy : currIndex;
      if (newCurrIndex > lastIndex) newCurrIndex = lastIndex;
      if (isPassedBoundaries) {
        const childrenOnScreen = Math.floor(
          containerRef.current.offsetWidth / childW,
        );
        newCurrIndex = CAROUSEL_LENGTH - childrenOnScreen;
      }

      const indexDiff = newCurrIndex - currIndex;
      if (switchSlideBy > indexDiff) {
        switchSlideBy = indexDiff;
      }

      if (currIndex < newCurrIndex) {
        paginate(switchSlideBy);
      }
    }

    // if carousel has passed the boundaries of a container
    if (isPassedBoundaries && currIndex <= newCurrIndex) {
      const rightEdge =
        -carouselRef.current.offsetWidth + containerRef.current.offsetWidth;
        
        // ACHTUNG MIT ZEILE DARÜBER DEN RECHTEN RAND EINSTELLEN !!!

      controls.start({ x: rightEdge });
    } else {
      controls.start({ x: -calcX(newCurrIndex) });
    }
  };

  const handleDragEnd = (event, { velocity, offset }) => {
    handleDragSnap(event, { offset, velocity });
    setIsDragging(false); // Set isDragging to false when drag ends
  };

  const disableDragClick = (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const canScrollPrev = () => {
    return offsetX.get() < 0;
  };

  const canScrollNext = () => {
    const containerWidth = containerRef.current.offsetWidth;
    const carouselWidth = carouselRef.current.scrollWidth;
    return offsetX.get() > -(carouselWidth - containerWidth);
  };

  useEffect(() => {
    controls.set({ x: -calcX(currIndex) });
  }, [currIndex, controls]);

  const handleDrag = (event, info) => {
    const { offset } = info;
    const containerWidth = containerRef.current.offsetWidth;
    const carouselWidth = carouselRef.current.scrollWidth;
    const newOffset = offsetX.get() + offset.x;

    if (newOffset > 0) {
      offsetX.set(0);
    } else if (newOffset < -(carouselWidth - containerWidth)) {
      offsetX.set(-(carouselWidth - containerWidth));
    } else {
      offsetX.set(newOffset);
    }

    setIsDragging(true); // Set isDragging to true when drag starts
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        overflowX: 'hidden',
        paddingLeft: 0, 

        paddingTop: 32,
        paddingBottom: 32,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <motion.div
        ref={carouselRef}
        drag="x"
        animate={controls}
        transition={{
          type: 'spring',
          damping: 40,
          stiffness: 400,
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        style={{
          display: 'flex',
          gap: GAP,
          width: 'max-content',
        }}
      >
{featuredItems.map((product: ProductItem, index) => (          <div
            key={index} // Prefer using a unique product identifier here
            className="relative flex-shrink-0 flex flex-col items-center justify-center b-radius-0 
            w-[calc(100vw-32px)] sm:w-[calc(50vw-24px)] lg:w-[calc(25vw-16px)]
            "
 /* darüber nach " einsetzen!         w-[calc(100vw-30px)] sm:w-[calc(50vw-25px)] lg:w-[calc(33vw-20px)] */
//mit diesen größen lässt sich die anzahl an cards je nach zb screengröße einstellen

          >
    <DiscoProductCard product={product} />
            <Link
              href={`/product/${product.slug}`} // Use the slug from the product data
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                zIndex: 1,
                cursor: 'pointer',
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent drag image behavior
              onClick={disableDragClick}
            ></Link>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
