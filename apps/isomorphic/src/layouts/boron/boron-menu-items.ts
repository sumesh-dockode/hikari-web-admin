import { DUMMY_ID } from '@/config/constants';
import { routes } from '@/config/routes';
import { MdMiscellaneousServices, MdOutlineLocalOffer } from 'react-icons/md';
import {
  PiAirplaneTiltDuotone,
  PiApplePodcastsLogoDuotone,
  PiArrowsOutDuotone,
  PiArrowsOutLineHorizontalDuotone,
  PiBellSimpleRingingDuotone,
  PiBinocularsDuotone,
  PiBriefcaseDuotone,
  PiBrowserDuotone,
  PiCalendarDuotone,
  PiCalendarPlusDuotone,
  PiCaretCircleUpDownDuotone,
  PiChartBarDuotone,
  PiChartLineUpDuotone,
  PiChartPieSliceDuotone,
  PiChatCenteredDotsDuotone,
  PiClipboardTextDuotone,
  PiCodesandboxLogoDuotone,
  PiCoinDuotone,
  PiCreditCardDuotone,
  PiCurrencyCircleDollarDuotone,
  PiCurrencyDollarDuotone,
  PiEnvelopeDuotone,
  PiEnvelopeSimpleOpenDuotone,
  PiFeatherDuotone,
  PiFolderDuotone,
  PiFolderLockDuotone,
  PiFolderUserDuotone,
  PiGridFourDuotone,
  PiHammerDuotone,
  PiHeadsetDuotone,
  PiHourglassSimpleDuotone,
  PiHouseLineDuotone,
  PiListNumbersDuotone,
  PiLockKeyDuotone,
  PiMapPinLineDuotone,
  PiNewspaperClippingDuotone,
  PiNoteBlankDuotone,
  PiPackageDuotone,
  PiPresentationChartDuotone,
  PiPushPinDuotone,
  PiRocketLaunchDuotone,
  PiScalesDuotone,
  PiShapesDuotone,
  PiShieldCheckDuotone,
  PiShootingStarDuotone,
  PiShoppingCartDuotone,
  PiSparkleDuotone,
  PiSquaresFourDuotone,
  PiStairsDuotone,
  PiStepsDuotone,
  PiTableDuotone,
  PiUserCircleDuotone,
  PiUserDuotone,
  PiUserGearDuotone,
  PiUserPlusDuotone,
  PiArmchairDuotone,
  PiChatTeardropTextDuotone,
  PiShoppingBagDuotone,
  PiContactlessPaymentDuotone,
  PiHouseDuotone,
  PiUserListDuotone,
} from 'react-icons/pi';

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  {
    name: 'Dashboard',
    href: routes.eCommerce.dashboard,
    icon: PiHouseDuotone,
    // shortcut: {
    //   modifiers: 'alt',
    //   key: '5',
    // },
  },

  // label start
  // {
  //   name: 'E-Commerce',
  // },
  // label end
  {
    name: 'Products',
    href: '#',
    icon: PiArmchairDuotone,
    dropdownItems: [
      { name: 'Products', href: routes.eCommerce.products },
      {
        name: 'Product Details',
        href: routes.eCommerce.productDetails(DUMMY_ID),
      },
      {
        name: 'Create Product',
        href: routes.eCommerce.createProduct,
      },
      {
        name: 'Edit Product',
        href: routes.eCommerce.ediProduct(DUMMY_ID),
      },
    ],
  },
  {
    name: 'Categories',
    href: '#',
    icon: PiFolderDuotone,
    dropdownItems: [
      {
        name: 'Categories',
        href: routes.eCommerce.categories,
      },
      {
        name: 'Create Category',
        href: routes.eCommerce.createCategory,
      },
      {
        name: 'Edit Category',
        href: routes.eCommerce.editCategory(DUMMY_ID),
      },
    ],
  },
  {
    name: 'Orders',
    href: '#',
    icon: PiPackageDuotone,
    dropdownItems: [
      {
        name: 'Orders',
        href: routes.eCommerce.orders,
      },
      {
        name: 'Order Details',
        href: routes.eCommerce.orderDetails(DUMMY_ID),
      },
      {
        name: 'Create Order',
        href: routes.eCommerce.createOrder,
      },
      {
        name: 'Edit Order',
        href: routes.eCommerce.editOrder(DUMMY_ID),
      },
    ],
  },
  // {
  //   name: 'Reviews',
  //   href: routes.eCommerce.reviews,
  //   icon: PiChatTeardropTextDuotone,
  // },
  {
    name: 'Sales',
    href: '#',
    icon: PiScalesDuotone,
    dropdownItems: [
      {
        name: 'Salesman',
        href: routes.eCommerce.salesman,
      },
      {
        name: 'Sales History',
        href: routes.eCommerce.salesHistory,
      },
      {
        name: 'Incentives',
        href: routes.eCommerce.incentives,
      },
      {
        name: 'Claim Balance History',
        href: routes.eCommerce.claimBalanceHistory,
      },
    ],
  },
  {
    name: 'User Management',
    href: '#',
    icon: PiUserListDuotone,
    dropdownItems: [
      {
        name: 'Store Manager',
        href: routes.eCommerce.storeManager,
      },
      {
        name: 'Delivery Manager',
        href: routes.eCommerce.deliveryManager,
      },
    ],
  },
  {
    name: 'Promotion',
    href: routes.eCommerce.promotion,
    icon: MdOutlineLocalOffer,
  },
  {
    name: 'Service Booking',
    href: routes.eCommerce.servicebooking,
    icon: MdMiscellaneousServices,
  },

  // label start
  // {
  //   name: 'Authentication',
  // },
  // label end
  // {
  //   name: 'Sign Up',
  //   href: '#',
  //   icon: PiUserPlusDuotone,
  //   dropdownItems: [
  //     {
  //       name: 'Modern Sign up',
  //       href: routes.auth.signUp1,
  //     },
  //     {
  //       name: 'Vintage Sign up',
  //       href: routes.auth.signUp2,
  //     },
  //     {
  //       name: 'Trendy Sign up',
  //       href: routes.auth.signUp3,
  //     },
  //     {
  //       name: 'Elegant Sign up',
  //       href: routes.auth.signUp4,
  //     },
  //     {
  //       name: 'Classic Sign up',
  //       href: routes.auth.signUp5,
  //     },
  //   ],
  // },
  // {
  //   name: 'Sign In',
  //   href: '#',
  //   icon: PiShieldCheckDuotone,
  //   dropdownItems: [
  //     {
  //       name: 'Modern Sign in',
  //       href: routes.auth.signIn1,
  //     },
  //     {
  //       name: 'Vintage Sign in',
  //       href: routes.auth.signIn2,
  //     },
  //     {
  //       name: 'Trendy Sign in',
  //       href: routes.auth.signIn3,
  //     },
  //     {
  //       name: 'Elegant Sign in',
  //       href: routes.auth.signIn4,
  //     },
  //     {
  //       name: 'Classic Sign in',
  //       href: routes.auth.signIn5,
  //     },
  //   ],
  // },
];
