\# Zadanie 2 – PAwChO



\## Opis

Pipeline GitHub Actions budujący obraz kontenera aplikacji pogodowej (Zadanie 1)

i publikujący go na rejestr ghcr.io.



\## Schemat tagowania obrazów

Tagowanie realizowane jest przez docker/metadata-action z dwoma schematami:



\- sha (priorytet 100): sha-<7 znaków hasha commita>

&#x20; Generowany przy każdym uruchomieniu (workflow\_dispatch i push taga).

&#x20; Pozwala jednoznacznie zidentyfikować konkretny commit.



\- semver (priorytet 200): np. 1.0.0

&#x20; Generowany TYLKO przy pushu taga git w formacie v\* (np. git tag v1.0.0).

&#x20; Wyższy priorytet oznacza, że przy pushu taga semver jest głównym tagiem.



Wyłączono automatyczne tagowanie latest (flavor: latest=false),

aby wymusić świadome tagowanie wersji.



\## Cache

Przechowywany w publicznym repozytorium na DockerHub: weather-app-cache:cache

Eksporter: registry, backend: registry, tryb: max



\## Test CVE

Skan CVE wykonywany jest narzędziem Trivy (aquasecurity/trivy-action).

Wybrano Trivy zamiast Docker Scout ze względu na prostszą integrację

z GitHub Actions – gotowa akcja, brak potrzeby dodatkowego logowania,

bezpłatny skan bez limitów dla repozytoriów publicznych.



\## Architektury

Obraz wspiera dwie architektury: linux/amd64 oraz linux/arm64

