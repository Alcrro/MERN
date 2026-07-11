import { useRef } from "react";
import { useUploadImageMutation } from "../../../../features/upload/rtkUpload";
import { MAX_PRODUCT_IMAGES } from "../../../../utils/constants";
import "./ImageUploader.css";

const ImageUploader = ({ images = [], onChange }) => {
  const inputRef = useRef(null);
  const [upload, { isLoading }] = useUploadImageMutation();

  const handleFiles = async (files) => {
    const remaining = MAX_PRODUCT_IMAGES - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    for (const file of toUpload) {
      const fd = new FormData();
      fd.append("image", file);
      const res = await upload(fd);
      if (res.data?.url) onChange([...images, res.data.url]);
    }
  };

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div className="img-uploader">
      <label className="vf-label">Imagini produs (max {MAX_PRODUCT_IMAGES})</label>
      <div className="img-uploader__grid">
        {images.map((url, i) => (
          <div key={i} className="img-uploader__thumb">
            <img src={url} alt="" />
            <button type="button" className="img-uploader__remove" onClick={() => remove(i)}>×</button>
          </div>
        ))}
        {images.length < MAX_PRODUCT_IMAGES && (
          <button
            type="button"
            className="img-uploader__add"
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? "Se încarcă…" : "+ Adaugă"}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default ImageUploader;
