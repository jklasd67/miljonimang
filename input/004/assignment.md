# HTML-vorm isikuandmete sisestamiseks

## Eesmärk
Luua HTML-vorm, mis võtab kasutajalt nime ja e-maili, kontrollib sisendi ning saadab andmed serverile JSON-kujul.

## Nõuded
- Vorm peab sisaldama name ja email väljad.
- Tühjad väljad tuleb enne saatmist kinni püüda.
- Vale e-maili formaat peab tagastama veateate.
- Submit-nupul peab olema preventDefault.
- Päring peab olema POST meetodil ja JSON-kehaga.
- Serveri vastus peab olema JSON-kujul ja vead peavad jõudma kasutajani arusaadava sõnumina.
- Validatsioon peab olema nii klient- kui ka serveripoolne.
