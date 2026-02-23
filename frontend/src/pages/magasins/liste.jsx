// src/pages/magasins/ListeMagasins.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

export default function ListeMagasins() {
  const [magasins, setMagasins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/magasins")
      .then((response) => {
        setMagasins(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des magasins :", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        📦 Liste des Magasins
      </Typography>
      {magasins.length === 0 ? (
        <Typography>Aucun magasin enregistré.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Localisation</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {magasins.map((magasin) => (
                <TableRow key={magasin.id}>
                  <TableCell>{magasin.id}</TableCell>
                  <TableCell>{magasin.nom}</TableCell>
                  <TableCell>{magasin.localisation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}