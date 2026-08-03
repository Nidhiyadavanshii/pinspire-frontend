import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function Admin() {

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(API_BASE_URL, {
                title,
                image,
                category,
            });

            alert("Pin Added ✅");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Add Pin (Admin)</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br /><br />

                <input
                    placeholder="Image URL"
                    onChange={(e) => setImage(e.target.value)}
                />
                <br /><br />

                <input
                    placeholder="Category"
                    onChange={(e) => setCategory(e.target.value)}
                />
                <br /><br />

                <button>Add Pin</button>
            </form>
        </div>
    );
}

export default Admin;