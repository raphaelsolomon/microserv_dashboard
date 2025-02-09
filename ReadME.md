<!-- Creating a lambda function -->
curl --location 'http://localhost:3000/api/lamda' \
--header 'Content-Type: application/json' \
--data '{
    "name": "fetchData",
    "functionCode": "async (params) => { const response = await axios.get(`https://dummyjson.com/users/search?q=${params}`); console.log(params); return response.data; }"
}'

<!-- executing a lambda function -->
curl --location 'http://localhost:3000/api/lambda/fetchData/execute' \
--header 'Content-Type: application/json' \
--data '{
    "name": "John"
}'

<!-- Creating a lambda function -->
curl --location 'http://localhost:3000/api/lamda' \
--header 'Content-Type: application/json' \
--data '{
    "name": "calculateTotal",
    "description": "Calculate order total with tax and discount",
    "functionCode": "async (amount, taxRate, discount = 0) => { const tax = amount * (taxRate / 100); const total = amount + tax - discount; return { total, tax }; }"
}'

<!-- executing a lambda function -->
curl --location 'http://localhost:3000/api/lambda/calculateTotal/execute' \
--header 'Content-Type: application/json' \
--data '{
    "amount": 100,
    "taxRate": 10,
    "discount": 5
}'

<!-- Creating a lambda function -->
curl --location 'http://localhost:3000/api/lamda' \
--header 'Content-Type: application/json' \
--data '{
    "name": "noParams",
    "functionCode": "async () => { return '\''Hello World'\''; }"
}'

<!-- executing a lambda function -->
curl --location --request POST 'http://localhost:3000/api/lambda/noParams/execute'