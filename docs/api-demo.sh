#!/usr/bin/env sh
# Демонстрация API для организаций: список своих заявок, смена статуса, проверка ошибок.
# Запуск: ORG_KEY=<ключ из ORG_KEYS> BOT_URL=https://cmyser-ru-max.91.188.212.151.ip.giper.dev sh docs/api-demo.sh
# Локально: ORG_KEY=change-me-ads BOT_URL=http://localhost:9090 sh docs/api-demo.sh
set -u
BOT_URL=${BOT_URL:-http://localhost:9090}
ORG_KEY=${ORG_KEY:-change-me-ads}
pass=0; fail=0
check() {
	if [ "$2" = "$3" ]; then pass=$((pass+1)); echo "ok   $1: $2"; else fail=$((fail+1)); echo "FAIL $1: ожидали $3, получили $2"; fi
}
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }

echo "1. Без ключа доступа нет"
check "GET /org/tickets без ключа" "$(code "$BOT_URL/org/tickets")" 401

echo "2. Список заявок своей организации"
list=$(curl -s -H "Authorization: Bearer $ORG_KEY" "$BOT_URL/org/tickets")
owner=$(printf '%s' "$list" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log(j.owner)})')
count=$(printf '%s' "$list" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log(j.tickets.length)})')
echo "     организация: $owner, заявок: $count"
check "в ответе есть поле owner" "$( [ -n "$owner" ] && echo yes )" yes
ticket=$(printf '%s' "$list" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const t=j.tickets.find(t=>!["done","rejected"].includes(t.status))||j.tickets[0];console.log(t?t.link:"")})')
if [ -z "$ticket" ]; then echo "     открытых заявок нет, дальше нечего менять"; exit 1; fi
echo "     берём заявку $ticket"

echo "3. Смена статуса через API"
res=$(curl -s -X POST -H "Authorization: Bearer $ORG_KEY" -H "content-type: application/json" \
	-d "{\"ticket\":\"$ticket\",\"status\":\"work\",\"note\":\"Бригада выехала, демонстрация API\"}" "$BOT_URL/org/status")
status=$(printf '%s' "$res" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).status)}catch(e){console.log(s)}})')
check "статус стал work" "$status" work

echo "4. Ошибки обрабатываются"
check "неизвестный статус" "$(code -X POST -H "Authorization: Bearer $ORG_KEY" -H "content-type: application/json" -d "{\"ticket\":\"$ticket\",\"status\":\"lost\"}" "$BOT_URL/org/status")" 422
check "чужая заявка или несуществующая" "$(code -X POST -H "Authorization: Bearer $ORG_KEY" -H "content-type: application/json" -d '{"ticket":"nope","status":"work"}' "$BOT_URL/org/status")" 404
check "тело не JSON" "$(code -X POST -H "Authorization: Bearer $ORG_KEY" -H "content-type: text/plain" -d 'x' "$BOT_URL/org/status")" 422

echo "5. Возврат статуса, чтобы демо-данные не портить"
curl -s -o /dev/null -X POST -H "Authorization: Bearer $ORG_KEY" -H "content-type: application/json" \
	-d "{\"ticket\":\"$ticket\",\"status\":\"accepted\",\"note\":\"\"}" "$BOT_URL/org/status"

echo "итого: ok $pass, fail $fail"
[ "$fail" -eq 0 ]
