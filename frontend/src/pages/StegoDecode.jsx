import React, { useState } from "react";
import { useNavigate } from "react-router"; // keep your import style
import Navbar from "../components/Navbar";

const StegoDecoder = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState("");
  const [error, setError] = useState("");
  const [key, setKey] = useState("");

  const decryptMessage = (encrypted, key) => {
    let decrypted = "";
    for (let i = 0; i < encrypted.length; i++) {
      const msgChar = encrypted.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(msgChar ^ keyChar);
    }
    return decrypted;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewURL(URL.createObjectURL(file));
    setDecodedMessage("");
    setError("");
  };

  const handleDecode = async () => {
    if (!selectedImage) {
      setError("Please select an image first!");
      return;
    }
    if (!key.trim()) {
      setError("Please enter the secret key!");
      return;
    }

    try {
      const img = await new Promise((resolve) => {
        const image = new Image();
        image.src = URL.createObjectURL(selectedImage);
        image.onload = () => resolve(image);
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let binary = "";
      for (let i = 0; i < data.length; i += 4) {
        binary += (data[i] & 1).toString();
      }

      const eofIndex = binary.indexOf("1111111111111110");
      if (eofIndex === -1) {
        setError("No hidden message found in this image.");
        setDecodedMessage("");
        return;
      }

      const usefulBinary = binary.substring(0, eofIndex);
      const bytes = usefulBinary.match(/.{1,8}/g);
      const encryptedText = bytes
        .map((b) => String.fromCharCode(parseInt(b, 2)))
        .join("");

      const decryptedText = decryptMessage(encryptedText, key);

      setDecodedMessage(decryptedText);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to decode the image.");
      setDecodedMessage("");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Navbar />

      {/* Page wrapper is a column so the main area can grow and scroll */}
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200">
        {/* Main scrollable area */}
        <main className="flex-1 flex justify-center px-4 py-8 overflow-auto">
          {/* Card with a max height so inner columns can scroll independently */}
          <div className="relative w-full max-w-6xl bg-base-100 shadow-2xl rounded-2xl p-6 md:p-8 border border-base-300
                          overflow-hidden max-h-[90vh]">
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 btn btn-sm btn-outline btn-error z-10"
            >
              ✕ Cancel
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-primary">
              🕵️‍♂️ Stego Decoder
            </h2>

            {/* Key + File inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Secret Key 🔑</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the key used during encoding"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Select Image 🖼️</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-primary w-full"
                />
              </div>
            </div>

            {/* Content row: left image (half) and right message (half) */}
            {previewURL && (
              <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* LEFT: Image area (takes 50% on md+) */}
                <div className="md:w-1/2 w-full flex-shrink-0">
                  {/* wrapper gives scroll inside the left column */}
                  <div className="overflow-auto max-h-[76vh] p-2 rounded">
                    <img
                      src={previewURL}
                      alt="Preview"
                      className="mx-auto rounded-lg border shadow-sm max-h-[72vh] w-auto block"
                    />
                  </div>
                </div>

                {/* RIGHT: Actions + decoded message (takes 50%) */}
                <div className="md:w-1/2 w-full flex flex-col gap-4 overflow-auto max-h-[76vh] p-2">
                  <div className="flex gap-3">
                    <button
                      onClick={handleDecode}
                      className="btn btn-primary"
                    >
                      Decode Message
                    </button>
                    <button
                      onClick={() => { setDecodedMessage(""); setError(""); setSelectedImage(null); setPreviewURL(null); }}
                      className="btn btn-ghost"
                    >
                      Reset
                    </button>
                  </div>

                  {decodedMessage ? (
                    <div className="alert alert-success shadow-lg overflow-auto max-h-[60vh]">
                      <div>
                        <span className="font-semibold">Hidden Message:</span>
                        <p className="whitespace-pre-wrap break-words mt-2">
                          {decodedMessage}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <div className="alert alert-error shadow-lg">
                      <div>{error}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default StegoDecoder;
