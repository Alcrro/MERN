import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import "./AvatarCropModal.css";

const getCroppedBlob = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((res) => { image.onload = res; });
  const size = Math.min(pixelCrop.width, pixelCrop.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d").drawImage(image, pixelCrop.x, pixelCrop.y, size, size, 0, 0, size, size);
  return new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
};

const AvatarCropModal = ({ src, onConfirm, onCancel }) => {
  const [crop, setCrop]         = useState({ x: 0, y: 0 });
  const [zoom, setZoom]         = useState(1);
  const [pixels, setPixels]     = useState(null);

  const onCropComplete = useCallback((_, p) => setPixels(p), []);

  const handleConfirm = async () => {
    const blob = await getCroppedBlob(src, pixels);
    onConfirm(blob);
  };

  return (
    <div className="crop-modal__backdrop" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        <p className="crop-modal__hint">Mută și zoomează pentru a încadra poza</p>
        <div className="crop-modal__area">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="crop-modal__controls">
          <input
            type="range" min={1} max={3} step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="crop-modal__zoom"
          />
          <div className="crop-modal__actions">
            <button type="button" className="crop-modal__cancel"  onClick={onCancel}>Renunță</button>
            <button type="button" className="crop-modal__confirm" onClick={handleConfirm}>Confirmă</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropModal;
