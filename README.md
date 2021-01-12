# Assiduite Ensimag - Pointage

Ce projet permet de pointer pour les cours pour les alternants de l'Ensimag (Grenoble).
Celui-ci est conteneurisé avec Docker afin de router seulement le traffic du pointage par le VPN de l'Ensimag, sans forcer tout le serveur à passer par le VPN.

Une stack **docker-compose** est utilisée avec 2 services : OpenVPN (connexion VPN à l'Ensimag) et NodeJS pour faire tourner l'API et router ses requêtes au service OpenVPN.

*(English version)*

This project allows Ensimag (Grenoble, France) alternating students to identify themselves as being present during classes.
It is containerized with Docker to route only its traffic through the Ensimag VPN without forcing the entire server to use the VPN.

A **docker-compose** stack is used, running 2 services: OpenVPN (Ensimag VPN connection) and NodeJS to run the API and route its requests to the OpenVPN service.

## Setup/Installation

First, clone the repository and cd into it:

```sh
git clone git@github.com:BlueskyFR/assiduite.git && cd assiduite
# or
gh repo clone BlueskyFR/assiduite && cd assiduite
```

Then, download the Ensimag student OpenVPN profile (.ovpn) from the intranet:

```sh
URL="https://intranet.ensimag.grenoble-inp.fr/medias/fichier/ensimag-vpn-etu-udp_1606293994845-ovpn?ID_FICHE=78949&INLINE=FALSE"
curl -o ensimag.ovpn $URL
```

Finally, create a `creds` file (no extension) containing your crendentials (username + password) for both the VPN connection and the HTTP Basic Auth.
We will also optionally make it only readable by root so that no one will be able to read it without root access on your machine:

```sh
# Replace username and password by your real ones
echo username > creds
echo password >> creds

# Optional
chmod 0 creds
sudo chown root:root creds
```

*Please note that the `creds` file should have the username on the first line and the password on the second one.*

We are now ready to build the OpenVPN container:

```sh
./assiduite build
# Or, if you chose to restrict creds access to root before (root permission is only needed for the build):
sudo ./assiduite build
```

## Run it!

After following the [installation](#setupinstallation) steps, let's launch the compose stack!

```sh
./assiduite start
```

Other commands are also available, just in case need them: `./assiduite [start|stop|restart|build|upgrade|cli]`.

...And that's it!