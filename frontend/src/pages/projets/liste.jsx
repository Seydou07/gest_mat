import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { Link } from 'react-router-dom';

const ListeProjets = () => {
  // Exemple de données (tu pourrais les récupérer depuis une API)
  const projets = [
    { id: 1, nom: "Projet A" },
    { id: 2, nom: "Projet B" },
    { id: 3, nom: "Projet C" },
  ];

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Liste des projets
      </Typography>
      <List>
        {projets.map((projet) => (
          <ListItemButton
            key={projet.id}
            component={Link}
            to={`/projet/${projet.id}`} // lien dynamique
          >
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary={projet.nom} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default ListeProjets;