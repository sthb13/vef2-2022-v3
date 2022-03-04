# Vefforritun 2, 2022. Verkefni 3

## Keyra verkefni á eigin vél

Gert er ráð fyrir postgres og npm sé upp sett

```bash
git clone git@github.com:sthb13/vef2-2022-v3.git
cd vef2-2022-v3
npm install
createdb vef2-2022-v3

npm run setup  # býr til gagnagrunn og setur admin inn
npm run lint   # athugar eslint
npm run dev    # keyrir þetta á http://localhost:3000/
```

## cURL

### búa til stjórnanda og nota token í framhaldi
```bash
AUTH_TOKEN_ADMIN=$(curl -L -X POST 'http://localhost:3000/users/login' \
                        -H 'Content-Type: application/json' \
                        --data '{"username": "unnur@gmail.com", "password": "1234"}' | jq -r ".token")
echo $AUTH_TOKEN_ADMIN;
```
### búa til notenda og nota token í framhaldi
```bash
AUTH_TOKEN_USER=$(curl -L -X POST 'http://localhost:3000/users/login' \
                       -H 'Content-Type: application/json' \
                       --data '{"username": "jon@gmail.com", "password": "test"}' | jq -r ".token")
echo $AUTH_TOKEN_USER;
```
### skrá notenda
```bash
curl -L -XPOST 'http://localhost:3000/users/register' \
     -H 'Content-Type: application/json' \
     --data '{"name": "skuli", "username": "skuli@gmail.com", "password": "qwerty"}' 
```

### stjórnandi býr til viðburð
```bash
curl -L -X POST "http://localhost:3000/events" \
     -H "Authorization: Bearer $AUTH_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"id": "1", "name": "Aðalfundur", "description": "Allir að mæta!"}' 
```
