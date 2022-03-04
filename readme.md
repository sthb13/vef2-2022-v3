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
#### skrá sem notandi og nota token í framhaldi
```bash
AUTH_TOKEN_USER=$(curl -L -X POST 'http://localhost:3000/users/login' \
                       -H 'Content-Type: application/json' \
                       --data '{"username": "jon@gmail.com", "password": "test"}' | jq -r ".token")
echo $AUTH_TOKEN_USER;
```
#### búa til notanda
```bash
curl -L -XPOST 'http://localhost:3000/users/register' \
     -H 'Content-Type: application/json' \
     --data '{"name": "skuli", "username": "skuli@gmail.com", "password": "qwerty"}' 
```

#### stjórnandi býr til viðburð
```bash
curl -L -X POST "http://localhost:3000/events" \
     -H "Authorization: Bearer $AUTH_TOKEN_ADMIN" \
     -H "Content-Type: application/json" \
     --data '{"id": "2", "name": "Aðalfundur", "description": "Allir að mæta!"}' 
```

#### notandi skráir sig á viðburð
```bash
curl -L -X POST "http://localhost:3000/events/1/register" \
     -H "Authorization: Bearer $AUTH_TOKEN_USER" \
     -H "Content-Type: application/json" \
     --data '{ "comment": "hlakka til :)"}' 
```

#### stjórnandi skoðar notendur
```bash
curl -L -X GET "http://localhost:3000/users/"\
     -H "Authorization: Bearer $AUTH_TOKEN_ADMIN"\
     -H "Content-Type: application/json" 
```

#### stjórnandi skoðar notanda
```bash
curl -L -X GET "http://localhost:3000/users/1" \
     -H "Authorization: Bearer $AUTH_TOKEN_ADMIN" \
     -H "Content-Type: application/json" 
```

#### notandi skoðar sjálfan sig
```bash
curl -L -X GET "http://localhost:3000/users/me" \
     -H "Authorization: Bearer $AUTH_TOKEN_USER" \
     -H "Content-Type: application/json" 
```

#### notandi skoðar viðburð sem hann bjó til
```bash
curl -L -X GET "http://localhost:3000/events/1" \
     -H "Authorization: Bearer $AUTH_TOKEN_USER" \
     -H "Content-Type: application/json" 
```

#### stjórnandi breytir viðburði
```bash
curl -X PATCH "http://localhost:3000/events/2" \
     -H "Authorization: Bearer $AUTH_TOKEN_ADMIN" \
     -H "Content-Type: application/json" \
     -d '{ "description": "Ókeypis bjór!!"}'
```

#### stjórnandi eyðir viðburði
```bash
curl -X DELETE "http://localhost:3000/events/2" \
     -H "Authorization: Bearer $AUTH_TOKEN_ADMIN" \
     -H "Content-Type: application/json" 
```

#### notandi afskráir sig af viðburði 
```bash
curl -X DELETE "http://localhost:3000/events/1/register" \
     -H "Authorization: Bearer $AUTH_TOKEN_USER" \
     -H "Content-Type: application/json" 
```
## Keysla á Heroku
https://sthb13-vef2-2022-v3.herokuapp.com/
