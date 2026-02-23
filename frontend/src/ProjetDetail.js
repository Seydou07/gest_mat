import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

const ProjetDetail = () => {
  const { id } = useParams(); // récupère l'id du projet depuis l'URL

  return (
    <div>
      <Typography variant="h4">Détails du projet {id}</Typography>
      {/* Ici tu peux afficher les infos du projet (API, base de données, etc.) */}
    </div>
  );
};

export default ProjetDetail;