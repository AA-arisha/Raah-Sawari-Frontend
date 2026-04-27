// src/utils/cloudinary.js
// ✅ FIX #4: Cloudinary direct upload utility
// Free tier: 25GB storage, 25GB bandwidth/month. Images served via CDN URL — easy to display anywhere.
//
// SETUP (one-time):
//   1. Create free account at https://cloudinary.com
//   2. Go to Settings > Upload > Upload presets → Add preset, set to "Unsigned"
//   3. Copy your Cloud Name and the preset name into your .env:
//      VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
//      VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads a File object to Cloudinary and returns the secure URL string.
 * The returned URL can be stored in DB and used directly in <img src={url} />.
 *
 * @param {File} file - The File object from an <input type="file">
 * @param {string} folder - Optional folder name in Cloudinary (e.g. "drivers/cnic")
 * @returns {Promise<string>} Secure HTTPS URL of the uploaded image
 */
export const uploadToCloudinary = async (file, folder = "raah-sawri") => {
  if (!file) throw new Error("No file provided");
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Missing Cloudinary config. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url; // e.g. "https://res.cloudinary.com/your_cloud/image/upload/v.../raah-sawri/xyz.jpg"
};
