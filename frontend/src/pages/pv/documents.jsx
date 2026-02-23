import React, { useState } from "react";

function DocumentUploadForm() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Exemple de validation : taille max 5 Mo
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Le fichier est trop volumineux (max 5 Mo).");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un document.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Document uploadé avec succès !");
        setFile(null);
      } else {
        setError("Erreur lors de l’upload du document.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Uploader un document important</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />
        <button type="submit" style={{ marginTop: "10px" }}>
          Envoyer
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default DocumentUploadForm;