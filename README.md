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
- Système de MDP avec contraintes de sécurité
- Bouton pour afficher le mdp lors de l'inscription / connexion
- Peupler la page "administration"
- Dark mode
- Vue "calendrier" pour voir les émotions de chaque jour
- Paramètre de style pour les couleurs de l'application