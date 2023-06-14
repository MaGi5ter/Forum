import { apiPath } from "../assets/apiPath";
import "../assets/submit.css";
import Navbar from "../components/Navbar/Navbar";

import { useState } from "react";

import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

function Submit() {
  const [checkedToken, setCheckedToken] = useState(false);

  if (!checkedToken) handleTokenCheck();
  async function handleTokenCheck() {
    if (localStorage.getItem("token") == null) {
    } else {
      let data = await fetch(`${apiPath}/api/checktoken`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.status == 401) {
        window.location.replace("/login");
      }
    }
    setCheckedToken(true);
  }

  return (
    <>
      <Navbar></Navbar>
      <div id="submit-content">
        <div id="submit-box">
          <input
            type="text"
            id="submit-title"
            placeholder="Title"
            maxLength={300}
            required
          />

          <ReactQuill id="editor"></ReactQuill>
        </div>
      </div>
    </>
  );
}

export default Submit;
