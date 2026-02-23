const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");       // pour gérer les chemins
const multer = require("multer");   // pour l’upload de fichiers

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connexion à MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_materiel"
});

// ✅ Vérifier la connexion
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion MySQL:", err);
    return;
  }
  console.log("Connecté à MySQL !");
});

// ------------------- CONFIGURATION MULTER -------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads/pv")); // dossier où stocker les fichiers
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nom unique
  }
});

const upload = multer({ storage: storage });
// ------------------------------------------------------------

// ------------------- ROUTES PROJETS -------------------

// CREATE - Ajouter un projet
app.post("/projets", (req, res) => {
  const { nom, description, dateDebut, dateFin } = req.body;
  const sql = "INSERT INTO projets (nom, description, date_debut, date_fin) VALUES (?, ?, ?, ?)";
  db.query(sql, [nom, description, dateDebut, dateFin], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de l'insertion");
    }
    res.send({ message: "Projet créé avec succès", id: result.insertId });
  });
});

// READ - Récupérer tous les projets
app.get("/projets", (req, res) => {
  db.query("SELECT * FROM projets", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la récupération");
    }
    res.send(rows);
  });
});

// UPDATE - Modifier un projet
app.put("/projets/:id", (req, res) => {
  const { id } = req.params;
  const { nom, description, dateDebut, dateFin } = req.body;
  const sql = "UPDATE projets SET nom=?, description=?, date_debut=?, date_fin=? WHERE id=?";
  db.query(sql, [nom, description, dateDebut, dateFin, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la mise à jour");
    }
    res.send({ message: "Projet modifié avec succès" });
  });
});

// DELETE - Supprimer un projet
app.delete("/projets/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM projets WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la suppression");
    }
    res.send({ message: "Projet supprimé avec succès" });
  });
});




// Supprimer un matériel
app.delete("/materiels/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM materiels WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur serveur");
    } else {
      res.send("Matériel supprimé !");
    }
  });
});
// ------------------- ROUTES TYPES -------------------
app.get('/typesMateriel', (req, res) => {
  db.query('SELECT * FROM types_materiel', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/typesMateriel', (req, res) => {
  const { nom } = req.body;
  db.query('INSERT INTO types_materiel (nom) VALUES (?)', [nom], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, nom });
  });
});

app.put('/typesMateriel/:id', (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  db.query('UPDATE types_materiel SET nom=? WHERE id=?', [nom, id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ id, nom });
  });
});

app.delete('/typesMateriel/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM types_materiel WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

// ------------------- ROUTES MARQUES -------------------
app.get('/marques', (req, res) => {
  db.query('SELECT * FROM marques', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/marques', (req, res) => {
  const { nom } = req.body;
  db.query('INSERT INTO marques (nom) VALUES (?)', [nom], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, nom });
  });
});

app.put('/marques/:id', (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  db.query('UPDATE marques SET nom=? WHERE id=?', [nom, id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ id, nom });
  });
});

app.delete('/marques/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM marques WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});



//----------------fonction-----------------
// Routes CRUD pour fonctions

// Lire toutes les fonctions
app.get('/fonctions', (req, res) => {
  db.query('SELECT * FROM fonction', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Ajouter une fonction
app.post('/fonctions', (req, res) => {
  const { nom } = req.body;
  db.query('INSERT INTO fonction (nom) VALUES (?)', [nom], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, nom });
  });
});

// Modifier une fonction
app.put('/fonctions/:id', (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  db.query('UPDATE fonction SET nom = ? WHERE id = ?', [nom, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, nom });
  });
});

// Supprimer une fonction
app.delete('/fonctions/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM fonction WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Fonction supprimée avec succès' });
  });
});



// ------------------- ROUTES AGENTS -------------------

// ------------------- ROUTES AGENTS -------------------

