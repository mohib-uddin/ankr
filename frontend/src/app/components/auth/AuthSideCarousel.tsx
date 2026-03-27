import React, { ReactNode, useEffect, useState } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";

type AuthSlide = {
  image: string;
  overlayStop: number;
  heading: ReactNode;
};

type AuthSideCarouselProps = {
  slides: AuthSlide[];
  initialIndex: number;
};

export function AuthSideCarousel({ slides, initialIndex }: AuthSideCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (!api || slides.length <= 1) {
      return;
    }

    api.scrollTo(initialIndex, true);
    setActiveIndex(initialIndex);

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      window.clearInterval(interval);
      api.off("select", onSelect);
    };
  }, [api, initialIndex, slides.length]);

  return (
    <div className="hidden h-full xl:flex xl:w-[min(47vw,731px)] xl:shrink-0">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="relative h-full w-full overflow-hidden rounded-br-[24px] rounded-tr-[24px] [&>[data-slot='carousel-content']]:h-full [&_[data-slot='carousel-item']]:h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={`${slide.image}-${index}`} className="pl-0 h-full">
              <div className="relative h-full w-full">
                <img alt="" className="h-full w-full object-cover" src={slide.image} />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.85) 17.77%, rgba(0,0,0,0) ${slide.overlayStop}%)`,
                  }}
                />

                <div className="absolute bottom-[36px] left-[46px] right-[46px]">
                  <div className="flex max-w-[488px] flex-col gap-[32px]">
                    <div className="font-['Canela_Text_Trial',sans-serif] text-[36px] font-medium leading-[normal] not-italic text-white whitespace-pre-line">
                      {slide.heading}
                    </div>

                    <div className="flex items-center gap-[20px]">
                      {slides.map((_, pillIndex) => (
                        <button
                          key={pillIndex}
                          type="button"
                          aria-label={`Go to slide ${pillIndex + 1}`}
                          onClick={() => api?.scrollTo(pillIndex)}
                          className={`h-[6px] w-[75px] rounded-[100px] transition-colors ${
                            activeIndex === pillIndex ? "bg-[#764d2f]" : "bg-[#d9d9d9]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
