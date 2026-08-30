import React from 'react';
import { Trash2, Upload } from 'lucide-react';
import { uploadFileToSupabaseStorage } from '../../../utils/cloudSync';
import { normalizeImageUrl, compressImageFile } from '../../../utils/eventStatus';

export default function EventPhotoItem({
  imgObj,
  idx,
  targetEvent,
  eventForm,
  handleRemoveImageField,
  handleImageFieldChange
}) {
  return (
    <div className="p-2.5 rounded-lg bg-[#0B0E14] border border-white/10 space-y-2 relative group">
      <div className="flex items-center justify-between text-[11px] font-bold text-white/80">
        <span>
          Photo #{idx + 1} {idx === 0 ? '(Main Cover Photo)' : ''}
        </span>

        <button
          type="button"
          onClick={() => handleRemoveImageField(idx)}
          className="text-red-400 hover:text-red-300 p-1 flex items-center gap-1 bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded"
          title="Remove / delete photo"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px]">Remove Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold text-[#FFD700]">
              Image URL *
            </label>

            <label className="cursor-pointer text-[10px] font-extrabold text-[#FFD700] hover:text-white bg-[#FF5722]/30 hover:bg-[#FF5722]/60 border border-[#FF5722]/60 px-2 py-0.5 rounded flex items-center gap-1 transition-colors shadow">
              <Upload className="w-3 h-3 text-[#FFD700]" />

              <span>📁 Upload from PC</span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  try {
                    const eventFolder =
                      targetEvent?.id || eventForm.title || 'event';

                    const storageRes = await uploadFileToSupabaseStorage(
                      file,
                      eventFolder
                    );

                    if (storageRes.success && storageRes.publicUrl) {
                      handleImageFieldChange(idx, 'url', storageRes.publicUrl);
                    } else {
                      console.warn(
                        'Supabase storage upload failed:',
                        storageRes.message
                      );

                      const compressedDataUrl = await compressImageFile(file);

                      handleImageFieldChange(idx, 'url', compressedDataUrl);

                      alert(
                        `⚠️ Could not upload directly to Supabase Storage (${storageRes.message || 'Check Admin -> Cloud Sync credentials & Storage RLS policies'}). Image saved to browser cache.`
                      );
                    }
                  } catch (err) {
                    console.error(err);

                    const compressedDataUrl = await compressImageFile(file);

                    handleImageFieldChange(idx, 'url', compressedDataUrl);
                  }

                  e.target.value = '';
                }}
              />
            </label>
          </div>

          <input
            type="text"
            value={imgObj.url}
            onChange={e => handleImageFieldChange(idx, 'url', e.target.value)}
            onBlur={e =>
              handleImageFieldChange(
                idx,
                'url',
                normalizeImageUrl(e.target.value)
              )
            }
            placeholder="https://... or click Upload from PC"
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#141923] border border-[#D4AF37]/40 text-white text-xs font-mono"
          />

          <span className="text-[9px] text-[#94A3B8] block mt-0.5">
            💡 Tip: Click "📁 Upload from PC" to select a photo from your computer, or paste a URL!
          </span>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#FFD700] block mb-0.5">
            Caption / Title
          </label>

          <input
            type="text"
            value={imgObj.caption}
            onChange={e =>
              handleImageFieldChange(idx, 'caption', e.target.value)
            }
            placeholder="e.g. Malayappa swami Chinna Sesha Vahanam"
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#141923] border border-[#D4AF37]/40 text-white text-xs"
          />
        </div>
      </div>

      {imgObj.url && (
        <div className="h-20 w-full rounded-xl overflow-hidden border border-[#D4AF37]/40 mt-1 bg-[#141923] relative">
          <img
            src={normalizeImageUrl(imgObj.url)}
            alt="Photo Preview"
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.parentElement.innerHTML =
                '<div class="p-2 text-[10px] text-amber-400 font-mono text-center">⚠️ Invalid image URL. Ensure URL points directly to an image (.jpg, .png, .webp).</div>';
            }}
          />

          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] text-[#FFD700] font-bold border border-[#FFD700]/30">
            Live Preview
          </span>
        </div>
      )}
    </div>
  );
}
