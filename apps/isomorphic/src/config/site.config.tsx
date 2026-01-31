import { Metadata } from 'next';
import logoImg from '@public/HIKARI-SKIN-Logo.png';
import { LAYOUT_OPTIONS } from '@/config/enums';
import logoIconImg from '@public/logo-short.svg';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export const siteConfig = {
  title: 'Mingler',
  description: `Isomorphic the ultimate React TypeScript Admin Template. Streamline your admin dashboard development with our feature-rich, responsive, and highly customizable solution. Boost productivity and create stunning admin interfaces effortlessly.`,
  logo: logoImg,
  icon: logoIconImg,
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.BORON,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `${title} - Mingler` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} - Mingler` : title,
      description,
      url: 'https://mingler-admin.vercel.app',
      siteName: 'Mingler', // https://developers.google.com/search/docs/appearance/site-names
      // images: {
      //   url: 'https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/itemdep/isobanner.png',
      //   width: 1200,
      //   height: 630,
      // },
      locale: 'en_IN',
      type: 'website',
    },
  };
};
