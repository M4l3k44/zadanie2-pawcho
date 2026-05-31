# Zadanie 2 – PAwChO

## Schemat tagowania
- **sha** (priorytet 100): tag `sha-<hash>` – generowany przy każdym uruchomieniu
- **semver** (priorytet 200): tag np. `1.0.0` – generowany tylko przy pushu taga `v*`

Wyłączono `latest=false` – brak automatycznego tagu latest.

## Cache
Typ: `registry`, tryb: `max`, przechowywany na DockerHub: `jmalek623/weather-app-cache:cache`

## CVE
Skan wykonuje Trivy (`aquasecurity/trivy-action@v0.36.0`). 
Obraz trafia na ghcr.io tylko gdy brak podatności CRITICAL/HIGH (`exit-code: 1`).
Wybrano Trivy – prosta integracja z GHA, brak dodatkowego logowania, bezpłatny skan.

## Architektury
`linux/amd64` oraz `linux/arm64`
