import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function MaterielForm() {
  const [formData, setFormData] = useState({
    libelle: "",
    numero_serie: "",
    type_id: "",
    //etat: "", //sera gerer par la lise derolante

    etat_id: "",
    date_acquisition: "",
    valeur: "",
    //localisation: "",
    localisation_id: "",
    id_projet: "",
    marque_id: ""
  });

  const [materiels, setMateriels] = useState([]);
  const [projets, setProjets] = useState([]);
  const [marques, setMarques] = useState([]);
  const [typesMateriel, setTypesMateriel] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
   const [localisations, setLocalisations] = useState([]);

// 1. Définition des options pour la liste déroulante "État"
// Dans votre composant MaterielForm
const [etats, setEtats] = useState([]); // Pour stocker les données de la base



  useEffect(() => {
    fetchMateriels();
    fetchLists();
  }, []);

  const fetchMateriels = async () => {
    const res = await axios.get("http://localhost:3001/materiels");
    setMateriels(res.data);
  };

  {/*
  const fetchLists = async () => {
    const [resProjets, resMarques, resTypes] = await Promise.all([
      axios.get("http://localhost:3001/projets"),
      axios.get("http://localhost:3001/marques"),
      axios.get("http://localhost:3001/types_materiel")
    ]);
    setProjets(resProjets.data);
    setMarques(resMarques.data);
    setTypesMateriel(resTypes.data);
  };

  



const fetchLists = async () => {
  try {
    const [resProjets, resMarques, resTypes, resEtats] = await Promise.all([
      axios.get("http://localhost:3001/projets"),
      axios.get("http://localhost:3001/marques"),
      axios.get("http://localhost:3001/types_materiel"),
      axios.get("http://localhost:3001/etats_materiel") // Appel vers la nouvelle table
    ]);
    setProjets(resProjets.data);
    setMarques(resMarques.data);
    setTypesMateriel(resTypes.data);
    setEtats(resEtats.data); // Mise à jour du state
  } catch (err) {
    console.error("Erreur lors du chargement des listes", err);
  }
};
*/}

const fetchLists = async () => {
  try {
    const [resProjets, resMarques, resTypes, resEtats, resLoc] = await Promise.all([
      axios.get("http://localhost:3001/projets"),
      axios.get("http://localhost:3001/marques"),
      axios.get("http://localhost:3001/types_materiel"),
      axios.get("http://localhost:3001/etats_materiel"),
      axios.get("http://localhost:3001/localisations") // Nouvelle requête
    ]);
    setProjets(resProjets.data);
    setMarques(resMarques.data);
    setTypesMateriel(resTypes.data);
    setEtats(resEtats.data);
    setLocalisations(resLoc.data); // Mise à jour du state
  } catch (err) {
    console.error("Erreur lors du chargement des listes", err);
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:3001/materiels/${editId}`, formData);
      setEditId(null);
    } else {
      await axios.post("http://localhost:3001/materiels", formData);
    }
      setFormData({
        libelle: "",
      numero_serie: "",
      type_id: "",
        etat_id: "",
      date_acquisition: "",
        valeur: "",
        localisation_id: "",
      id_projet: "",
      marque_id: ""
      });
    fetchMateriels();
  };

  const handleEdit = (row) => {
    setFormData(row);
    setEditId(row.id);
  };

  const handleCancel = () => {
    setFormData({
      libelle: "",
      numero_serie: "",
      type_id: "",
      etat_id: "",
      date_acquisition: "",
      valeur: "",
      localisation_id: "",
      id_projet: "",
      marque_id: ""
    });
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce matériel ?")) {
      await axios.delete(`http://localhost:3001/materiels/${id}`);
      fetchMateriels();
    }
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(materiels);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Materiels");
    XLSX.writeFile(workbook, "materiels.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des matériels", 14, 10);
    doc.autoTable({
      head: [["ID", "Libellé", "Numéro de série", "État", "Date acquisition", "Valeur", "Localisation", "Projet", "Marque"]],
      body: materiels.map(m => [
        m.id,
        m.libelle,
        m.numero_serie,
        m.etat,
        m.date_acquisition,
        m.valeur,
        m.localisation,
        m.id_projet,
        m.marque_id
      ])
    });
    doc.save("materiels.pdf");
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "libelle", headerName: "Libellé", width: 150 },
    { field: "numero_serie", headerName: "Numéro de série", width: 150 },
    { field: "etat", headerName: "État", width: 120 },
    { field: "date_acquisition", headerName: "Date acquisition", width: 150 },
    { field: "valeur", headerName: "Valeur", width: 120 },
    { field: "localisation", headerName: "Localisation", width: 150 },
    { field: "id_projet", headerName: "Projet", width: 120 },
    { field: "marque_id", headerName: "Marque", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: 8 }}
          >
            Modifier
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Supprimer
          </Button>
        </>
      )
    }
  ];

  const filteredMateriels = materiels.filter((m) =>
    Object.values(m).some((val) =>
      val ? val.toString().toLowerCase().includes(search.toLowerCase()) : false
    )
  );

  return (
    <Grid container spacing={3} className="p-4">
      <Grid item xs={12} md={6}>
        <Paper className="p-4">
          <Typography variant="h5" gutterBottom>
            {editId ? "Modifier un matériel" : "Ajouter un matériel"}
          </Typography>
      <form onSubmit={handleSubmit}>
            <TextField label="Libellé" name="libelle" value={formData.libelle} onChange={handleChange} fullWidth required margin="normal" />
            <TextField label="Numéro de série" name="numero_serie" value={formData.numero_serie} onChange={handleChange} fullWidth required margin="normal" />

            <TextField select label="Type de matériel" name="type_id" value={formData.type_id} onChange={handleChange} fullWidth required margin="normal">
              {typesMateriel.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.nom}</MenuItem>
              ))}
            </TextField>

           { /* <TextField label="État" name="etat" value={formData.etat} onChange={handleChange} fullWidth margin="normal" /> */}


   {/* LE CHAMP ÉTAT EN LISTE DÉROULANTE */}
           <TextField
  select
  label="État"
  //name="etat"
  name="etat_id"
  //value={formData.etat}
  value={formData.etat_id}
  onChange={handleChange}
  fullWidth
  required
  margin="normal"
