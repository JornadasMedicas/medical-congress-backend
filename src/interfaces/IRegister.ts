export interface WorkshopsFormInterface {
    checked: boolean;
    name: string;
}

export interface PropsTalleresInterface {
    asistio: boolean;
    constancia_enviada: boolean;
    id_taller: number;
}

export interface PropsSendRegistMailInterface {
    categoria: string;
    acronimo: string;
    nombre: string;
    apellidos: string;
    rfc?: string;
    correo: string;
    tel: string;
    ciudad: string;
    dependencia?: string;
    edicion: number;
    modulo: number;
    talleres: PropsTalleresInterface[];
    recaptchaToken: string;
}
