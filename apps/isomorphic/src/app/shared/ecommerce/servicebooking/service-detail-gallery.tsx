'use client';

import { useRouter } from 'next/router';
import Image from 'next/image';
import { Title, Text } from 'rizzui';

const serviceData = [
  {
    id: '1',
    title: 'Service Detail Image',
    description: 'This is a detailed description of the service image.',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/details/1.jpg',
    requestedUser: 'John Doe',
    promocode: 'DISCOUNT50',
    selectedservices: 'Service A, Service B',
    status: 'Completed',
  },
  // Add more data as needed...
];

export default function ServiceDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Find the service by ID
  const service = serviceData.find((item) => item.id === id);

  if (!service) {
    return (
      <p className="mt-10 text-center text-gray-500">Service not found.</p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Image */}
      <div className="relative aspect-[4/4.65] w-full overflow-hidden rounded bg-gray-100">
        <Image
          fill
          priority
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Title & Description */}
      <div className="mt-6">
        <Title as="h2" className="text-2xl font-bold">
          {service.title}
        </Title>
        {/* <Text as="p" className="mt-2 text-gray-600">
          {service.description}
        </Text> */}
      </div>
    </div>
  );
}
