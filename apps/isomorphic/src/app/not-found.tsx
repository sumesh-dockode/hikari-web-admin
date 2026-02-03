import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'rizzui/button';
import { Title } from 'rizzui/typography';
import { PiHouseLineBold } from 'react-icons/pi';
import SocialItems from '@core/ui/social-shares';
import { siteConfig } from '@/config/site.config';
import NotFoundImg from '@public/not-found.png';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <div className="sticky top-0 z-40 flex justify-center py-5 backdrop-blur-lg lg:backdrop-blur-none xl:py-10">
        <Link href="/">
          <Image 
            src={siteConfig.logo}
            alt={siteConfig.title}
            className="dark:invert w-20 "
            priority
          />
        </Link>
      </div>

      <div className="flex grow items-center px-6 xl:px-10">
        <div className="mx-auto text-center">
          <Image
            src={NotFoundImg}
            alt="not found"
            className="mx-auto mb-8 aspect-[360/326] max-w-[256px] xs:max-w-[370px] lg:mb-12 2xl:mb-16"
          />
          <Title
            as="h1"
            className="text-[22px] font-bold leading-normal text-gray-1000 lg:text-3xl"
          >
            Sorry, the page not found
          </Title>
          <Link href={'/'}>
            <Button
              as="span"
              size="xl"
              // color="primary"
              className="mt-8 h-12 bg-secondary1 hover:bg-secondary2 px-4 xl:h-14 xl:px-6"
            >
              <PiHouseLineBold className="mr-1.5 text-lg " />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
