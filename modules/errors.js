export const ERROR_MESSAGES = {
    PROFILE_UPDATED : {
        type : 'success',
        content : 'Profil mis à jour.'
    },
    PASSWORD_UPDATED : {
        type : 'success',
        content : 'Mot de passe mis à jour.'
    },
    FRIEND_ADDED : {
        type : 'success',
        content : 'Demande d\'ami ajouté à votre liste, vous serrez amis dès que l\'utilisateur vous demandera en retour.'
    },

    ADMIN_ONLY : {
        type : 'info',
        content : 'Vous devez être administrateur pour accéder à cette page.'
    },

    NO_RECORD_FOR_DATE : {
        type : 'warning',
        content : 'Aucun enregistrement pour cette date.'
    },
    FRIEND_DELETED : {
        type : 'warning',
        content : 'Ami supprimé.'
    },

    NOT_LOGGED : {
        type : 'danger',
        content : 'Vous devez être connecté pour accéder à cette page.'
    },
    PWDS_NOT_MATCH : {
        type : 'danger',
        content : 'Les mots de passes ne correspondent pas.'
    },
    PASSWORD_NOT_SECURE : {
        type : 'danger',
        content : 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
    },
    AUTH_FAILED : {
        type : 'danger',
        content : 'Les informations saisies sont incorrectes.'
    },
    MISSING_FIELDS : {
        type : 'danger',
        content : 'Veuillez remplir tous les champs.'
    },
    USER_NOT_FOUND : {
        type : 'danger',
        content : 'Utilisateur introuvable.'
    },
    USERNAME_USED : {
        type : 'danger',
        content : 'Ce nom d\'utilisateur est déjà utilisé.'
    },
    FRIEND_NOT_FOUND : {
        type : 'danger',
        content : 'Utilisateur introuvable dans votre liste d\'amis.'
    }
}