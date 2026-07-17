import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../atoms/Avatar";
import AvatarCropModal from "../AvatarCropModal";
import { useUploadImageMutation } from "../../../features/upload/rtkUpload";
import { useUpdateMeMutation } from "../../../features/auth/rtkAuth";
import { setUser } from "../../../features/auth/authSlice";
import "./AvatarUpload.css";

const AvatarUpload = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const inputRef = useRef(null);
  const [rawSrc, setRawSrc]           = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [preview, setPreview]         = useState(null);
  const [error, setError]             = useState("");

  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [updateMe,    { isLoading: saving    }] = useUpdateMeMutation();
  const isLoading = uploading || saving;

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setRawSrc(URL.createObjectURL(f));
    setError("");
    e.target.value = "";
  };

  const onCropConfirm = (blob) => {
    if (preview) URL.revokeObjectURL(preview);
    setCroppedBlob(blob);
    setPreview(URL.createObjectURL(blob));
    setRawSrc(null);
  };

  const onSave = async () => {
    if (!croppedBlob) return;
    try {
      const fd = new FormData();
      fd.append("image", croppedBlob, "avatar.jpg");
      const { url } = await uploadImage(fd).unwrap();
      const { user: updated } = await updateMe({ avatar: url }).unwrap();
      dispatch(setUser(updated));
      setPreview(null);
      setCroppedBlob(null);
    } catch {
      setError("Upload eșuat. Încearcă din nou.");
    }
  };

  return (
    <>
      <div className="avatar-upload">
        <button type="button" className="avatar-upload__trigger" onClick={() => inputRef.current?.click()}>
          <Avatar src={preview ?? user?.avatar} name={user?.name} size="lg" />
          <span className="avatar-upload__badge" aria-hidden="true">✎</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          aria-label="Selectează poza de profil"
          className="avatar-upload__input"
          onChange={onFileChange}
        />
        {croppedBlob && (
          <button type="button" className="avatar-upload__save" onClick={onSave} disabled={isLoading}>
            {isLoading ? "Se încarcă..." : "Salvează poza"}
          </button>
        )}
        {error && <p className="avatar-upload__error">{error}</p>}
      </div>
      {rawSrc && (
        <AvatarCropModal
          src={rawSrc}
          onConfirm={onCropConfirm}
          onCancel={() => setRawSrc(null)}
        />
      )}
    </>
  );
};

export default AvatarUpload;
