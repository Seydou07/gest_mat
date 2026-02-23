// src/components/Layout.jsx
import React from "react";
import { Box, CssBaseline, AppBar, Toolbar, Typography } from "@mui/material";
import MenuAccordion from "./MenuAccordion"; // ton menu accordéon

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Barre supérieure */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            🏢 Application SONABEL
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: 260, flexShrink: 0, mt: 8, borderRight: "1px solid #ddd" }}
      >
        <MenuAccordion />
      </Box>

      {/* Contenu principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}