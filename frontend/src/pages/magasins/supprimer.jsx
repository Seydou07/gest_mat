// src/pages/magasins/SupprimerMagasin.jsx
import React, { useState } from "react";
import axios from "axios";

export default function SupprimerMagasin() {
  const [id, setId] = useState("");

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/magasins/${id}`)
      .then(() => {
        alert("Magasin supprimé avec succès !");
        setId("");
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
      });
  };

  return (
    <div>
      <h2>Supprimer un Magasin</h2>
      <input
        placeholder="ID du magasin"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
}