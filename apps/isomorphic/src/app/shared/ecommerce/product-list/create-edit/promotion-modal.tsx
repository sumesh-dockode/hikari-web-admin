import { useFormContext } from 'react-hook-form';
import UploadZone from '@core/ui/file-upload/upload-zone';
import FormGroup from '@/app/shared/form-group';
import { Form } from '@core/ui/form';
import HorizontalFormBlockWrapper from '@/app/shared/account-settings/horiozontal-block';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: {
    id: number;
    productname: string;
    promotionmedium: string;
    comments: string;
  };
}

export default function PromotionModal({
  isOpen,
  onClose,
}: PromotionModalProps) {
  const { getValues, setValue, watch } = useFormContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6">
        <HorizontalFormBlockWrapper
          title="Upload new  icon"
          description="Upload your product icon here"
        >
          <UploadZone
            name="icons"
            getValues={getValues}
            setValue={setValue}
            watch={watch}
            className="col-span-full"
          />
        </HorizontalFormBlockWrapper>
        <button
          onClick={onClose}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