// Liste paginée des agents (optionnel: filtre par nom/matricule)
app.get('/agents', (req, res) => {
  const { page = 1, limit = 20, q } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  // Recherche simple sur nom/matricule si q fourni
  let baseSql = `
    SELECT a.id, a.matricule, a.nom, a.prenom, a.date_naissance, a.telephone, a.email,
           a.fonction_id, f.nom AS fonction_nom
    FROM agents a
    LEFT JOIN fonction f ON f.id = a.fonction_id
  `;
  const params = [];

  if (q) {
    baseSql += ` WHERE a.nom LIKE ? OR a.matricule LIKE ? `;
    params.push(`%${q}%`, `%${q}%`);
  }

  baseSql += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ? `;
  params.push(Number(limit), offset);

  db.query(baseSql, params, (err, results) => {
    if (err) {
      console.error('Erreur SQL (GET /agents):', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des agents' });
    }
    res.json({ page: Number(page), limit: Number(limit), data: results });
  });
});






// --- AJOUTEZ CES ROUTES ---

// Route pour récupérer les matériels


app.get('/materiels', (req, res) => {
  db.query('SELECT * FROM materiels', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Route pour récupérer les types de matériel


app.get('/types_materiel', (req, res) => {
  db.query('SELECT * FROM types_materiel', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});



// Lire un agent par ID
app.get('/agents/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT a.id, a.matricule, a.nom, a.prenom, a.date_naissance, a.telephone, a.email,
           a.fonction_id, f.nom AS fonction_nom
    FROM agents a
    LEFT JOIN fonction f ON f.id = a.fonction_id
    WHERE a.id = ?
  `;
  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error('Erreur SQL (GET /agents/:id):', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Agent introuvable' });
    res.json(rows[0]);
  });
});

// Créer un agent
app.post('/agents', (req, res) => {
  const { matricule, nom, prenom, date_naissance, telephone, email, fonction_id } = req.body || {};

  // Validation minimale
  if (!matricule || !nom) {
    return res.status(400).json({ error: 'Les champs matricule et nom sont requis' });
  }

  // Option: vérifier que la fonction existe si fournie
  const insertAgent = () => {
    const sql = `
      INSERT INTO agents (matricule, nom, prenom, date_naissance, telephone, email, fonction_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [matricule, nom, prenom || null, date_naissance || null, telephone || null, email || null, fonction_id || null],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Matricule déjà existant' });
          }
          console.error('Erreur SQL (POST /agents):', err);
          return res.status(500).json({ error: 'Erreur lors de la création' });
        }
        res.status(201).json({
          id: result.insertId,
          matricule, nom, prenom, date_naissance, telephone, email,
          fonction_id
        });
      }
    );
  };

  if (fonction_id) {
    db.query('SELECT id FROM fonction WHERE id = ?', [fonction_id], (err, rows) => {
      if (err) {
        console.error('Erreur SQL (check fonction):', err);
        return res.status(500).json({ error: 'Erreur lors de la vérification de la fonction' });
      }
      if (!rows || rows.length === 0) {
        return res.status(400).json({ error: 'fonction_id invalide' });
      }
      insertAgent();
    });
  } else {
    insertAgent();
  }
});

// Mettre à jour un agent
app.put('/agents/:id', (req, res) => {
  const { id } = req.params;
  const { matricule, nom, prenom, date_naissance, telephone, email, fonction_id } = req.body || {};

  // Option: si fonction_id fourni, vérifier qu'il existe
  const updateAgent = () => {
    const sql = `
      UPDATE agents
      SET matricule = ?, nom = ?, prenom = ?, date_naissance = ?, telephone = ?, email = ?, fonction_id = ?
      WHERE id = ?
    `;
    db.query(sql, [matricule, nom, prenom || null, date_naissance || null, telephone || null, email || null, fonction_id || null, id],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Matricule déjà existant' });
          }
          console.error('Erreur SQL (PUT /agents/:id):', err);
          return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
        res.json({ id: Number(id), matricule, nom, prenom, date_naissance, telephone, email, fonction_id });
      }
    );
  };

  if (fonction_id) {
    db.query('SELECT id FROM fonction WHERE id = ?', [fonction_id], (err, rows) => {
      if (err) {
        console.error('Erreur SQL (check fonction):', err);
        return res.status(500).json({ error: 'Erreur lors de la vérification de la fonction' });
      }
      if (!rows || rows.length === 0) {
        return res.status(400).json({ error: 'fonction_id invalide' });
      }
      updateAgent();
    });
  } else {
    updateAgent();
  }
});

// Supprimer un agent
app.delete('/agents/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM agents WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erreur SQL (DELETE /agents/:id):', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agent introuvable' });
    }
    res.json({ message: 'Agent supprimé avec succès' });
  });
});

// Route pour récupérer les localisations
app.get('/localisations', (req, res) => {
  const sql = "SELECT id, nom, adresse, ville, pays FROM localisations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la récupération des localisations");
    }
    res.json(results);
  });
});


// Route pour récupérer les états depuis la table etat_materiel
app.get('/etats_materiel', (req, res) => {
  const sql = "SELECT id, libelle FROM etat_materiel";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la récupération des états");
    }
    res.json(results);
  });
});

// Ajouter un nouveau matériel (CREATE)
app.post("/materiels", (req, res) => {
  const { libelle, numero_serie, type_id, etat_id, date_acquisition, valeur, localisation_id, projet_id, marque_id } = req.body;
  const sql = `INSERT INTO materiels 
    (libelle, numero_serie, type_id, etat_id, date_acquisition, valeur, localisation_id, projet_id, marque_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [libelle, numero_serie, type_id, etat_id, date_acquisition, valeur, localisation_id, projet_id, marque_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de l'ajout du matériel");
    }
    res.send({ message: "Matériel ajouté !", id: result.insertId });
  });
});

