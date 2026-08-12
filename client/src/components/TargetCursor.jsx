import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

// A position: fixed element is positioned relative to the viewport UNLESS an
// ancestor establishes a containing block (transform, perspective, filter,
// will-change of those, or contain). When that happens, the cursor's translate
// no longer maps to viewport coordinates, so we measure and compensate for it.
const getContainingBlock = element => {
  let node = element?.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = block => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

const TargetCursor = ({
  targetSelector = 'a, button, [data-cursor], .cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);
  const containingBlockRef = useRef(null);

  const isActiveRef = useRef(false);
  const tickerFnRef = useRef(null);
  const activeStrengthRef = useRef(0);
  const quickRef = useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12
    }),
    []
  );

  // The old moveCursor allocated a brand-new gsap.to() tween on EVERY mouse
  // move and called getBoundingClientRect() each time. quickTo reuses a single
  // tween instance and the offset is now read from a cache.
  const moveCursor = useCallback((x, y) => {
    const q = quickRef.current;
    if (!q) return;
    q.x(x - q.offset.x);
    q.y(y - q.offset.y);
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      document.body.classList.add('has-target-cursor');
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    containingBlockRef.current = getContainingBlock(cursor);

    /* ----------------------------------------------------------------
       Cached geometry.
       Previously every animation tick did TWO getBoundingClientRect()
       calls (the hovered target + the containing block) plus an
       elementFromPoint() on every scroll event. Those all force
       synchronous layout / hit-testing, and the cost scales with how
       much of the document is on screen — which is exactly why the page
       felt fine in a small window and janky maximised.

       Now geometry is measured on enter, and only re-measured when the
       page actually scrolls or resizes.
    ---------------------------------------------------------------- */
    let offset = getContainingBlockOffset(containingBlockRef.current);
    let activeRect = null;
    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;

    quickRef.current = {
      x: gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power3.out' }),
      y: gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power3.out' }),
      offset
    };

    const refreshOffset = () => {
      offset = getContainingBlockOffset(containingBlockRef.current);
      quickRef.current.offset = offset;
    };

    const measureTarget = () => {
      activeRect = activeTarget ? activeTarget.getBoundingClientRect() : null;
    };

    const cleanupTarget = target => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    const checkTarget = element => {
      let current = element;
      while (current && current !== document.body) {
        if (current.matches && current.matches(targetSelector)) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - offset.x,
      y: window.innerHeight / 2 - offset.y
    });

    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    // Pure math now — zero layout reads per frame.
    const tickerFn = () => {
      if (!activeRect || !cursorRef.current || !cornersRef.current) return;

      const strength = activeStrengthRef.current;
      if (strength === 0) return;

      const { borderWidth, cornerSize } = constants;
      const rect = activeRect;

      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');

      const left = rect.left - borderWidth - offset.x;
      const top = rect.top - borderWidth - offset.y;
      const right = rect.right + borderWidth - cornerSize - offset.x;
      const bottom = rect.bottom + borderWidth - cornerSize - offset.y;

      const basePositions = [
        { x: left, y: top },
        { x: right, y: top },
        { x: right, y: bottom },
        { x: left, y: bottom }
      ];

      let parallaxX = 0;
      let parallaxY = 0;
      if (parallaxOn) {
        const targetCenterX = rect.left + rect.width / 2 - offset.x;
        const targetCenterY = rect.top + rect.height / 2 - offset.y;
        parallaxX = (cursorX - targetCenterX) * 0.08;
        parallaxY = (cursorY - targetCenterY) * 0.08;
      }

      const corners = cornersRef.current;
      for (let i = 0; i < corners.length; i++) {
        const corner = corners[i];
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');

        const targetX = basePositions[i].x - cursorX + parallaxX;
        const targetY = basePositions[i].y - cursorY + parallaxY;

        gsap.set(corner, {
          x: currentX + (targetX - currentX) * strength,
          y: currentY + (targetY - currentY) * strength
        });
      }
    };

    tickerFnRef.current = tickerFn;

    /* -------- pointer move: coalesced into one frame -------- */
    let moveFrame = 0;
    let pendingX = 0;
    let pendingY = 0;
    let pendingTargetCheck = false;

    const flushMove = () => {
      moveFrame = 0;
      moveCursor(pendingX, pendingY);
      if (pendingTargetCheck && !activeTarget) {
        const el = document.elementFromPoint(pendingX, pendingY);
        const target = el && checkTarget(el);
        if (target) enterHandler({ target });
      }
      pendingTargetCheck = false;
    };

    const moveHandler = e => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!activeTarget) pendingTargetCheck = true;
      if (!moveFrame) moveFrame = requestAnimationFrame(flushMove);
    };
    window.addEventListener('pointermove', moveHandler, { passive: true });

    /* -------- scroll: re-measure cheaply, hit-test at most ~10x/s --------
       Lenis emits a scroll event every single frame, so the original
       elementFromPoint() call here ran 60x/second over the full document. */
    let scrollFrame = 0;
    let lastHitTest = 0;

    const flushScroll = () => {
      scrollFrame = 0;
      refreshOffset();

      if (activeTarget) {
        measureTarget();
      }

      const now = performance.now();
      if (now - lastHitTest < 100) return;
      lastHitTest = now;

      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');
      const mouseX = cursorX + offset.x;
      const mouseY = cursorY + offset.y;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);

      if (activeTarget) {
        const stillOver =
          elementUnderMouse &&
          (elementUnderMouse === activeTarget ||
            elementUnderMouse.closest(targetSelector) === activeTarget);
        if (!stillOver && currentLeaveHandler) currentLeaveHandler();
      } else if (elementUnderMouse) {
        const target = checkTarget(elementUnderMouse);
        if (target) enterHandler({ target });
      }
    };

    const scrollHandler = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(flushScroll);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = e => {
      const target = e.target ? checkTarget(e.target) : null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      measureTarget();

      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner, 'x,y'));

      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      if (cursorColorOnTarget) {
        gsap.to(corners, { borderColor: cursorColorOnTarget, duration: 0.15, ease: 'power2.out' });
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColorOnTarget,
            duration: 0.15,
            ease: 'power2.out'
          });
        }
      }

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current);

      gsap.to(activeStrengthRef, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current);

        isActiveRef.current = false;
        gsap.set(activeStrengthRef, { current: 0, overwrite: true });
        activeTarget = null;
        activeRect = null;

        if (cursorColorOnTarget && cornersRef.current) {
          gsap.to(Array.from(cornersRef.current), {
            borderColor: cursorColor,
            duration: 0.15,
            ease: 'power2.out'
          });
          if (dotRef.current) {
            gsap.to(dotRef.current, {
              backgroundColor: cursorColor,
              duration: 0.15,
              ease: 'power2.out'
            });
          }
        }

        if (cornersRef.current) {
          const cs = Array.from(cornersRef.current);
          gsap.killTweensOf(cs, 'x,y');
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];
          const tl = gsap.timeline();
          cs.forEach((corner, index) => {
            tl.to(corner, { ...positions[index], duration: 0.3, ease: 'power3.out' }, 0);
          });
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(cursorRef.current, 'rotation');
            const normalizedRotation = currentRotation % 360;
            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => spinTl.current?.restart()
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    let resizeFrame = 0;
    const resizeHandler = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        containingBlockRef.current = getContainingBlock(cursor);
        refreshOffset();
        measureTarget();
      });
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      if (moveFrame) cancelAnimationFrame(moveFrame);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      if (resumeTimeout) clearTimeout(resumeTimeout);

      window.removeEventListener('pointermove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);

      if (activeTarget) cleanupTarget(activeTarget);

      spinTl.current?.kill();
      quickRef.current = null;
      document.body.style.cursor = originalCursor;
      document.body.classList.remove('has-target-cursor');

      isActiveRef.current = false;
      activeStrengthRef.current = 0;
    };
  }, [
    targetSelector,
    spinDuration,
    moveCursor,
    constants,
    hideDefaultCursor,
    isMobile,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget
  ]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <div className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>
  );
};

export default TargetCursor;
