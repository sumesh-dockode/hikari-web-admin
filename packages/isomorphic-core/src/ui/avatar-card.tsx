"use client";

import { Text, Avatar, AvatarProps } from "rizzui";
import cn from "../utils/class-names";

interface AvatarCardProps {
  src: string;
  name: string;
  className?: string;
  nameClassName?: string;
  avatarProps?: AvatarProps;
  description?: React.ReactNode;
  descriptionClassName?: string;
}

export default function AvatarCard({
  src,
  name,
  className,
  description,
  avatarProps,
  nameClassName,
  descriptionClassName,
}: AvatarCardProps) {
  return (
    <figure className={cn("flex items-center gap-3", className)}>
      <Avatar name={name} src={src} {...avatarProps} />
      <figcaption className="grid gap-0.5">
        <Text
          className={cn(
            "font-lexend text-sm font-medium text-gray-900 dark:text-gray-700",
            nameClassName
          )}
        >
          {name}
        </Text>
        {description && (
          <Text
            className={cn("text-[13px] text-gray-500", descriptionClassName)}
          >
            {description}
          </Text>
        )}
      </figcaption>
    </figure>
  );
}
