import React, { useRef, useState } from "react";
import useMessageStore from "../store/messageStore";
import { FaImage } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

const InputContainer = () => {
  const [text, settext] = useState("");
  const { sendMessage, isSendingMessage } = useMessageStore();
  const [preview, setpreview] = useState(null);
  const imageUpload = useRef("");

  const handleClick = () => {
    imageUpload.current.click();
  };
  const removeImage = () => {
    setpreview(null);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const render = new FileReader();
    render.readAsDataURL(file);
    render.onload = async () => {
      const base64Image = render.result;
      setpreview(base64Image);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim().length && !preview) return;
    if (preview){
      console.log("message contains image")
    }
    sendMessage({text:text.trim(),image:preview});
    setpreview(null)
    settext("")
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        {preview && (
          <div>
            <button
              className=" absolute bottom-24 left-28 z-10  text-black cursor-pointer"
              onClick={removeImage}
            >
              <MdCancel size={23} />
            </button>{" "}
            <img
              className="bottom-2 left-2 h-25 w-25 ml-5 mb-1 bg-green-50  absolute "
              src={preview}
            />
          </div>
        )}
      </div>
      <div className="p-3 border-t border-base-300 bg-base-200 flex gap-2">
        <input
          type="text"
          placeholder="Type a message…"
          className="input input-bordered w-full"
          value={text}
          onChange={(e) => settext(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={imageUpload}
          onChange={handleChange}
        />
        <button
          className="btn  flex justify-center items-center p-2"
          onClick={handleClick}
          disabled={isSendingMessage}
        >
          <FaImage size={19} />
        </button>

        <button className="btn btn-primary" type="submit" disabled={isSendingMessage || !text.trim()&&!preview}>
          Send
        </button>
      </div>
    </form>
  );
};

export default InputContainer;
