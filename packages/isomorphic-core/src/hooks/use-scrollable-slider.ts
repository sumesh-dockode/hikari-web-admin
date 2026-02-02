'use client';

import { useEffect, useRef } from 'react';

export function useScrollableSlider() {
  const sliderEl = useRef<HTMLDivElement | null>(null);
  const sliderPrevBtn = useRef<HTMLButtonElement | null>(null);
  const sliderNextBtn = useRef<HTMLButtonElement | null>(null);

  const scrollToTheRight = () => {
    const slider = sliderEl.current;
    const prevBtn = sliderPrevBtn.current;

    if (!slider || !prevBtn) return;

    const offsetWidth = slider.offsetWidth;
    slider.scrollLeft += offsetWidth / 2;
    prevBtn.classList.remove('opacity-0', 'invisible');
  };

  const scrollToTheLeft = () => {
    const slider = sliderEl.current;
    const nextBtn = sliderNextBtn.current;

    if (!slider || !nextBtn) return;

    const offsetWidth = slider.offsetWidth;
    slider.scrollLeft -= offsetWidth / 2;
    nextBtn.classList.remove('opacity-0', 'invisible');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const slider = sliderEl.current;
    const prevBtn = sliderPrevBtn.current;
    const nextBtn = sliderNextBtn.current;

    if (!slider || !prevBtn || !nextBtn) return;

    const isFormPageHeader =
      slider.classList.contains('formPageHeaderSliderElJS');

    const initNextPrevBtnVisibility = () => {
      const { offsetWidth, scrollWidth } = slider;

      if (scrollWidth > offsetWidth) {
        nextBtn.classList.remove('opacity-0', 'invisible');
        if (isFormPageHeader) {
          slider.classList.add('!-mb-[43px]');
        }
      } else {
        nextBtn.classList.add('opacity-0', 'invisible');
        if (isFormPageHeader) {
          slider.classList.remove('!-mb-[43px]');
        }
      }

      prevBtn.classList.add('opacity-0', 'invisible');
    };

    const visibleNextAndPrevBtnOnScroll = () => {
      const { scrollLeft, offsetWidth, scrollWidth } = slider;

      // Right end
      if (scrollWidth - scrollLeft === offsetWidth) {
        nextBtn.classList.add('opacity-0', 'invisible');
        prevBtn.classList.remove('opacity-0', 'invisible');
      } else {
        nextBtn.classList.remove('opacity-0', 'invisible');
      }

      // Left end
      if (scrollLeft === 0) {
        prevBtn.classList.add('opacity-0', 'invisible');
        nextBtn.classList.remove('opacity-0', 'invisible');
      } else {
        prevBtn.classList.remove('opacity-0', 'invisible');
      }
    };

    initNextPrevBtnVisibility();

    window.addEventListener('resize', initNextPrevBtnVisibility);
    slider.addEventListener('scroll', visibleNextAndPrevBtnOnScroll);

    return () => {
      window.removeEventListener('resize', initNextPrevBtnVisibility);
      slider.removeEventListener('scroll', visibleNextAndPrevBtnOnScroll);
    };
  }, []);

  return {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  };
}