// Modifier un matériel existant (UPDATE)
app.put("/materiels/:id", (req, res) => {
  const { id } = req.params;
  const { libelle, numero_serie, type_id, etat_id, date_acquisition, valeur, localisation_id, projet_id, marque_id } = req.body;
  const sql = `UPDATE materiels SET 
    libelle=?, numero_serie=?, type_id=?, etat_id=?, date_acquisition=?, valeur=?, localisation_id=?, id_projet=?, marque_id=? 
    WHERE id=?`;

  db.query(sql, [libelle, numero_serie, type_id, etat_id, date_acquisition, valeur, localisation_id, id_projet, marque_id, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la modification");
    }
    res.send({ message: "Matériel mis à jour !" });
  });
});



// ------------------- ROUTES PV RECEPTION -------------------
app.post("/pvReception", upload.single("fichier"), (req, res) => {
  const { dateReception, numeroMarche, objetMarche, observations } = req.body;
  const fichier = req.file ? req.file.filename : null;
  const agents = req.body.agents ? JSON.parse(req.body.agents) : [];

  const sql = "INSERT INTO pv_reception (date_reception, numero_marche, objet_marche, observations, fichier) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [dateReception, numeroMarche, objetMarche, observations, fichier], (err, result) => {
    if (err) return res.status(500).send(err);

    const pvId = result.insertId;

    // Lier les agents
    agents.forEach(agentId => {
      db.query("INSERT INTO pv_agents (pv_id, agent_id) VALUES (?, ?)", [pvId, agentId]);
    });

    res.json({ id: pvId, dateReception, numeroMarche, objetMarche, observations, fichier, agents });
  });
});

app.get("/pvReception", (req, res) => {
  const sql = `
    SELECT pv.id, pv.date_reception, pv.numero_marche, pv.objet_marche, pv.observations, pv.fichier,
           GROUP_CONCAT(CONCAT(a.nom, ' ', a.prenom, ' (', a.fonction, ')') SEPARATOR ', ') AS agents
    FROM pv_reception pv
    LEFT JOIN pv_agents pa ON pv.id = pa.pv_id
    LEFT JOIN agents a ON pa.agent_id = a.id
    GROUP BY pv.id
    ORDER BY pv.date_reception DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Servir les fichiers uploadés
app.use("/uploads/pv", express.static(path.join(__dirname, "uploads/pv")));

// 🚀 Lancer le serveur
app.listen(3001, () => {
  console.log("Serveur démarré sur http://localhost:3001");
});