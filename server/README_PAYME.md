Payme demo server (инструкция)

1) Установите зависимости и запустите сервер:

```bash
cd server
npm init -y
npm install express body-parser
node payme_demo_server.js
```

2) Тест локально: откройте http://localhost:4001

3) Использование с ngrok (рекомендуется для webhook):

```bash
ngrok http 4001
# возьмите https://... адрес и укажите его в настройках webhook провайдера
```

4) Реальная интеграция с Payme / Click:
- Зарегистрируйтесь у провайдера, получите тестовые креды (merchant_id, secret).
- Замените логику `/api/create-invoice` на запрос к API провайдера.
- Настройте `/api/webhook` для валидации подписи и обновления заказов в БД.

5) Клиент: `Cart.jsx` уже делает POST `/api/create-invoice` и открывает `payUrl`.

Примечание: этот пример — демонстрационный. Для продакшна используйте безопасное хранение ключей, проверку подписей и HTTPS.
 
6) Быстрая проверка webhook (если запущен ngrok):

- Запустите сервер:

```bash
cd server
npm install
npm start
```

- В новом терминале запустите ngrok:

```bash
ngrok http 4001
```

- Скопируйте HTTPS адрес, например `https://abcd1234.ngrok.io`.
- В панели провайдера укажите `https://abcd1234.ngrok.io/api/webhook` как URL webhook.

- Для теста вы можете вручную вызвать webhook (замените `INVOICE_ID`):

```bash
curl -X POST https://abcd1234.ngrok.io/api/webhook \
	-H "Content-Type: application/json" \
	-d '{"invoiceId":"INVOICE_ID","status":"paid"}'
```

7) Замена демо‑логики на реальную:

- В `/api/create-invoice` вместо генерации локального `payUrl` делайте запрос к API провайдера и возвращайте реальную ссылку.
- В `/api/webhook` реализуйте валидацию подписи/хеша (проверка секретов) и обновляйте статус заказа в БД.
