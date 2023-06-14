import Navbar from "../components/Navbar/Navbar";
import PostBar from "../components/PostBar/PostBar";

import "../assets/index.css";

function Index() {
  return (
    <>
      <Navbar></Navbar>
      <div id="index-content">
        <PostBar></PostBar>
      </div>
    </>
  );
}
export default Index;
