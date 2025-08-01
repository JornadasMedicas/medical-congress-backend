import mysql.connector
import time

def noneFormat(value):
    if value == None:
        value = 'NULL'
    else:
        value = f"'{value}'"

    return value


if __name__ == "__main__":
    # ---Connection---
    database = mysql.connector.connect(
        host="127.0.0.1", user="root", passwd="siscae1035", database="jornadas")

    database2 = mysql.connector.connect(
        host="127.0.0.1", user="root", passwd="siscae1035", database="jornadasnew")

    # ---Create cursor to manipulate consults---
    cursor = database.cursor(buffered=True)
    cursor2 = database2.cursor(buffered=True)

    # ---DATA---
    tables = ['jrn_categorias', 'jrn_edicion', 'jrn_inscritos_modulos',
              'jrn_inscritos_talleres', 'jrn_modulos', 'jrn_persona', 'jrn_talleres']

    categorias = [
        'Estudiante (Anahuac)',
        'Estudiante (UV)',
        'Estudiante (otras universidades)',
        'Profesionista Independiente',
        'Profesionista CAE',
        'Profesionista SESVER',
        'Profesionista IMSS',
        'Profesionista ISSTE',
        'Profesionista PEMEX',
        'Profesionista SEDENA',
        'Médico Residente CAE',
        'Médico Residente SESVER',
        'Médico Residente IMSS',
        'Médico Residente ISSSTE'
    ]

    modulos = [
        'Medicina',
        'Enfermería',
        'Químicos',
        'Estomatología'
    ]

    # -------TRUNCATE TABLES-----------
    print("Truncating tables...")
    time.sleep(1)

    cursor2.execute(f"SET FOREIGN_KEY_CHECKS = 0")
    for table in tables:
        cursor2.execute(f"TRUNCATE TABLE {table}")

    # -------DATOS jrn_categorias-----------
    for categoria in categorias:
        cursor2.execute(f"INSERT INTO jrn_categorias(nombre, created_at, updated_at) VALUES('{categoria}', now(), now())")

    # -------DATOS jrn_edicion-----------
    cursor2.execute(f"INSERT INTO jrn_edicion(edicion, fec_dia_1, fec_dia_2, fec_dia_3, created_at, updated_at) VALUES('2024', '2024-11-21', '2024-11-22', '2024-11-23', now(), now())")
    cursor2.execute(f"INSERT INTO jrn_edicion(edicion, fec_dia_1, fec_dia_2, fec_dia_3, created_at, updated_at) VALUES('2025', '2025-11-21', '2025-11-22', '2025-11-23', now(), now())")

    # ------DATOS jrn_modulos-----------
    for modulo in modulos:
        cursor2.execute(f"INSERT INTO jrn_modulos(nombre, created_at, updated_at) VALUES('{modulo}', now(), now())")

    # -------DATOS jrn_talleres-------
    cursor2.execute(f"INSERT INTO jrn_talleres(nombre, fecha, hora_inicio, hora_fin, cupos, id_modulo, id_edicion, created_at, updated_at) VALUES('ESTRATEGIAS INTEGRADAS', '2024-11-22', '08:30:00', '12:30:00', 0, 3, 1, now(), now())")
    cursor2.execute(f"INSERT INTO jrn_talleres(nombre, fecha, hora_inicio, hora_fin, cupos, id_modulo, id_edicion, created_at, updated_at) VALUES('USO DE ROTEM', '2024-11-22', '16:00:00', '19:00:00', 0, 1, 1, now(), now())")

    # -------MIGRACION jrn_persona-------
    cursor.execute("SELECT * FROM jrn_persona")
    res = cursor.fetchall()

    for data in res:
        print(
            f"INSERT INTO jrn_persona(acronimo,nombre,categoria,correo,rfc,tel,ciudad,dependencia,qr_enviado, email_registro, email_constancia, created_at, updated_at) VALUES('{data[1]}', '{data[2]}', '{data[3]}', '{data[4]}', {noneFormat(data[5])}, '{data[6]}', '{data[7]}', {noneFormat(data[8])}, false, NULL, NULL, '{data[9]}', '{data[10]}')")
        cursor2.execute(
            f"INSERT INTO jrn_persona(acronimo,nombre,categoria,correo,rfc,tel,ciudad,dependencia,qr_enviado, email_registro, email_constancia, created_at, updated_at) VALUES('{data[1]}', '{data[2]}', '{data[3]}', '{data[4]}', {noneFormat(data[5])}, '{data[6]}', '{data[7]}', {noneFormat(data[8])}, false, NULL, NULL, '{data[9]}', '{data[10]}')")

    # -------MIGRACION jrn_evento > jrn_inscritos_taller-------
    cursor.execute("SELECT `isRegisteredT1`, `isRegisteredT2`, id_persona FROM jrn_evento WHERE `isRegisteredT1` = 1 OR `isRegisteredT2` = 1;")
    res = cursor.fetchall()

    for data in res:
        if data[0] == 1:
            cursor2.execute(f"INSERT INTO jrn_inscritos_talleres(asistio, constancia_enviada, constancia_enviada_at, id_persona, id_taller, created_at, updated_at) VALUES(0, 0, now(), {data[2]}, 1, now(), now())")

        if data[1] == 1:
            cursor2.execute(f"INSERT INTO jrn_inscritos_talleres(asistio, constancia_enviada, constancia_enviada_at, id_persona, id_taller, created_at, updated_at) VALUES(0, 0, now(), {data[2]}, 2, now(), now())")
    
    # -------MIGRACION jrn_evento > jrn_inscritos_modulos-------
    cursor.execute("SELECT ev.modulo, ev.`isAssistDay1`, ev.`isAssistDay2`, ev.`isAssistDay3`, ev.id_persona, ev.id_edicion, con.`isConstanciaSend` FROM jrn_evento ev INNER JOIN jrn_constancias con ON ev.id = con.id_evento WHERE ev.modulo IS NOT NULL AND con.nombre = 'CONGRESO';")
    res = cursor.fetchall()

    for data in res:
        id_modulo = 1

        if data[0] == 'MEDICINA':
            id_modulo = 1

        if data[0] == 'ENFERMERIA':
            id_modulo = 2
        
        if data[0] == 'QUIMICOS':
            id_modulo = 3
        
        if data[0] == 'ESTOMATOLOGIA':
            id_modulo = 4

        cursor2.execute(f"INSERT INTO jrn_inscritos_modulos(asistioDia1, asistioDia2, asistioDia3, constancia_enviada, constancia_enviada_at, id_persona, id_modulo, id_edicion, created_at, updated_at) VALUES({data[1]}, {data[2]}, {data[3]}, {data[6]}, now(), {data[4]}, {id_modulo}, {data[5]}, now(), now())")

    # -------FIN MIGRACIÓN - APLICAR CAMBIOS-------
    database2.commit()

    cursor.close()
    database.close()

    cursor2.close()
    database2.close()
    print("Migración finalizada\n")
