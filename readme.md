# Vefforritun 2, 2022. Verkefni 3

## Keyra verkefni á eigin vél

Gert er ráð fyrir postgres og npm sé upp sett

```bash
git clone git@github.com:sthb13/vef2-2022-v3.git
cd vef2-2022-v3
npm install            # setur upp öll hjálpar tól
createdb vef2-2022-v3  # býr til postgres gagnagrunn

npm run setup  # býr til gagnagrunn og setur grunngögn 
npm run lint   # athugar eslint
npm run dev    # keyrir bakendan á http://localhost:3000/
```

## cURL

#### skrá sem stjórnandi og nota token í framhaldi
```bash
AUTH_TOKEN_ADMIN=$(curl -L -X POST 'http://localhost:3000/users/login' \
                        -H 'Content-Type: application/json' \
                        --data '{"username": "unnur@gmail.com", "password": "1234"}' | jq -r ".token")
echo $AUTH_TOKEN_ADMIN;
```
#### skrá sem notendi og nota token í framhaldi
```bash
AUTH_TOKEN_USER=$(curl -L -X POST 'http://localhost:3000/users/login' \
                       -H 'Content-Type: application/json' \
                       --data '{"username": "jon@gmail.com", "password": "test"}' | jq -r ".token")
echo $AUTH_TOKEN_USER;
```
#### búa til notenda
```bash
curl -L -XPOST 'http://localhost:3000/users/register' \
     -H 'Content-Type: application/json' \
     --data '{"name": "skuli", "username": "skuli@gmail.com", "password": "qwerty"}' 
```

#### stjórnandi býr til viðburð
```bash
curl -L -X POST "http://localhost:3000/events" \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"id": "1", "name": "Aðalfundur", "description": "Allir að mæta!"}' 
```
