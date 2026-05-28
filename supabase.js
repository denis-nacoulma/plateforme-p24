const SUPABASE_URL = 'https://cwlnlpzzmqjetholcqqz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bG5scHp6bXFqZXRob2xjcXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDIyMTIsImV4cCI6MjA5NTMxODIxMn0.KwptvKHBXrGvXLg2RWml81cHKr0yrk1-yHcVCSf_KXA';

async function supabaseRequest(table, method = 'GET', data = null, filters = '') {
    const url = `${SUPABASE_URL}/rest/v1/${table}${filters}`;
    const options = {
        method: method,
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    };
    if (data) options.body = JSON.stringify(data);
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log('Supabase response:', result);
        return result;
    } catch(e) {
        console.error('Supabase error:', e);
        return null;
    }
}

async function inscrireEtudiant(nom, email, numero, mot_de_passe) {
    return await supabaseRequest('etudiants', 'POST', {
        nom, email, numero, mot_de_passe,
        date_inscription: new Date().toISOString()
    });
}

async function connecterEtudiant(email, mot_de_passe) {
    const result = await supabaseRequest('etudiants', 'GET', null,
        `?email=eq.${email}&mot_de_passe=eq.${mot_de_passe}`);
    return result && result.length > 0 ? result[0] : null;
}

async function getEtudiants() {
    return await supabaseRequest('etudiants') || [];
}

async function ajouterSeance(professeur, matiere, date_seance, horaire, contenu, travaux) {
    return await supabaseRequest('seances', 'POST', {
        professeur, matiere, date_seance, horaire, contenu, travaux, present: true
    });
}

async function getSeances() {
    return await supabaseRequest('seances', 'GET', null, '?order=date_seance.desc') || [];
}

async function ajouterDocument(titre, matiere, type_doc, professeur, url_fichier) {
    return await supabaseRequest('documents', 'POST', {
        titre, matiere, type_doc, professeur, url_fichier,
        date_ajout: new Date().toISOString()
    });
}

async function getDocuments() {
    return await supabaseRequest('documents', 'GET', null, '?order=date_ajout.desc') || [];
}

async function ajouterAnnonce(titre, type_annonce, date_annonce, description) {
    return await supabaseRequest('annonces', 'POST', {
        titre, type_annonce, date_annonce, description
    });
}

async function getAnnonces() {
    return await supabaseRequest('annonces', 'GET', null, '?order=date_annonce.desc') || [];
}

// EMPLOI DU TEMPS
async function ajouterCreneau(jour, heure_debut, heure_fin, matiere, professeur, salle, semaine) {
    return await supabaseRequest('emploidutemps', 'POST', {
        jour, heure_debut, heure_fin, matiere, professeur, salle, semaine
    });
}

async function getEmploiDuTemps(semaine) {
    const filter = semaine ? `?semaine=eq.${semaine}&order=heure_debut.asc` : '?order=heure_debut.asc';
    return await supabaseRequest('emploidutemps', 'GET', null, filter) || [];
}

async function supprimerCreneau(id) {
    return await supabaseRequest('emploidutemps', 'DELETE', null, `?id=eq.${id}`);
}

async function modifierCreneau(id, jour, heure_debut, heure_fin, matiere, professeur, salle, semaine) {
    return await supabaseRequest('emploidutemps', 'PATCH', {
        jour, heure_debut, heure_fin, matiere, professeur, salle, semaine
    }, `?id=eq.${id}`);
}

// STORAGE
async function uploadPDF(fichier, nomFichier) {
    const nomPropre = nomFichier
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/__+/g, '_');

    const url = `${SUPABASE_URL}/storage/v1/object/cours/${nomPropre}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': fichier.type || 'application/octet-stream',
                'x-upsert': 'true'
            },
            body: fichier
        });
        if (response.ok) {
            return `${SUPABASE_URL}/storage/v1/object/public/cours/${nomPropre}`;
        }
        const err = await response.json();
        console.error('Upload error:', err);
        return null;
    } catch(e) {
        console.error('Upload exception:', e);
        return null;
    }
}

console.log('✅ Supabase connecté avec succès !');