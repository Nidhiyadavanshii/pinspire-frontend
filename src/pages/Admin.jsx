import { useState } from "react";
import { apiPost } from "../config/api";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiPost("/api/pins/create", {
        title,
        image,
        category
      });

      alert("Pin Created ✅");

      // clear form
      setTitle("");
      setImage("");
      setCategory("");
    } catch (error) {
      console.log("Create error:", error);
      alert("Error creating pin");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create Pin</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <br /><br />

        <button type="submit">Add Pin</button>
      </form>
    </div>
  );
}