import React, { useRef, useState } from 'react';
import { uploadImage } from '@/api/profile';
import { useToast } from '@/lib/toast';

export default function PhotoUpload({ photos = [], onAdd, onRemove, maxPhotos = 6 }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { push } = useToast();

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      push('Please choose an image file.', 'error');
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await uploadImage(file);
      onAdd(file_url);
      push('Photo uploaded.', 'success');
    } catch {
      push('Photo upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="photo-upload">
      <div className="photo-upload__grid">
        {photos.map((url, index) => (
          <div key={`${url}-${index}`} className="photo-upload__item">
            <img src={url} alt={`Profile photo ${index + 1}`} className="photo-upload__image" />
            <button
              type="button"
              className="photo-upload__remove"
              onClick={() => onRemove(index)}
              aria-label="Remove photo"
            >
              ×
            </button>
          </div>
        ))}
        {photos.length < maxPhotos ? (
          <label className="photo-upload__add">
            <span className="photo-upload__add-icon" aria-hidden="true">+</span>
            <span className="photo-upload__add-label">
              {uploading ? 'Uploading...' : 'Add photo'}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="photo-upload__input"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
        ) : null}
      </div>
      <p className="aymm-muted">Add at least one photo so others can recognize you.</p>
    </div>
  );
}
