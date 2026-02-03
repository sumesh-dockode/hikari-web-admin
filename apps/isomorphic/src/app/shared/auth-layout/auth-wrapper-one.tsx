'use client';

import logoImg from '@public/HIKARI-SKIN-Logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiArrowLeftBold } from 'react-icons/pi';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import OrSeparation from '@/app/shared/auth-layout/or-separation';

export default function AuthWrapperThree({
  children,
  title,
  isSocialLoginActive = false,
  isSignIn = false,
  className = '',
  bannerTitle,
  bannerDescription,
  pageImage,
  description,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  isSocialLoginActive?: boolean;
  isSignIn?: boolean;
  className?: string;
  bannerTitle?: string;
  bannerDescription?: string;
  pageImage?: React.ReactNode;
  description?: string;
}) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="relative flex w-full items-center justify-center max-w-2xl">
          <div className="w-full border border-gray-200 rounded-lg shadow-lg p-8 bg-white dark:bg-gray-900 dark:border-gray-700">
            <div className="mb-7 text-center xl:mb-8 2xl:mb-10">
              <Link
                href={'/'}
                className="mb-6 inline-flex max-w-[168px] xl:mb-8"
              >
                <Image src={logoImg} alt="Isomorphic" />
              </Link>
              <Title
                as="h2"
                className="mb-5 text-[26px] leading-snug md:text-3xl md:!leading-normal lg:mb-7 lg:pe-16 lg:text-[28px] xl:text-3xl 2xl:pe-8 2xl:text-4xl"
              >
                {title}
              </Title>
              <Text className="leading-[1.85] text-gray-700 md:leading-loose lg:pe-8 2xl:pe-14">
                {description}
              </Text>
            </div>
            {children}
          </div>
        </div>

      </div>
    </>
  );
}
