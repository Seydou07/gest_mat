// components/MenuAccordion.jsx
import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

// Icônes
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import StoreIcon from '@mui/icons-material/Store';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';

// Logo PEDECEL
import pedecelLogo from '../assets/pedecel.png';

const sections = [
  {
    title: "Tableau de bord",
    icon: <WorkIcon />,
    items: [
      { text: "Accueil", to: "/", icon: <WorkIcon /> }
    ]
  },
  {
    title: "Agents",
    icon: <PeopleIcon />,
    items: [
      { text: "Gestion des agents", to: "/agents", icon: <PeopleIcon /> }
    ]
  },
  {
    title: "Projets",
    icon: <WorkIcon />,
    items: [
      { text: "Gestion des projets", to: "/projets", icon: <WorkIcon /> }
    ]
  },
  {
    title: "Matériels",
    icon: <BuildIcon />,
    items: [
      { text: "Gestion des matériels", to: "/materiels", icon: <BuildIcon /> }
    ]
  },
  {
    title: "Affectations",
    icon: <PeopleIcon />,
    items: [
      { text: "Gestion des affectations", to: "/affectations", icon: <PeopleIcon /> }
    ]
  },
  {
    title: "Magasins",
    icon: <StoreIcon />,
    items: [
      { text: "Gestion des magasins", to: "/magasins", icon: <StoreIcon /> }
    ]
  },
  {
    title: "Marques & Types",
    icon: <CategoryIcon />,
    items: [
      { text: "Gestion des marques", to: "/marques", icon: <CategoryIcon /> }
    ]
  },
  {
    title: "PV de réception",
    icon: <DescriptionIcon />,
    items: [
      { text: "Gestion des PV", to: "/pv", icon: <DescriptionIcon /> }
    ]
  },
  {
    title: "Historique",
    icon: <HistoryIcon />,
    items: [
      { text: "Mouvements", to: "/historique", icon: <HistoryIcon /> }
    ]
  }
];

const MenuAccordion = () => {
  return (
    <Box sx={{ width: 250 }}>
      {/* Logo */}
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <img src={pedecelLogo} alt="Logo" style={{ width: 150 }} />
      </Box>

      {/* Menu */}
      {sections.map((section, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              {section.icon}
              <Typography sx={{ ml: 1 }}>{section.title}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {section.items.map((item, i) => (
                <ListItemButton key={i} component={Link} to={item.to}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default MenuAccordion;