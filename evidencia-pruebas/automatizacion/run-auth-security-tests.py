import json
import time
import urllib.error
import urllib.parse
import urllib.request
from http.cookiejar import CookieJar
from pathlib import Path

BASE = "http://localhost:8080"
RUN_ID = str(int(time.time()))

student_email = f"estudiante.qa.{RUN_ID}@testotron.local"
other_email = f"otro.qa.{RUN_ID}@testotron.local"
admin_email = f"admin.noautorizado.{RUN_ID}@testotron.local"
password = "Test1234"


def client():
    jar = CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    return opener, jar


def request(opener, method, path, body=None, token=None):
    data = None
    headers = {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(BASE + path, data=data, headers=headers, method=method)
    start = time.perf_counter()
    try:
        with opener.open(req, timeout=10) as res:
            raw = res.read().decode("utf-8", errors="replace")
            elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
            try:
                parsed = json.loads(raw) if raw else None
            except json.JSONDecodeError:
                parsed = raw
            return {"status": res.status, "body": parsed, "elapsed_ms": elapsed_ms, "url": res.geturl()}
    except urllib.error.HTTPError as err:
        raw = err.read().decode("utf-8", errors="replace")
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        try:
            parsed = json.loads(raw) if raw else None
        except json.JSONDecodeError:
            parsed = raw
        return {"status": err.code, "body": parsed, "elapsed_ms": elapsed_ms}


def form_request(opener, method, path, fields):
    data = urllib.parse.urlencode(fields).encode("utf-8")
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    req = urllib.request.Request(BASE + path, data=data, headers=headers, method=method)
    start = time.perf_counter()
    try:
        with opener.open(req, timeout=10) as res:
            raw = res.read().decode("utf-8", errors="replace")
            elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
            return {"status": res.status, "body": raw, "elapsed_ms": elapsed_ms, "url": res.geturl()}
    except urllib.error.HTTPError as err:
        raw = err.read().decode("utf-8", errors="replace")
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        return {"status": err.code, "body": raw, "elapsed_ms": elapsed_ms, "url": err.geturl()}


def result(case_id, name, status, expected, actual, defect="-", evidence="-"):
    return {
        "case_id": case_id,
        "name": name,
        "state": status,
        "expected": expected,
        "actual": actual,
        "defect": defect,
        "evidence": evidence,
    }


main, jar = client()
other, _ = client()
anon, _ = client()
rows = []

# Register student
r = request(main, "POST", "/api/auth/register", {
    "name": "Estudiante QA",
    "email": student_email,
    "password": password,
    "role": "student",
})
student_created = r["status"] == 201 and r.get("body", {}).get("user", {}).get("role") == "student"
rows.append(result(
    "TC-AUTH-001",
    "Registro exitoso de estudiante",
    "Paso" if student_created else "Fallo",
    "201 y usuario student creado",
    f"status={r['status']}, body={r['body']}",
))

# Register another student for ownership checks
request(other, "POST", "/api/auth/register", {
    "name": "Otro Usuario QA",
    "email": other_email,
    "password": password,
    "role": "student",
})
login_other = request(other, "POST", "/api/auth/login", {"email": other_email, "password": password})
other_id = login_other.get("body", {}).get("user", {}).get("id")

# Login student
r = request(main, "POST", "/api/auth/login", {"email": student_email, "password": password})
student_id = r.get("body", {}).get("user", {}).get("id")
token = r.get("body", {}).get("token")
login_ok = r["status"] == 200 and token and student_id
rows.append(result(
    "TC-AUTH-002",
    "Login exitoso",
    "Paso" if login_ok else "Fallo",
    "200, token y usuario",
    f"status={r['status']}, user_id={student_id}, token_presente={bool(token)}, elapsed_ms={r['elapsed_ms']}",
))

# me
r = request(main, "GET", "/api/auth/me", token=token)
me_txt = json.dumps(r.get("body"), ensure_ascii=False)
me_ok = r["status"] == 200 and "password" not in me_txt
rows.append(result(
    "TC-AUTH-004",
    "Consulta de usuario autenticado",
    "Paso" if me_ok else "Fallo",
    "200 sin campo password",
    f"status={r['status']}, contiene_password={'password' in me_txt}",
))

# profile authenticated
r_profile = request(main, "GET", "/profile")
profile_ok = r_profile["status"] == 200 and "Configuración de cuenta" in str(r_profile["body"])
rows.append(result(
    "TC-PROFILE-001",
    "Visualizacion de perfil autenticado",
    "Paso" if profile_ok else "Fallo",
    "200 y vista de configuracion de cuenta",
    f"status={r_profile['status']}, url={r_profile.get('url')}, contiene_configuracion={'Configuración de cuenta' in str(r_profile['body'])}",
))

# dashboard via cookie/JWT integration
r_dash = request(main, "GET", "/dashboard")
dash_ok = r_dash["status"] == 200 and "Panel de control" in str(r_dash["body"])
rows.append(result(
    "TC-INT-AUTH-001",
    "Login, cookie JWT y acceso a dashboard",
    "Paso" if dash_ok else "Fallo",
    "Cookie de login permite acceder a /dashboard",
    f"status={r_dash['status']}, url={r_dash.get('url')}, contiene_panel={'Panel de control' in str(r_dash['body'])}",
))

# profile update
updated_email = f"estudiante.qa.actualizado.{RUN_ID}@testotron.local"
r_update = form_request(main, "POST", "/profile/update", {
    "fullName": "Estudiante QA Actualizado",
    "email": updated_email,
    "bio": "Biografia de prueba QA",
    "currentPassword": "",
    "newPassword": "",
    "confirmPassword": "",
})
profile_updated = "updated=1" in r_update.get("url", "")
rows.append(result(
    "TC-PROFILE-002",
    "Actualizacion exitosa de perfil",
    "Paso" if profile_updated else "Fallo",
    "Redireccion a /profile?updated=1",
    f"status={r_update['status']}, final_url={r_update.get('url')}",
))

# XSS biography
xss_payload = "<script>alert('xss')</script>"
r_xss = form_request(main, "POST", "/profile/update", {
    "fullName": "Estudiante QA XSS",
    "email": updated_email,
    "bio": xss_payload,
    "currentPassword": "",
    "newPassword": "",
    "confirmPassword": "",
})
r_xss_page = request(main, "GET", "/profile")
xss_body = str(r_xss_page["body"])
xss_executability_static = "<script>alert('xss')</script>" in xss_body
escaped_xss = "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;" in xss_body or "&lt;script&gt;" in xss_body
rows.append(result(
    "TC-SEG-006",
    "XSS en biografia",
    "Fallo" if xss_executability_static else "Paso",
    "El payload no debe renderizarse como script HTML",
    f"status={r_xss_page['status']}, script_literal_en_html={xss_executability_static}, escapado={escaped_xss}",
    "DEF-AUTH-005" if xss_executability_static else "-",
))

# bad login
r = request(anon, "POST", "/api/auth/login", {"email": student_email, "password": "Incorrecta123"})
rows.append(result(
    "TC-AUTH-NEG-001",
    "Login con contrasena incorrecta",
    "Paso" if r["status"] == 401 else "Fallo",
    "401 credenciales no validas",
    f"status={r['status']}, body={r['body']}",
))

# invalid email
r = request(anon, "POST", "/api/auth/register", {
    "name": "Email Invalido",
    "email": "correo-invalido",
    "password": password,
    "role": "student",
})
rows.append(result(
    "TC-AUTH-NEG-002",
    "Registro con email invalido",
    "Paso" if r["status"] == 400 else "Fallo",
    "400 error de validacion",
    f"status={r['status']}, body={r['body']}",
))

# short password
r = request(anon, "POST", "/api/auth/register", {
    "name": "Password Corta",
    "email": f"password.corta.{RUN_ID}@testotron.local",
    "password": "123",
    "role": "student",
})
rows.append(result(
    "TC-AUTH-NEG-003",
    "Registro con contrasena corta",
    "Paso" if r["status"] == 400 else "Fallo",
    "400 error de validacion",
    f"status={r['status']}, body={r['body']}",
))

# users without auth
r = request(anon, "GET", "/api/users")
rows.append(result(
    "TC-SEG-002",
    "GET /api/users sin autenticacion",
    "Paso" if r["status"] == 401 else "Fallo",
    "401 sin autenticacion",
    f"status={r['status']}, body={r['body']}",
))

# profile without auth
r = request(anon, "GET", "/profile")
profile_redirect_ok = "/auth/login" in r.get("url", "")
rows.append(result(
    "TC-SEG-001",
    "Acceso a perfil sin autenticacion",
    "Paso" if profile_redirect_ok else "Fallo",
    "Redireccion a /auth/login",
    f"status={r['status']}, final_url={r.get('url')}",
))

# public admin registration
r = request(anon, "POST", "/api/auth/register", {
    "name": "Admin No Autorizado",
    "email": admin_email,
    "password": password,
    "role": "admin",
})
admin_created = r["status"] == 201 and r.get("body", {}).get("user", {}).get("role") == "admin"
rows.append(result(
    "TC-SEG-003",
    "Registro de admin por API",
    "Fallo" if admin_created else "Paso",
    "La API debe rechazar role=admin",
    f"status={r['status']}, body={r['body']}",
    "DEF-AUTH-001" if admin_created else "-",
))

# query other user
r = request(main, "GET", f"/api/users/{other_id}", token=token)
body_txt = json.dumps(r.get("body"), ensure_ascii=False)
other_exposed = r["status"] == 200
password_exposed = "password" in body_txt
rows.append(result(
    "TC-SEG-004",
    "Consulta de datos de otro usuario",
    "Fallo" if other_exposed else "Paso",
    "403 o bloqueo de consulta ajena",
    f"status={r['status']}, expone_otro_usuario={other_exposed}, contiene_password={password_exposed}",
    "DEF-AUTH-002" if other_exposed else "-",
))

# role escalation
r = request(main, "PUT", f"/api/users/{student_id}", {"role": "admin"}, token=token)
role_change_response_ok = r["status"] == 200
r2 = request(main, "GET", "/api/auth/me", token=token)
rows.append(result(
    "TC-SEG-005",
    "Intento de escalamiento de rol propio",
    "Fallo" if role_change_response_ok else "Paso",
    "403 o rechazo de cambio de rol",
    f"status={r['status']}, body={r['body']}; auth_me_despues={r2['body']}",
    "DEF-AUTH-003" if role_change_response_ok else "-",
))

# SQL injection login
r = request(anon, "POST", "/api/auth/login", {"email": "' OR '1'='1", "password": "cualquier"})
rows.append(result(
    "TC-SEG-007",
    "SQL injection basica en login",
    "Paso" if r["status"] in (400, 401) else "Fallo",
    "400 o 401",
    f"status={r['status']}, body={r['body']}",
))

# Performance login
times = []
for _ in range(10):
    perf_client, _ = client()
    rr = request(perf_client, "POST", "/api/auth/login", {"email": updated_email, "password": password})
    times.append(rr["elapsed_ms"])
avg = round(sum(times) / len(times), 2)
rows.append(result(
    "TC-PERF-AUTH-001",
    "Tiempo promedio de login",
    "Paso" if avg <= 1000 else "Fallo",
    "<= 1000 ms promedio local",
    f"promedio={avg}ms, muestras={times}",
))

# logout
logout_client, _ = client()
request(logout_client, "POST", "/api/auth/login", {"email": other_email, "password": password})
r_logout = request(logout_client, "POST", "/api/logout")
r_after_logout = request(logout_client, "GET", "/profile")
logout_ok = "/auth/login" in r_after_logout.get("url", "")
rows.append(result(
    "TC-AUTH-003",
    "Cierre de sesion exitoso",
    "Paso" if logout_ok else "Fallo",
    "Luego de logout, /profile redirige a login",
    f"logout_status={r_logout['status']}, profile_final_url={r_after_logout.get('url')}",
))

summary = {
    "run_id": RUN_ID,
    "student_email": student_email,
    "other_email": other_email,
    "results": rows,
    "counts": {
        "total": len(rows),
        "paso": sum(1 for r in rows if r["state"] == "Paso"),
        "fallo": sum(1 for r in rows if r["state"] == "Fallo"),
    },
}

out = Path("trabajo-joshua-auth-seguridad/resultados-auth-seguridad.json")
out.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(summary, indent=2, ensure_ascii=False))
