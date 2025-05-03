# 🌿 EcoVestiaire

<div align="center">

![EcoVestiaire Banner](https://img.shields.io/badge/🌍_EcoVestiaire-La_Mode_Durable-16A34A?style=for-the-badge&labelColor=1F2937)

### **✨ La plateforme qui révolutionne la mode seconde main ✨**

[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel_12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Stripe](https://img.shields.io/badge/Stripe_Integrated-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

[🚀 **Démo Live**](https://ecovestiaire.com) • [📖 **Documentation**](https://docs.ecovestiaire.com) • [🐛 **Issues**](https://github.com/saalmahm/Eco_Vestaire/issues)

</div>

## ✨ À Propos

> **EcoVestiaire** transforme la façon dont nous consommons la mode. Une plateforme innovante où chaque vêtement trouve une seconde vie, connectant acheteurs et vendeurs dans un écosystème durable et moderne.

<div align="center">
 <img src="https://raw.githubusercontent.com/saalmahm/Eco_Vestaire/main/preview.gif" alt="EcoVestiaire Preview" width="100%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

## 🎯 Fonctionnalités Principales

<table>
<tr>
<td width="50%" valign="top">

### 👕 Pour les Utilisateurs
- 📸 **Publication d'articles** en un clic
- ❤️ **Système de favoris** intelligent
- 🔔 **Notifications** en temps réel
- 💳 **Paiements sécurisés** via Stripe
- 👥 **Réseau social** de la mode
- 🔍 **Recherche avancée** avec filtres
- 💬 **Commentaires** et interactions
- 📱 **Interface responsive** (mobile & desktop)

</td>
<td width="50%" valign="top">

### 👔 Pour les Administrateurs
- 📊 **Dashboard analytique** complet
- 👨‍💼 **Gestion des utilisateurs** avancée
- 📦 **Modération du contenu** intelligente
- 💬 **Gestion des commantaires**
- 💰 **Suivi des transactions** détaillé
- 📈 **Statistiques en temps réel**
- 🏷️ **Gestion des catégories**
- 📦 **Gestion des commandes**


</td>
</tr>
</table>

## 🚀 Installation Rapide

```bash
# Cloner le projet
git clone https://github.com/saalmahm/Eco_Vestaire.git
cd Eco_Vestaire

# Installation Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# Installation Frontend
cd ../frontend
npm install

# Démarrer les serveurs
# Terminal 1 - Backend
cd backend && php artisan serve

# Terminal 2 - Frontend
cd frontend && npm run dev
