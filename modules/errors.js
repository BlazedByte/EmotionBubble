export const ERROR_MESSAGES = {
    PROFILE_UPDATED : {
        type : 'success',
        content : 'Profil mis à jour.'
    },
    PASSWORD_UPDATED : {
        type : 'success',
        content : 'Mot de passe mis à jour.'
    },

    ADMIN_ONLY : {
        type : 'info',
        content : 'Vous devez être administrateur pour accéder à cette page.'
    },

    NO_RECORD_FOR_DATE : {
        type : 'warning',
        content : 'Aucun enregistrement pour cette date.'
    },

    NOT_LOGGED : {
        type : 'danger',
        content : 'Vous devez être connecté pour accéder à cette page.'
    },
    PWDS_NOT_MATCH : {
        type : 'danger',
        content : 'Les mots de passes ne correspondent pas.'
    },
    AUTH_FAILED : {
        type : 'danger',
        content : 'Les informations saisies sont incorrectes.'
    },
    MISSING_FIELDS : {
        type : 'danger',
        content : 'Veuillez remplir tous les champs.'
    },
    USERNAME_USED : {
        type : 'danger',
        content : 'Ce nom d\'utilisateur est déjà utilisé.'
    }
}