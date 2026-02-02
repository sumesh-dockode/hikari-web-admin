'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AddProductPopup() {
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<File | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');

  const [title1, setTitle1] = useState('');
  const [title1Desc, setTitle1Desc] = useState('');

  const [title2, setTitle2] = useState('');
  const [title2Desc, setTitle2Desc] = useState('');

  const [title3, setTitle3] = useState('');
  const [title3Desc, setTitle3Desc] = useState('');

  const [title4, setTitle4] = useState('');
  const [title4Desc, setTitle4Desc] = useState('');

  useEffect(() => {
    if (open) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [open]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => setOpen(false), 200);
  };

  const resetForm = () => {
    setImage(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setTitle1('');
    setTitle1Desc('');
    setTitle2('');
    setTitle2Desc('');
    setTitle3('');
    setTitle3Desc('');
    setTitle4('');
    setTitle4Desc('');
  };

  const handleSubmit = async () => {
    if (
      !image ||
      !title ||
      !subtitle ||
      !description ||
      !title1 ||
      !title1Desc ||
      !title2 ||
      !title2Desc ||
      !title3 ||
      !title3Desc ||
      !title4 ||
      !title4Desc
    ) {
      toast('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast('Access token missing');
        return;
      }

      const formData = new FormData();

      formData.append('name', title);
      formData.append('sku', subtitle); 
      formData.append('description', description);

      formData.append('image', image);

      formData.append('title1', title1);
      formData.append('title1Desc', title1Desc);
      formData.append('title2', title2);
      formData.append('title2Desc', title2Desc);
      formData.append('title3', title3);
      formData.append('title3Desc', title3Desc);
      formData.append('title4', title4);
      formData.append('title4Desc', title4Desc);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/products/`, 
        {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const result = await res.json().catch(() => null) as any;

      if (!res.ok) {
        toast(result?.message || 'Create failed');
        return;
      }

      console.log('Created Product Response:', result);

      toast(result?.message || 'Created successfully');

      resetForm();
      handleClose();
    } catch (error) {
      console.log('Create Product Error:', error);
      toast('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200';

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 transition"
      >
        + Add Product
      </button>

      {/* Popup */}
      {open && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-200 ${
            animate ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        >
          {/* Modal Box */}
          <div
            className={`w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl transform transition-all duration-200 ${
              animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Product
                </h2>
                <p className="text-sm text-gray-500">
                  Fill details and submit the product.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="h-9 w-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Product Image
                </h3>

                <label className={labelClass}>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
                {image && (
                  <p className="mt-2 text-xs text-gray-500">
                    Selected File:{' '}
                    <span className="font-medium">{image.name}</span>
                  </p>
                )}
              </div>

              {/* Main Info */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Product Info
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter product title"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Subtitle</label>
                    <input
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Enter product subtitle"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write product description..."
                    rows={4}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Sections Title 1-4 */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Product Sections
                </h3>

                {/* Title 1 */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
                  <p className="mb-3 text-sm font-semibold text-gray-800">
                    Section 1
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Title 1</label>
                      <input
                        value={title1}
                        onChange={(e) => setTitle1(e.target.value)}
                        placeholder="Enter title 1"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Title 1 Description</label>
                      <input
                        value={title1Desc}
                        onChange={(e) => setTitle1Desc(e.target.value)}
                        placeholder="Enter title 1 description"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Title 2 */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
                  <p className="mb-3 text-sm font-semibold text-gray-800">
                    Section 2
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Title 2</label>
                      <input
                        value={title2}
                        onChange={(e) => setTitle2(e.target.value)}
                        placeholder="Enter title 2"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Title 2 Description</label>
                      <input
                        value={title2Desc}
                        onChange={(e) => setTitle2Desc(e.target.value)}
                        placeholder="Enter title 2 description"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Title 3 */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
                  <p className="mb-3 text-sm font-semibold text-gray-800">
                    Section 3
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Title 3</label>
                      <input
                        value={title3}
                        onChange={(e) => setTitle3(e.target.value)}
                        placeholder="Enter title 3"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Title 3 Description</label>
                      <input
                        value={title3Desc}
                        onChange={(e) => setTitle3Desc(e.target.value)}
                        placeholder="Enter title 3 description"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Title 4 */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-3 text-sm font-semibold text-gray-800">
                    Section 4
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Title 4</label>
                      <input
                        value={title4}
                        onChange={(e) => setTitle4(e.target.value)}
                        placeholder="Enter title 4"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Title 4 Description</label>
                      <input
                        value={title4Desc}
                        onChange={(e) => setTitle4Desc(e.target.value)}
                        placeholder="Enter title 4 description"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t px-6 py-4">
              <button
                disabled={loading}
                onClick={() => {
                  resetForm();
                  handleClose();
                }}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-pink-600 transition disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
