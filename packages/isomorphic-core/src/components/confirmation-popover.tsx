"use client";

import { Title, Text, ActionIcon, Button, Popover, Tooltip } from "rizzui";
import { PiCheckBold, PiTrashFill } from "react-icons/pi";

type ConfirmationPopoverProps = {
  title: string;
  description: string;
  onConfirm?: () => void;
};

export default function ConfirmationPopover({
  title,
  description,
  onConfirm,
}: ConfirmationPopoverProps) {
  return (
    <Popover placement="left">
      <Popover.Trigger>
        <Tooltip size="sm" content="Approve" placement="top" color="invert">
          <ActionIcon
            size="sm"
            variant="outline"
            aria-label={"Confirm Action"}
            className="cursor-pointer"
          >
            <PiCheckBold className="size-4" />
          </ActionIcon>
        </Tooltip>
      </Popover.Trigger>
      <Popover.Content className="z-10">
        {({ setOpen }) => (
          <div className="w-56 pb-2 pt-1 text-left rtl:text-right">
            <Title
              as="h6"
              className="mb-0.5 flex items-start text-sm text-gray-700 sm:items-center"
            >
              <PiTrashFill className="me-1 size-[17px]" /> {title}
            </Title>
            <Text className="mb-2 leading-relaxed text-gray-500">
              {description}
            </Text>
            <div className="flex items-center justify-end">
              <Button
                size="sm"
                className="me-1.5 h-7"
                onClick={() => {
                  onConfirm && onConfirm();
                  setOpen(false);
                }}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() => setOpen(false)}
              >
                No
              </Button>
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
}
