// PROTECTION DES PAGES
// Ce fichier vérifie que l'étudiant est connecté
// Ajoutez <script src="auth.js"></script> sur chaque page protégée

function verifierConnexion() {
    const etudiant = localStorage.getItem('etudiant');
    if (!etudiant) {
        // Pas connecté → rediriger vers login
        alert('⚠️ Vous devez vous connecter pour accéder à cette page !');
        window.location = 'login.html';
        return false;
    }
    try {
        const data = JSON.parse(etudiant);
        // Afficher le nom de l'étudiant dans la navbar
        const navbarEtudiant = document.getElementById('navbar-etudiant');
        if (navbarEtudiant) {
            navbarEtudiant.textContent = '👤 ' + data.nom;
        }
        return true;
    } catch(e) {
        localStorage.removeItem('etudiant');
        window.location = 'login.html';
        return false;
    }
}

function seDeconnecter() {
    localStorage.removeItem('etudiant');
    window.location = 'index.html';
}

// Vérifier automatiquement au chargement
verifierConnexion();