# EmotionBubble

EmotionBubble est une application web qui vous permet de suivre vos émotions et de tenir un "journal de bord" des jours passés. Vous pouvez y ajouter des notes, une émotion représentaive de votre journée et la météo !

## Installation & lancement

Pour installer l'application, il vous suffit de cloner le projet sur votre machine.
```bash
git clone https://github.com/Nash115/EmotionBubble.git
```

### Avec Docker

```bash
docker-compose up -d --build
```

### Avec Node.js

N'oubliez pas d'installer les dépendances avec la commande suivante :
```bash
npm install
```
Vous pouvez lancer le serveur :
```bash
npm start
```

## TODO
- [x] Ajouter un système de connexion
- [x] Ajouter un système d'inscription
- [x] Affichage des dates initiales : 30 derniers jours
- [x] Possiblilité de consulter un enregistrement
- [x] Possiblilité d'ajouter un enregistrement
- [x] Possibilité de modifier un enregistrement
- [x] Vérifier la connexion pour chaque page nécessitant une connexion
- [x] Ajouter la page "profil"
- [x] Ajouter la page "administration"
- [x] Ajouter un système de partage de données entre utilisateurs (+ page amis) avec gestion de la visibilité des enregistrements
- [x] Ajouter la visibilité des enregistrements de ses amis dans la page de consultation
- [x] Contneriser l'application et assurer la persistance des données
- [x] Ajouter un système de statistiques + page "statistiques"
- [ ] Ajouter un système de MDP avec contraintes de sécurité
- [ ] Ajouter une page ami séparée des paramètres
- [ ] Ajouter un bouton pour afficher le mdp lors de l'inscription / connexion
- [ ] Ajouter des fonctionnalités à la page "administration"
- [ ] Ajouter un dark mode
- [ ] Ajouter une vue "calendrier" pour voir les émotions de chaque jour
- [ ] Ajouter un paramètre de style pour les couleurs de l'application