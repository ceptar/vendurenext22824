import React, {
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const [page, setPage] = useState<number>(0);

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

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const offsetX = useMotionValue(0);
  const animatedX = useSpring(offsetX, {
    damping: 20,
    stiffness: 150,
  });

  const handleDragSnap = (
    _: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: Pick<PanInfo, 'offset' | 'velocity'>, 
  ) => {
    if (!carouselRef.current || !containerRef.current) return;

    console.clear();

    const swipe = swipePower(offset.x, velocity.x);
    const isRightDirection = offset.x > 45 && velocity.x >= 0;
    const isLeftDirection = offset.x < -45 && velocity.x <= 0;

    const childW = (carouselRef.current.offsetWidth - gapSum) / CAROUSEL_LENGTH;

    const carouselDiments = carouselRef.current.getBoundingClientRect();
    const containerDiments = containerRef.current.getBoundingClientRect();

    const isPassedBoundaries =
      containerDiments.right > carouselDiments.right - childW;

    let newCurrIndex = currIndex;
    let switchSlideBy = Math.ceil(-offset.x / (childW + GAP));

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

    // If carousel has passed the boundaries of a container
    if (isPassedBoundaries && currIndex <= newCurrIndex) {
      const rightEdge =
        -carouselRef.current.offsetWidth + containerRef.current.offsetWidth;

      controls.start({ x: rightEdge });
    } else {
      controls.start({ x: -calcX(newCurrIndex) });
    }
  };

  // Update event type to match the expected type
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    handleDragSnap(event, info); 
    setIsDragging(false); // Set isDragging to false when drag ends
  };

  const disableDragClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const canScrollPrev = (): boolean => {
    return offsetX.get() < 0;
  };

  const canScrollNext = (): boolean => {
    if (!containerRef.current || !carouselRef.current) return false;

    const containerWidth = containerRef.current.offsetWidth;
    const carouselWidth = carouselRef.current.scrollWidth;
    return offsetX.get() > -(carouselWidth - containerWidth);
  };

  useEffect(() => {
    controls.set({ x: -calcX(currIndex) });
  }, [currIndex, controls]);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    if (!containerRef.current || !carouselRef.current) return;

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
        onDragEnd={handleDragEnd} // Updated type for event
        onDrag={handleDrag} // Updated type for event
        style={{
          display: 'flex',
          gap: GAP,
          width: 'max-content',
        }}
      >
        {featuredItems.map((product: ProductItem, index) => (
          <div
            key={index} 
            className="relative flex-shrink-0 flex flex-col items-center justify-center b-radius-0 
            w-[calc(100vw-48px)] sm:w-[calc(50vw-32px)] lg:w-[calc(25vw-24px)]"
          >
            <DiscoProductCard product={product} />
            <Link
              href={`/product/${product.slug}`}
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
              onMouseDown={(e) => e.preventDefault()}
              onClick={disableDragClick}
            ></Link>
          </div>
        ))}
      </motion.div>
    </div>
  );
}