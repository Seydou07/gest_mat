// src/pages/magasins/ModifierMagasin.jsx
import React, { useState } from "react";
import axios from "axios";

export default function ModifierMagasin() {
  const [id, setId] = useState("");
  const [nom, setNom] = useState("");
  const [localisation, setLocalisation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/magasins/${id}`, { nom, localisation })
      .then(() => {
        alert("Magasin modifié avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la modification :", error);
      });
  };

  return (
    <div>
      <h2>Modifier un Magasin</h2>
      <form onSubmit={handleSubmit}>
        <label>ID du magasin :</label>
        <input value={id} onChange={(e) => setId(e.target.value)} required />
        <br />
        <label>Nouveau nom :</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} />
        <br />
        <label>Nouvelle localisation :</label>
        <input value={localisation} onChange={(e) => setLocalisation(e.target.value)} />
        <br />
        <button type="submit">Modifier</button>
      </form>
    </div>
  );
}