>
  {etats.map((e) => (
    <MenuItem key={e.id} value={e.id}> 
     {/* </MenuItem> <MenuItem key={e.id} value={e.libelle}> */}
      {e.libelle}
    </MenuItem>
  ))}
</TextField>


            <TextField label="Date d'acquisition" type="date" name="date_acquisition" value={formData.date_acquisition} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Valeur" type="number" name="valeur" value={formData.valeur} onChange={handleChange} fullWidth margin="normal" />


            <TextField
  select
  label="Localisation"
  name="localisation_id"
  value={formData.localisation_id}
  onChange={handleChange}
  fullWidth
  margin="normal"
  required
>
  {localisations.map((loc) => (
    <MenuItem key={loc.id} value={loc.id}>
      {loc.nom} ({loc.ville})
    </MenuItem>
  ))}
</TextField>
            

            <TextField select label="Projet" name="id_projet" value={formData.id_projet} onChange={handleChange} fullWidth required margin="normal">
              {projets.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nom}</MenuItem>
              ))}
            </TextField>

            <TextField select label="Marque" name="marque_id" value={formData.marque_id} onChange={handleChange} fullWidth margin="normal">
              {marques.map((m) => (
                <MenuItem key={m.id} value={m.id}>{m.nom}</MenuItem>
              ))}
            </TextField>

            <Button type="submit" variant="contained" color="primary" className="mt-3">
              {editId ? "Mettre à jour" : "Ajouter"}
            </Button>
            {editId && (
              <Button variant="outlined" color="secondary" className="mt-3 ms-2" onClick={handleCancel}>
                Annuler
              </Button>
            )}
      </form>
        </Paper>
            </Grid>

      <Grid item xs={12} md={6}>
        <Paper className="p-4">
          <Typography variant="h5" gutterBottom>
            Liste des matériels
          </Typography>

          <TextField
            label="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            margin="normal"
          />

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredMateriels}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
    </div>

          <Grid container spacing={2} className="mt-3">
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={exportExcel}
              >
                Exporter en Excel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="success"
                onClick={exportPDF}
              >
                Exporter en PDF
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MaterielForm;