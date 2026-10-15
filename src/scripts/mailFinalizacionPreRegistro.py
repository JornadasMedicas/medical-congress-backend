import mysql.connector
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
from html import escape
import smtplib
import ssl
import smtplib
import sys

def render_template(html, valores):
    """Reemplaza {{clave}} por su valor."""
    for clave, valor in valores.items():
        html = html.replace("{{" + clave + "}}", str(valor))
    return html

def send_mail(sender, assistant):
    port = 465
    smtp_server_domain_name = "smtp.gmail.com"
    sender_mail = str(sender['email'])
    sender_password = str(sender['token'])
    recipient_mail = assistant[4].strip().lower()

    subject = "JORNADAS MÉDICAS 2026 - COMPLETA TU REGISTRO"

    # === LEER PLANTILLA HTML ===
    html_path = "../templates/emailEnlaceRegistro.html"
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    # === REEMPLAZAR PARÁMETROS ===
    # Ajusta los índices a tu estructura de `assistant`
    valores = {
        "acronimo":    escape(str(assistant[1]).strip()),
        "nombre":      escape(str(assistant[2]).strip()),
        "aniversario": "37",   # o el valor que corresponda
    }
    html_content = render_template(html_content, valores)

    # Validar que no quedó ningún placeholder sin reemplazar
    if "{{" in html_content:
        raise ValueError(
            "Quedaron placeholders sin reemplazar en la plantilla")

    ssl_context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server_domain_name, port, context=ssl_context) as service:
        service.login(sender_mail, sender_password)

        mail = MIMEMultipart()
        mail['Subject'] = subject
        mail['From'] = sender_mail
        mail['To'] = recipient_mail
        mail.attach(MIMEText(html_content, "html", "utf-8"))

        service.sendmail(sender_mail, recipient_mail, mail.as_string())


if __name__ == '__main__':
    account = 0
    emailCounter = 0
    totalCounter = 0
    emailReset = 0

    emails = [
        {'email': 'constanciaslll@jornadasmedicascae.com',
            'password': 'cemev2016', 'token': 'ncbk twct piks wdyh'},
        {'email': 'constanciasll@jornadasmedicascae.com',
            'password': 'cemev2016', 'token': 'qdfb bfpe jpsh efjq'},
        {'email': 'constancias@jornadasmedicascae.com',
            'password': 'cemev2016', 'token': 'kvkn sxyh pawn ulyx'}
    ]

    # ---Connection---
    database = mysql.connector.connect(
        host="127.0.0.1", user="root", passwd="siscae1035", database="jornadas2026")

    # ---Create cursor to manipulate consults---
    cursor = database.cursor(buffered=True)

    # PROD QUERY
    cursor.execute(
        "SELECT * FROM jrn_persona WHERE created_at >= '2026-01-01' AND qr_enviado = 0;")

    pending = cursor.rowcount
    list_assistant = cursor.fetchall()

    print(f"Asistentes pendientes de correo con clabe: {pending} \n")

    if pending > 0:
        for assistant in list_assistant:
            email = assistant[4].strip().lower()

            if totalCounter < 300: #Si el contador es menor a # entra, sino termina el proceso de envio
                mail = emails[account]
                emailCounter+=1
                emailReset+=1
                totalCounter += 1
                try:
                    send_mail( mail, assistant )
                    print(assistant[0])

                    #make update
                    cursor.execute(f"UPDATE jrn_persona SET clabe_enviada = 1 WHERE id = {assistant[0]}")
                    database.commit()

                    print(f"UPDATE jrn_persona SET clabe_enviada = 1 WHERE id = {assistant[0]}")
                    print(totalCounter, emails[account]['email'] + " -> " + email + '\n')
                except Exception as e:
                    print(totalCounter, email)
                    print("CORREO NO ENVIADO ", e)
            else:
                print('Correos maximos diarios enviados')
                # ---Close connections---
                cursor.close()
                database.close()
                sys.exit()

            if emailCounter == 20:
                account += 1
                emailCounter = 0

            if emailReset == 60:
                account = 0
                emailReset = 0
            
    else:
        print('No hay asistentes a los que enviar constancias')
        # ---Close connections---
        cursor.close()
        database.close()
        sys.exit()    

    print("\nClabes enviadas: ", totalCounter)

    # ---Close connections---
    cursor.close()
    database.close()
