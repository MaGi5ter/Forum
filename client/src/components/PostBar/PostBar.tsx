import "./postbar.css";

function PostBar() {
  return (
    <a href="/submit">
      <div className="create-new-post">
        <textarea
          placeholder="Create new post.."
          className="index-create-post-area"
        ></textarea>
        <button className="index-create-post-buton">Post it</button>
      </div>
    </a>
  );
}

export default PostBar;
