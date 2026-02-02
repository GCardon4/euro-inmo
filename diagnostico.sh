#!/bin/bash
# Script de diagnóstico para verificar configuración

echo "=== DIAGNÓSTICO DE CONFIGURACIÓN ==="
echo ""

echo "1. Verificando variables de entorno locales:"
echo "   SUPABASE_URL: ${SUPABASE_URL:-❌ NO CONFIGURADA}"
echo "   SUPABASE_KEY: ${SUPABASE_KEY:0:20}... (${#SUPABASE_KEY} caracteres)"
echo ""

echo "2. Tipo de clave de Supabase:"
if [[ $SUPABASE_KEY == sb_publishable_* ]]; then
    echo "   ❌ ERROR: Estás usando PUBLISHABLE KEY"
    echo "   ⚠️  Necesitas el ANON PUBLIC KEY que empieza con 'eyJ'"
elif [[ $SUPABASE_KEY == eyJ* ]]; then
    echo "   ✅ Correcto: Anon public key (JWT)"
else
    echo "   ⚠️  Formato no reconocido"
fi
echo ""

echo "3. Longitud de la clave:"
if [ ${#SUPABASE_KEY} -lt 100 ]; then
    echo "   ❌ Clave muy corta (${#SUPABASE_KEY} caracteres)"
    echo "   ⚠️  El anon key debe tener ~200+ caracteres"
else
    echo "   ✅ Longitud adecuada (${#SUPABASE_KEY} caracteres)"
fi
echo ""

echo "4. Testing conexión a Supabase:"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${SUPABASE_URL}/rest/v1/" -H "apikey: ${SUPABASE_KEY}" -H "Authorization: Bearer ${SUPABASE_KEY}")
if [ "$RESPONSE" == "200" ]; then
    echo "   ✅ Conexión exitosa a Supabase"
elif [ "$RESPONSE" == "401" ]; then
    echo "   ❌ Error 401: Clave de API incorrecta"
elif [ "$RESPONSE" == "000" ]; then
    echo "   ❌ No se pudo conectar (timeout o red)"
else
    echo "   ⚠️  Respuesta HTTP: $RESPONSE"
fi
echo ""

echo "=== ACCIONES REQUERIDAS ==="
echo ""
echo "🔧 PARA LOCAL (.env):"
echo "   1. Ve a: https://supabase.com/dashboard/project/kpfvjnlclaucgmjkkyvh/settings/api"
echo "   2. Copia el 'anon public' key (empieza con eyJ...)"
echo "   3. Actualiza .env con la clave correcta"
echo "   4. Reinicia: npm run dev"
echo ""
echo "🚀 PARA COOLIFY:"
echo "   1. Ve a tu aplicación en Coolify"
echo "   2. Environment Variables"
echo "   3. Verifica que existan:"
echo "      - SUPABASE_URL=https://kpfvjnlclaucgmjkkyvh.supabase.co"
echo "      - SUPABASE_KEY=eyJ... (anon public key completo)"
echo "      - NODE_ENV=production"
echo "   4. Guarda y Redeploy"
echo ""
echo "📋 VERIFICAR LOGS EN COOLIFY:"
echo "   1. Ve a Logs → Application Logs (no Build Logs)"
echo "   2. Busca errores de 'fetch failed' o 'Connect Timeout'"
echo "   3. Si ves errores de Supabase, la clave está mal"
echo ""
