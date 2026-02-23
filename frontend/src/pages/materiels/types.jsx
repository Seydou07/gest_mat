import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';

const EnregistrerMarque = () => {
  const [nom, setNom] = useState('');
  const [marques, setMarques] = useState([]);
  const [editId, setEditId] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    axios.get("http://localhost:3001/marques")
      .then(res => setMarques(res.data))
      .catch(err => {
        console.error("Erreur chargement:", err);
        setToastMessage("Erreur lors du chargement des marques");
        setToastVariant("danger");
        setShowToast(true);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nouvelleMarque = { nom };

    try {
      if (editId !== null) {
        await axios.put(`http://localhost:3001/marques/${editId}`, nouvelleMarque);
        setMarques(marques.map(m => m.id === editId ? { id: editId, ...nouvelleMarque } : m));
        setToastMessage("Marque modifiée avec succès !");
      } else {
        const res = await axios.post("http://localhost:3001/marques", nouvelleMarque);
        setMarques([...marques, res.data]);
        setToastMessage("Marque enregistrée avec succès !");
      }
      setToastVariant("success");
      setShowToast(true);
      setNom('');
      setEditId(null);
    } catch (error) {
      console.error("Erreur:", error);
      setToastMessage("Erreur lors de l'enregistrement");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleEdit = (marque) => {
    setNom(marque.nom);
    setEditId(marque.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/marques/${id}`);
      setMarques(marques.filter(m => m.id !== id));
      setToastMessage("Marque supprimée avec succès !");
      setToastVariant("success");
      setShowToast(true);
    } catch (error) {
      console.error("Erreur suppression:", error);
      setToastMessage("Erreur lors de la suppression");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    setNom('');
    setEditId(null);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="card-title mb-3">
            {editId !== null ? 'Modifier une marque' : 'Enregistrer une marque'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom de la marque :</label>
              <input
                type="text"
                className="form-control"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                {editId !== null ? 'Modifier' : 'Enregistrer'}
              </button>
              {editId !== null && (
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title mb-3">Liste des marques</h5>
          {marques.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marques.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nom}</td>
                    <td className="text-center">
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(m)}>Modifier</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(m.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted">Aucune marque enregistrée pour le moment.</p>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg={toastVariant} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default EnregistrerMarque;