import { useState } from "react";
import { avatarColor } from "../../profile/profileConstants";
import "./Avatar.css";

const Avatar = ({ src, name = "", size = "md" }) => {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar avatar--${size}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`avatar avatar--${size} avatar--fallback`}
      style={{ background: avatarColor(name) }}
    >
      {name[0]?.toUpperCase() ?? "?"}
    </div>
  );
};

export default Avatar;
