# EmotionBubble

EmotionBubble est une application web qui vous permet de suivre vos émotions et de tenir un "journal de bord" des jours passés. Vous pouvez y ajouter des notes, une émotion représentaive de votre journée et la météo !

## Installation

Pour installer l'application, il vous suffit de cloner le projet sur votre machine.
```bash
git clone https://github.com/BlazedByte/EmotionBubble.git
```

N'oubliez pas d'installer les dépendances avec la commande suivante :
```bash
pip install -r requirements.txt
```

## Lancement

Ensuite, vous pouvez lancer l'application en ouvrant le fichier `main.py` avec Python.
Lors du premier lancement, le fichier `data.json` sera créé. Il s'agit du fichier de sauvegarde de vos données.
Vous devrez alors le modifier une première fois pour y inscrire dans la section `settings`:
- `secret_key` : une clé secrète pour sécuriser les cookies sur les appareils des utilisateurs
- `invitation_code` : une code à garder secret qui permettra aux utilisateurs de s'inscrire sur l'application
- `ip` : l'adresse IP de votre machine sur le réseau local

La section `data` contiendra les données des utilisateurs.

## Utilisation

Pour utiliser l'application, il vous suffit de vous rendre sur l'adresse IP de votre machine sur le réseau local. Vous pourrez ainsi vous connecter ou créer un compte. Par exemple, si votre adresse IP est `192.168.1.42`, vous devrez vous rendre sur `http://192.168.1.42`.

## TODO
- [x] Ajouter un système de connexion
- [x] Ajouter un système d'inscription
- [ ] Ajouter vérifications des formulaires via HTML
- [ ] Ajouter un système de partage de données entre utilisateurs
- [ ] Ajouter un système de statistiques
- [ ] Ajouter une vue "calendrier" pour voir les émotions de chaque jour
